import { handle } from "@/http/async-handler";
import { groq } from "@ai-sdk/groq";
import { sovereign } from "@/lib/ai/providers/openai";
import { streamText, createTextStreamResponse } from "ai";
import { getAuthContext } from "@/lib/auth";
import { z } from "zod";
import {
  RetrieveChunks,
  formatChunks,
} from "@/features/dashboard/knowledge-base/services/retrieval/retrieve-chunk";

const defaultSystemPresets = {
  model: "SovereignEG/Qwen3.8-27B-FP8",
  systemPrompt: "You are Sanad AI, a verified customer support specialist.",
  temperature: 0.2,
  strictGrounding: true,
};

const chatRequestSchema = z.object({
  query: z.string().optional().default(""),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
      }),
    )
    .optional()
    .default([]),
  systemPresets: z
    .object({
      model: z.string().default("SovereignEG/Qwen3.8-27B-FP8"),
      systemPrompt: z
        .string()
        .default("You are Sanad AI, a verified customer support specialist."),
      temperature: z.number().min(0).max(1).default(0.2),
      strictGrounding: z.boolean().default(true),
    })
    .default(defaultSystemPresets),
});

export const POST = handle(async (req) => {
  const body = await req.json();

  const { messages, systemPresets, query } = chatRequestSchema.parse(body);

  const { businessId } = await getAuthContext();

  const startMs = performance.now();

  // Find latest user query for RAG embedding retrieval
  const latestQuery =
    query ||
    (Array.isArray(messages)
      ? messages.filter((m: { role: string }) => m.role === "user").pop()
          ?.content
      : "") ||
    "";

  const retrievedChunks = await RetrieveChunks({
    query: latestQuery,
    businessId,
    rrfK: 60,
  });

  const conversationMessages =
    Array.isArray(messages) && messages.length > 0
      ? messages.map(
          (m: { role: "user" | "assistant" | "system"; content: string }) => ({
            role: m.role,
            content: m.content,
          }),
        )
      : [{ role: "user" as const, content: latestQuery }];

  const effectiveTemperature = systemPresets.temperature ?? 0.2;
  const groundingInstructions = systemPresets.strictGrounding
    ? `CRITICAL INSTRUCTIONS:
1. Rely strictly on the retrieved context below.
2. If the user's question cannot be answered using the provided context, politely inform them that this information is not documented in the verified knowledge base.`
    : `Answer questions helpfully based on the context and general domain knowledge.`;

  const result = streamText({
    model: sovereign.chat("SovereignEG/Qwen3.8-27B-FP8"),
    system: `${systemPresets.systemPrompt}
    ${groundingInstructions}
=== VERIFIED DOCUMENT CONTEXT ===
${formatChunks(retrievedChunks)}`,
    messages: conversationMessages,
    temperature: effectiveTemperature,
  });

  const sources = retrievedChunks.map((source, index) => {
    return {
      id: source.id,
      documentId: source.documentId,
      documentName: source.documentName || "Document",
      headingPath: source.headingPath || source.heading_path || null,
      content: source.content ? source.content.slice(0, 500) : "",
      similarity:
        typeof source.similarity === "number" ? source.similarity : 0.85,
      rank: index + 1,
      includedInContext: true,
    };
  });

  const latencyMs = Math.round(performance.now() - startMs);

  return createTextStreamResponse({
    stream: result.textStream,
    headers: {
      "x-sources": encodeURIComponent(JSON.stringify(sources)),
      "x-latency": encodeURIComponent(JSON.stringify(latencyMs)),
    },
  });
});
