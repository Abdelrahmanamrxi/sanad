// app/api/widget/chat/route.ts
import { NextResponse } from "next/server";
import { handle } from "@/http/async-handler";
import AppError from "@/http/error";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { verifyWidgetSession } from "../../../../features/dashboard/widget/server/token";
import { sovereign } from "@/lib/ai/providers/openai";
import { streamText, createTextStreamResponse } from "ai";
import {
  checkUsageLimit,
  recordMessageUsage,
} from "@/features/billing/services/usage";
import {
  RetrieveChunks,
  formatChunks,
} from "@/features/dashboard/knowledge-base/services/retrieval/retrieve-chunk";
export const POST = handle(async (req) => {
  // 🔒 1. MANDATORY AUTH: Verify the signed widget session token
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Unauthorized: Missing session token", 401);
  }

  const token = authHeader.split(" ")[1];
  const session = await verifyWidgetSession(token);
  if (!session) {
    throw new AppError("Invalid or expired session token", 401);
  }

  // Securely extracted from the cryptographically signed token (cannot be forged)
  const { businessId, conversationId } = session;

  // 📦 2. Read the new message AND the recent history from the body
  const { message, messages = [] } = await req.json();

  if (!message || typeof message !== "string" || !message.trim()) {
    throw new AppError("Message content cannot be empty", 400);
  }

  // 💳 3. Check Quota & Bot Name in parallel
  const [quota, { data: widgetSettings }] = await Promise.all([
    checkUsageLimit(businessId),
    supabaseAdminClient
      .from("widget_settings")
      .select("bot_name")
      .eq("business_id", businessId)
      .maybeSingle(),
  ]);

  if (!quota.allowed) {
    return new Response(
      "This store assistant has reached its monthly message limit. Please contact customer support directly.",
      { status: 400 },
    );
  }

  const isFreePlan = quota.tier === "free";
  const assistantName = isFreePlan
    ? "Sanad AI"
    : widgetSettings?.bot_name?.trim() || "Sanad AI";

  // 🔍 4. Contextualize search using the last user question from the body
  const lastUserQuestion = messages
    .filter(
      (m: { role: "user" | "assistant"; content: string }) => m.role === "user",
    )
    .pop()?.content;

  const retrievalQuery = lastUserQuestion
    ? `${lastUserQuestion} - ${message.trim()}`
    : message.trim();

  // 📚 5. RAG Retrieval
  const retrievedChunks = await RetrieveChunks({
    query: retrievalQuery,
    businessId,
    rrfK: 60,
  });
  
  const context = formatChunks(retrievedChunks);
  const chunkIds = retrievedChunks.map((c) => c.id).filter(Boolean);
  const topScore = retrievedChunks[0]?.similarity ?? null;
  const startTime = performance.now();

  // 🤖 6. Stream with recent history
  const result = streamText({
    model: sovereign.chat("SovereignEG/Qwen3.8-27B-FP8"),
    system: `You are ${assistantName}, a verified customer support specialist.
Base your response strictly and accurately on the verified store context below.
If the information is not in the context, politely state that it is not documented in store policies.

=== STORE VERIFIED CONTEXT ===
${context}`,
    messages: [
      ...messages.slice(-5), //  Last 5 messages from React state
      { role: "user", content: message.trim() },
    ],
    temperature: 0.2,

    onFinish: async ({ text, usage }) => {
      const latencyMs = Math.round(performance.now() - startTime);

      // Persist user and assistant messages together
      await supabaseAdminClient.from("messages").insert([
        {
          conversation_id: conversationId,
          business_id: businessId,
          role: "user",
          content: message.trim(),
        },
        {
          conversation_id: conversationId,
          business_id: businessId,
          role: "assistant",
          content: text,
          sources: chunkIds,
          top_score: topScore,
          tokens_in: usage?.inputTokens ?? 0,
          tokens_out: usage?.outputTokens ?? 0,
          latency_ms: latencyMs,
        },
      ]);

      await supabaseAdminClient
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      await recordMessageUsage({
        businessId,
        tokensIn: usage?.inputTokens ?? 0,
        tokensOut: usage?.outputTokens ?? 0,
      });
    },
  });

  return createTextStreamResponse({
    stream: result.textStream,
  });
});
