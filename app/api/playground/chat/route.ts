import { handle } from "@/lib/async-handler";
import { NextResponse } from "next/server";
import { groq } from "@ai-sdk/groq";
import { streamText, createTextStreamResponse } from "ai";
import { getAuthContext } from "@/lib/auth";
import {
  RetrieveChunks,
  formatChunks,
} from "@/features/dashboard/knowledge-base/services/retrieval/retrieve-chunk";

export const POST = handle(async (req) => {
  const { messages, query, modelId, temperature } = await req.json();

  const { businessId } = await getAuthContext();

  const startMs = performance.now();

  // Find latest user query for RAG embedding retrieval
  const latestQuery =
    query ||
    (Array.isArray(messages)
      ? messages.filter((m: { role: string }) => m.role === "user").pop()?.content
      : "") ||
    "";

  const retrievedChunks = await RetrieveChunks({ query: latestQuery, businessId, rrfK: 60 });

  const conversationMessages =
    Array.isArray(messages) && messages.length > 0
      ? messages.map((m: { role: "user" | "assistant" | "system"; content: string }) => ({
          role: m.role,
          content: m.content,
        }))
      : [{ role: "user" as const, content: latestQuery }];

  const result = streamText({
    model: groq(modelId || "openai/gpt-oss-120b"),
    system: `You are Sanad AI, a verified customer support specialist.
Your primary directive is absolute truthfulness based ONLY on the provided verified document passages below.
CRITICAL INSTRUCTIONS:
1. Rely strictly on the retrieved context below.
2. If the user's question cannot be answered using the provided context, politely inform them that this information is not documented in the verified knowledge base.
3. Maintain conversational continuity by referencing earlier parts of the conversation if relevant.
=== VERIFIED DOCUMENT CONTEXT ===
${formatChunks(retrievedChunks)}`,
    messages: conversationMessages,
    temperature: temperature ?? 0.2,
  });

  const sources = retrievedChunks.map((source, index) => {
    return {
      id: source.id,
      documentId: source.documentId,
      documentName: source.documentName || "Document",
      headingPath: source.headingPath || source.heading_path || null,
      content: source.content ? source.content.slice(0, 500) : "",
      similarity: typeof source.similarity === "number" ? source.similarity : 0.85,
      rank: index + 1,
      includedInContext: true,
    };
  });

  const latencyMs = Math.round(performance.now() - startMs);

  return createTextStreamResponse({
    stream: result.textStream,
    headers: {
      "x-sources": encodeURIComponent(JSON.stringify(sources)),
      "x-latency":encodeURIComponent(JSON.stringify(latencyMs))
    },
  });
});
