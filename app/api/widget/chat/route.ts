// app/api/widget/chat/route.ts
import { NextResponse } from "next/server";
import { handle } from "@/http/async-handler";
import AppError from "@/http/error";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { verifyWidgetSession } from "../../../../features/dashboard/widget/server/token";
import { sovereign } from "@/lib/ai/providers/openai";
import { streamText, createTextStreamResponse } from "ai";
import { checkUsageLimit, recordMessageUsage } from "@/features/billing/services/usage";
import {
  RetrieveChunks,
  formatChunks,
} from "@/features/dashboard/knowledge-base/services/retrieval/retrieve-chunk";

export const POST = handle(async (req:Request) => {
  // 1. Authenticate the Visitor Session Token
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Unauthorized: Missing session token", 401);
  }

  const token = authHeader.split(" ")[1];
  const session = await verifyWidgetSession(token);
  if (!session) {
    throw new AppError("Invalid or expired session token", 401);
  }

  const { businessId, conversationId } = session;
  const { message } = await req.json();

  if (!message || typeof message !== "string" || !message.trim()) {
    throw new AppError("Message content cannot be empty", 400);
  }

  // 2. Check Quota / Plan Limits
  const quota = await checkUsageLimit(businessId);
  if (!quota.allowed) {
    return new Response(
      "This store assistant has reached its monthly message limit. Please contact customer support directly.",
      {
        status: 400,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }
    );
  }

  const startTime = performance.now();

  // 3. Save User Message into the DB
  await supabaseAdminClient.from("messages").insert({
    conversation_id: conversationId,
    business_id: businessId,
    role: "user",
    content: message.trim(),
  });

  // 4. Retrieve RAG chunks from Knowledge Base & fetch store bot settings in parallel
  const [retrievedChunks, { data: widgetSettings }] = await Promise.all([
    RetrieveChunks({
      query: message.trim(),
      businessId,
      rrfK: 60,
    }),
    supabaseAdminClient
      .from("widget_settings")
      .select("bot_name")
      .eq("business_id", businessId)
      .maybeSingle(),
  ]);

  // If free plan, locked to "Sanad AI". If paid tier, use custom bot_name
  const isFreePlan = quota.tier === "free";
  const assistantName = isFreePlan
    ? "Sanad AI"
    : (widgetSettings?.bot_name?.trim() || "Sanad AI");

  const context = formatChunks(retrievedChunks);
  const chunkIds = retrievedChunks.map((c) => c.id).filter(Boolean);
  const topScore = retrievedChunks[0]?.similarity ?? null;

  // 5. Stream LLM Generation using SovereignEG .chat()
  const result = streamText({
    model: sovereign.chat("SovereignEG/Qwen3.8-27B-FP8"),
    system: `You are ${assistantName}, a verified customer support specialist.
Base your response strictly and accurately on the verified store context below.
If the information is not in the context, politely state that it is not documented in store policies.

=== STORE VERIFIED CONTEXT ===
${context}`,
    messages: [{ role: "user", content: message.trim() }],
    temperature: 0.2,

    // 6. On stream completion, persist assistant message and update billing
    onFinish: async ({ text, usage }) => {
      const latencyMs = Math.round(performance.now() - startTime);
      const tokensIn = usage?.inputTokens ?? 0;
      const tokensOut = usage?.outputTokens ?? 0;

      // Insert Assistant Message
      await supabaseAdminClient.from("messages").insert({
        conversation_id: conversationId,
        business_id: businessId,
        role: "assistant",
        content: text,
        sources: chunkIds,
        top_score: topScore,
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        latency_ms: latencyMs,
      });

      // Update Conversation Timestamp
      await supabaseAdminClient
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      // Atomically increment the store's monthly billing counter
      await recordMessageUsage({
        businessId,
        tokensIn,
        tokensOut,
      });
    },
  });

  return createTextStreamResponse({
    stream: result.textStream,
  });
});
