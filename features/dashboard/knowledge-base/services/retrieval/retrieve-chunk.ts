import createClient from "@/lib/supabase/server";
import { generateEmbedding } from "../embedding/generate-embedding";
import type { SupabaseClient } from "@supabase/supabase-js";

// Interface type for Retrieved Chunks

export interface RetrievedChunk {
  id: string;
  documentId: string;
  documentName?: string;
  content: string;
  headingPath?: string | null;
  heading_path: string | null;
  similarity: number;
  score: number;
}


export function formatChunks(chunks: RetrievedChunk[]) {
  if (!chunks || chunks.length === 0) {
    return "No relevant documents found in knowledge base.";
  }

  return chunks
    .map((chunk, index) => {
      const heading = chunk.headingPath || chunk.heading_path ? ` | Section: ${chunk.headingPath || chunk.heading_path}` : "";
      return `[Document Source #${index + 1}${heading}]\n${chunk.content}`;
    })
    .join("\n\n---\n\n");
}


// Interface type for the Supabase RPC Hybrid Search Params
export interface RetrievalParams {
  query: string;
  businessId: string;
  matchCount?: number;
  rrfK?: number;
  supabaseClient?: SupabaseClient;
}
export async function RetrieveChunks({
  query,
  businessId,
  matchCount = 8,
  rrfK = 60,
  supabaseClient,
}: RetrievalParams): Promise<RetrievedChunk[]> {
  const supabase = supabaseClient ?? (await createClient());

  const [embeddings] = await generateEmbedding([query]);
  if (!embeddings) {
    throw new Error("Failed to generate query embeddings");
  }
  const { data, error } = await supabase.rpc("hybrid_match_chunks", {
    query_text: query,
    match_business_id: businessId,
    match_count: matchCount,
    rrf_k: rrfK,
    query_embedding: embeddings,
  });

  if (error) {
    throw new Error(`Failed to retrieve an answer: ${error.message}`);
  }

  const rawRows = (data as Array<{
    id: string;
    document_id: string;
    content: string;
    heading_path: string | null;
    similarity: number;
    score: number;
  }>) ?? [];

  // Fetch human-readable document filenames
  const docIds = [...new Set(rawRows.map((r) => r.document_id).filter(Boolean))];
  let docNameMap = new Map<string, string>();
  if (docIds.length > 0) {
    const { data: docs } = await supabase
      .from("documents")
      .select("id, name")
      .in("id", docIds);
    if (docs) {
      docNameMap = new Map(docs.map((d) => [d.id, d.name]));
    }
  }

  return rawRows.map((row) => ({
    id: row.id,
    documentId: row.document_id,
    documentName: docNameMap.get(row.document_id) || "Document",
    content: row.content,
    headingPath: row.heading_path,
    heading_path: row.heading_path,
    similarity: typeof row.similarity === "number" ? row.similarity : 0.8,
    score: typeof row.score === "number" ? row.score : 0,
  }));
}
