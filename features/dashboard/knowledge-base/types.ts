export type DocStatus = "indexed" | "ready" | "processing" | "queued" | "failed";


export type MimeType = "docx" | "pdf" | "txt" | "markdown";


export interface DocumentStats {
  total_chunks: number
  total_tokens: number
  file_size: number // in bytes
}

export interface QueryStat {
  query: string
  count: number
}

export interface DocumentPerformance {
  times_cited_30d: number
  times_cited_7d: number
  satisfaction_rate: number // percentage, e.g. 96
  thumbs_down_count: number
  top_queries_helped: QueryStat[]
  suggested_questions: string[]
}

export interface DocumentItem {
  id: string
  business_id: string
  name?: string
  storage_path: string
  markdown_path?: string
  mime_type: MimeType
  doc_status: DocStatus
  stats: DocumentStats
  performance?: DocumentPerformance
  error_message?: string
  created_at: string
  file_size?: number
}


export interface ChunkItem {
  id: string
  document_id: string
  chunk_index: number
  content: string
  token_count: number
  embedding_model: string
  page_number?: number
  heading_path?: string
  metadata?: Record<string, unknown>
  created_at: string
}
export interface FetchDocumentsParams {
  name?: string;
  mimeType?: MimeType | "all";
}