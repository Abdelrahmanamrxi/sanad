import createClient from "@/lib/supabase/server";
import { generateEmbedding } from "../embedding/generate-embedding";

// Interface type for Retrieved Chunks

export interface RetrievedChunk {
  id: string;
  documentId: string;
  content: string;
  heading_path: string | null;
  similiarity: number;
  score: number;
}

// Interface type for the Supabase RPC Hybrid Search Params
export interface RetrievalParams {
  query: string;
  businessId: string;
  matchCount?: number;
  rrfK: number;
}
export async function RetrieveChunks({
  query,
  businessId,
  matchCount = 8,
  rrfK = 60,
}: RetrievalParams): Promise<RetrievedChunk[]> {
  const supabase = await createClient();

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
  return (data as RetrievedChunk[]) ?? [];
}
