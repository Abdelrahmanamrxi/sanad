import { NextResponse } from "next/server";
import { z } from "zod";
import { streamText, createTextStreamResponse } from "ai";
import { handle } from "@/http/async-handler";
import AppError from "@/http/error";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { sovereign } from "@/lib/ai/providers/openai";
import { verifyWidgetSession } from "@/features/embed/server/token";
import {
  checkUsageLimit,
  recordMessageUsage,
} from "@/features/billing/services/usage";
import {
  RetrieveChunks,
  formatChunks,
} from "@/features/dashboard/knowledge-base/services/retrieval/retrieve-chunk";

const chatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, { message: "Message content cannot be empty" })
    .max(4000, {
      message: "Message exceeds maximum length of 4,000 characters",
    }),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional()
    .default([]),
});

export const POST = handle(async (req) => {
  // 1. Authenticate widget session token
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Unauthorized: Missing or malformed session token", 401);
  }

  const token = authHeader.slice(7).trim();
  const session = await verifyWidgetSession(token);
  if (!session) {
    throw new AppError(
      "Invalid or expired session token. Please refresh the chat.",
      401,
    );
  }

  const { businessId, conversationId } = session;

  // 2. Parse and validate request body
  const rawBody = await req.json().catch(() => null);
  if (!rawBody) {
    throw new AppError("Malformed or empty request payload", 400);
  }

  const parseResult = chatRequestSchema.safeParse(rawBody);
  if (!parseResult.success) {
    throw new AppError(
      parseResult.error.issues[0]?.message || "Invalid chat request payload",
      400,
    );
  }

  const { message, messages } = parseResult.data;

  // 3. Concurrently check subscription message quota and fetch custom bot settings
  const [quota, { data: widgetSettings }] = await Promise.all([
    checkUsageLimit(businessId),
    supabaseAdminClient
      .from("widget_settings")
      .select("bot_name")
      .eq("business_id", businessId)
      .maybeSingle(),
  ]);

  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: "Quota Exceeded",
        message:
          "This storefront assistant has reached its monthly message limit. Please contact store support directly.",
      },
      { status: 429 },
    );
  }

  const isFreePlan = quota.tier === "free";
  const assistantName = isFreePlan
    ? "Sanad AI"
    : widgetSettings?.bot_name?.trim() || "Sanad AI";

  // 4. Contextualize RAG search using recent user conversation history
  const lastUserQuestion = messages
    .filter((m) => m.role === "user")
    .pop()?.content;

  const retrievalQuery = lastUserQuestion
    ? `${lastUserQuestion} - ${message}`
    : message;

  // 5. Retrieve verified knowledge base chunks with graceful degradation
  let context = "";
  let chunkIds: string[] = [];
  let topScore: number | null = null;

  try {
    const retrievedChunks = await RetrieveChunks({
      query: retrievalQuery,
      businessId,
      rrfK: 60,
    });

    context = formatChunks(retrievedChunks);
    chunkIds = retrievedChunks.map((c) => c.id).filter(Boolean);
    topScore = retrievedChunks[0]?.similarity ?? null;
  } catch (retrievalErr) {
    console.error("[Chat Route] Knowledge retrieval error:", retrievalErr);
    context = "";
  }

  const startTime = performance.now();

  // 6. Stream grounded response with LLM
  const result = streamText({
    model: sovereign.chat("SovereignEG/Qwen3.8-27B-FP8"),
    system: `You are ${assistantName}, a professional customer support AI specialist for an online storefront.
Base your responses strictly and directly on the verified store context below.
Provide direct, concise, and helpful answers. Format your output cleanly with short paragraphs and bullet points where helpful.
Never start your response with empty lines.
Do not use emojis anywhere in your response. Maintain clean typography and professional language.
If the requested information is not present in the context, politely clarify that it is not documented in the store's verified policies.

=== STORE VERIFIED CONTEXT ===
${context}`,
    messages: [
      ...messages.slice(-5), // Maintain last 5 conversation context turns
      { role: "user", content: message },
    ],
    temperature: 0.2,

    onFinish: async ({ text, usage }) => {
      const latencyMs = Math.round(performance.now() - startTime);

      try {
        // Persist both user inquiry and assistant response together in one transaction
        const { error: insertError } = await supabaseAdminClient
          .from("messages")
          .insert([
            {
              conversation_id: conversationId,
              business_id: businessId,
              role: "user",
              content: message,
              sources: [],
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

        if (insertError) {
          console.error(
            "[Chat Route] Failed to persist messages:",
            insertError,
          );
        }

        // Update conversation last_message_at timestamp
        await supabaseAdminClient
          .from("conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId);

        // Record usage counters atomically
        await recordMessageUsage({
          businessId,
          tokensIn: usage?.inputTokens ?? 0,
          tokensOut: usage?.outputTokens ?? 0,
        });
      } catch (err) {
        console.error(
          "[Chat Route] Error during message persistence or usage recording:",
          err,
        );
      }
    },
  });

  return createTextStreamResponse({
    stream: result.textStream,
  });
});
