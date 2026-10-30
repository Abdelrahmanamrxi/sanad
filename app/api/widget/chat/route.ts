import { NextResponse } from "next/server";
import { z } from "zod";
import { streamText, createTextStreamResponse } from "ai";
import { handle } from "@/http/async-handler";
import AppError from "@/http/error";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { sovereign } from "@/lib/ai/providers/openai";
import { verifyWidgetSession } from "@/features/embed/server/token";
import { getConversationTitleAndSummary } from "@/features/embed/server/conversation-summary";
import {
  checkUsageLimit,
  recordMessageUsage,
} from "@/features/billing/services/usage";
import { PLANS, type PlanTier } from "@/features/billing/plans";
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

function isGreetingOrSmallTalk(msg: string): boolean {
  const cleaned = msg
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length === 0) return true;
  if (cleaned.length <= 3 && !msg.includes("?") && !msg.includes("؟")) return true;

  const smallTalkPatterns = [
    // English greetings, pleasantries & acknowledgments
    /^(hi|hello|hey|good (morning|evening|afternoon|day)|greetings|welcome|salam)( there)?$/i,
    /^(thanks|thank you|thank you so much|many thanks|thx|ty|bye|goodbye|see you|take care|ok|okay|got it|cool|great|awesome)$/i,
    // Arabic greetings, pleasantries & acknowledgments
    /^(مرحبا|مرحباً|مرحب|أهلا|اهلا|أهلاً|اهلاً|أهليـن|اهلين|يا هلا|هلا|هاي|هلو)( (وسهلا|بيك|بك|يا غالي))?$/i,
    /^(السلام عليكم( ورحمة الله( وبركاته)?)?|سلام عليكم|وعليكم السلام)$/i,
    /^(صباح (الخير|النور|الورد)|مساء (الخير|النور|الورد))$/i,
    /^(شكرا|شكراً|مشكور|تسلم|يعطيك (العافيه|العافية)|جزاك الله خير|تمام|اوك|أوك|ماشي|حاضر|طيب|مع السلامة|باي)$/i,
  ];

  return smallTalkPatterns.some((pattern) => pattern.test(cleaned));
}

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
  // Separate prior conversation history from the current incoming message
  const priorMessages =
    messages.length > 0 &&
    messages[messages.length - 1].content === message &&
    messages[messages.length - 1].role === "user"
      ? messages.slice(0, -1)
      : messages;

  const lastPriorUserQuestion = priorMessages
    .filter((m) => m.role === "user")
    .pop()?.content;

  const retrievalQuery =
    lastPriorUserQuestion && lastPriorUserQuestion !== message
      ? `${lastPriorUserQuestion} - ${message}`
      : message;

  // 5. Retrieve verified knowledge base chunks with graceful degradation
  let context = "";
  let chunkIds: string[] = [];
  let topScore: number | null = null;

  try {
    const retrievedChunks = await RetrieveChunks({
      query: retrievalQuery,
      businessId,
      matchCount: 4, // Optimized from default 8: cuts input tokens in half and speeds up prompt prefill
      rrfK: 60,
      supabaseClient: supabaseAdminClient,
    });

    chunkIds = retrievedChunks.map((c) => c.id).filter(Boolean);
    topScore = retrievedChunks[0]?.similarity ?? null;
    context = retrievedChunks.length > 0 ? formatChunks(retrievedChunks) : "";
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
Provide direct, clear, and helpful answers. Avoid unnecessary filler.
Never start your response with empty lines.
Do not use emojis anywhere in your response. Maintain clean typography and professional language.
If the customer is greeting you (e.g. "hi", "hello", "السلام عليكم") or offering pleasantries, greet them back politely and ask how you can help them. Do NOT append [[SHOW_LEAD_FORM]] for simple greetings or pleasantries.
If the customer asks for a quote, human agent, or unlisted pricing, or asks a specific question that cannot be answered using the store context, append [[SHOW_LEAD_FORM]] at the very end of your response.

=== STORE VERIFIED CONTEXT ===
${context}`,
    messages: [
      ...priorMessages.slice(-4), // Maintain last 4 conversation context turns for token efficiency
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

        // Flag needs_attention if:
        // 1. The AI explicitly requested escalation/lead capture via [[SHOW_LEAD_FORM]]
        // 2. OR zero docs were found for a genuine question/inquiry (excluding greetings & small talk)
        const isUnansweredInquiry =
          chunkIds.length === 0 && !isGreetingOrSmallTalk(message);
        const needsAttention =
          text.includes("[[SHOW_LEAD_FORM]]") || isUnansweredInquiry;

        await supabaseAdminClient
          .from("conversations")
          .update({
            last_message_at: new Date().toISOString(),
            ...(needsAttention ? { status: "needs_attention" } : {}),
          })
          .eq("id", conversationId);

        // Record usage counters atomically
        await recordMessageUsage({
          businessId,
          tokensIn: usage?.inputTokens ?? 0,
          tokensOut: usage?.outputTokens ?? 0,
        });

        if (priorMessages.length === 0) {
          await getConversationTitleAndSummary({
            userMessage: message,
            assistantResponse: text,
            conversationId,
            model: sovereign.chat("SovereignEG/Qwen3.8-27B-FP8"),
          });
        }
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
