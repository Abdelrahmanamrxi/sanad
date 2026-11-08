import { NextResponse } from "next/server";
import { streamText, createTextStreamResponse } from "ai";
import { handle } from "@/http/async-handler";
import AppError from "@/http/error";
import { sovereign } from "@/lib/ai/providers/openai";
import { verifyWidgetSession } from "@/features/embed/server/token";
import { checkUsageLimit } from "@/features/billing/services/usage";
import { chatRequestSchema } from "@/features/embed/schemas/chat"
import { checkWidgetRateLimit } from "@/features/embed/server/rate-limiter";
import { buildRetrievalQuery } from "@/features/embed/server/knowledge-retrieval";
import { getWidgetBotConfig } from "@/features/embed/server/bot-config";
import { retrieveWidgetKnowledge } from "@/features/embed/server/knowledge-retrieval";
import { persistChatExchangeAndStatus } from "@/features/embed/server/persist-messages";



export const POST = handle(async (req) => {
  // 1. Authenticate widget session token
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Unauthorized: Missing or malformed session token", 401);
  }

  const session = await verifyWidgetSession(authHeader.slice(7).trim());
  if (!session) {
    throw new AppError(
      "Invalid or expired session token. Please refresh the chat.",
      401
    );
  }

  const { businessId, conversationId } = session;

  // 2. Parse and validate request payload
  const rawBody = await req.json().catch(() => null);
  if (!rawBody) {
    throw new AppError("Malformed or empty request payload", 400);
  }

  const parseResult = chatRequestSchema.safeParse(rawBody);
  if (!parseResult.success) {
    throw new AppError(
      parseResult.error.issues[0]?.message || "Invalid chat request payload",
      400
    );
  }

  // 3. Enforce IP rate limiting (10 req/min)
  const rawIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1";

  const isAllowed = await checkWidgetRateLimit(businessId, rawIp);
  if (!isAllowed) {
    return NextResponse.json(
      {
        error: "Rate Limit Exceeded",
        message: "Too many messages sent. Please wait a minute before trying again.",
      },
      {
        status: 429,
        headers: { "Retry-After": "60" },
      }
    );
  }

  const { message, messages } = parseResult.data;

  // 4. Verify subscription message quota
  const quota = await checkUsageLimit(businessId);
  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: "Quota Exceeded",
        message:
          "This storefront assistant has reached its monthly message limit. Please contact store support directly.",
      },
      { status: 429 }
    );
  }

  // 5. Concurrently load bot configuration and retrieve knowledge base chunks
  const priorMessages =
    messages.length > 0 &&
    messages[messages.length - 1].content === message &&
    messages[messages.length - 1].role === "user"
      ? messages.slice(0, -1)
      : messages;

  const retrievalQuery = buildRetrievalQuery(message, priorMessages);

  const [botConfig, { context, chunkIds, highestSimilarity, citationPayload }] =
    await Promise.all([
      getWidgetBotConfig(businessId, quota.tier),
      retrieveWidgetKnowledge(retrievalQuery, businessId),
    ]);

  const startTime = performance.now();

  // 6. Stream grounded response with LLM
  const result = streamText({
    model: sovereign.chat("SovereignEG/Qwen3.8-27B-FP8"),
    system: `You are ${botConfig.assistantName}, a professional customer support AI specialist for an online storefront.
Base your responses strictly and directly on the verified store context below.
Provide direct, clear, and helpful answers. Avoid unnecessary filler.
Never start your response with empty lines.
Do not use emojis anywhere in your response. Maintain clean typography and professional language.
If the customer is greeting you (e.g. "hi", "hello", "السلام عليكم") or offering pleasantries, greet them back politely and ask how you can help them. Do NOT append [[SHOW_LEAD_FORM]] for simple greetings or pleasantries.
If the customer asks for a quote, human agent, or unlisted pricing, or asks a specific question that cannot be answered using the store context, append [[SHOW_LEAD_FORM]] at the very end of your response.

${botConfig.customInstructions ? `=== STORE SPECIFIC INSTRUCTIONS & RULES ===\n${botConfig.customInstructions}\n` : ""}
=== STORE VERIFIED CONTEXT ===
${context}`,
    messages: [
      ...priorMessages.slice(-4), // Maintain last 4 turns for token efficiency
      { role: "user", content: message },
    ],
    temperature: botConfig.effectiveTemperature,

    onFinish: async ({ text, usage }) => {
      const latencyMs = Math.round(performance.now() - startTime);
      try {
        await persistChatExchangeAndStatus({
          conversationId,
          businessId,
          userMessage: message,
          assistantText: text,
          chunkIds,
          highestSimilarity,
          usage,
          latencyMs,
          priorMessagesCount: priorMessages.length,
        });
      } catch (err) {
        console.error(
          "[Chat Route] Error during message persistence or usage recording:",
          err
        );
      }
    },
  });

  const responseHeaders: Record<string, string> = {
    "Access-Control-Expose-Headers": "x-sanad-citation",
  };
  if (citationPayload) {
    responseHeaders["x-sanad-citation"] = encodeURIComponent(
      JSON.stringify(citationPayload)
    );
  }

  return createTextStreamResponse({
    stream: result.textStream,
    headers: responseHeaders,
  });
});
