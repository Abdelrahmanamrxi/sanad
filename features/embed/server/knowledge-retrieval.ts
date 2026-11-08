import "server-only";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { RetrieveChunks } from "@/features/dashboard/knowledge-base/services/retrieval/retrieve-chunk";
import { formatChunks } from "@/features/dashboard/knowledge-base/services/retrieval/retrieve-chunk";
import { type RetrievedContext } from "../types";
/**
 * Retrieves knowledge base chunks and computes highest similarity score
 */
export async function retrieveWidgetKnowledge(
  query: string,
  businessId: string
): Promise<RetrievedContext> {
  try {
    const retrievedChunks = await RetrieveChunks({
      query,
      businessId,
      matchCount: 4,
      rrfK: 60,
      supabaseClient: supabaseAdminClient,
    });

    const chunkIds = retrievedChunks.map((c) => c.id).filter(Boolean);
    const highestSimilarity =
      retrievedChunks.length > 0
        ? Math.max(...retrievedChunks.map((c) => c.similarity))
        : null;
    const context = retrievedChunks.length > 0 ? formatChunks(retrievedChunks) : "";

    let citationPayload: { documentTitle: string } | null = null;
    if (retrievedChunks.length > 0) {
      const topChunk = retrievedChunks[0];
      const rawName =
        topChunk.documentName ||
        (topChunk.headingPath
          ? topChunk.headingPath.split(">")[0].trim()
          : "Verified Knowledge");
      const cleanDocName =
        rawName.split(/[\\/]/).pop()?.trim() || "Verified Document";

      citationPayload = {
        documentTitle: cleanDocName,
      };
    }

    return {
      context,
      chunkIds,
      highestSimilarity,
      citationPayload,
    };
  } catch (retrievalErr) {
    console.error("[Chat Service] Knowledge retrieval error:", retrievalErr);
    return {
      context: "",
      chunkIds: [],
      highestSimilarity: null,
      citationPayload: null,
    };
  }
}


/**
 * Builds contextualized RAG query using latest prior question if relevant
 */
export function buildRetrievalQuery(
  currentMessage: string,
  priorMessages: Array<{ role: string; content: string }>
): string {
  const lastPriorUserQuestion = priorMessages
    .filter((m) => m.role === "user")
    .pop()?.content;

  return lastPriorUserQuestion && lastPriorUserQuestion !== currentMessage
    ? `${lastPriorUserQuestion} - ${currentMessage}`
    : currentMessage;
}

