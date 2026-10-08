export type DocStatus = "indexed" | "processing" | "failed"

export type MimeType =
  | "application/pdf"
  | "text/markdown"
  | "text/plain"
  | "text/csv"

export interface DocumentStats {
  total_chunks: number
  total_tokens: number
  file_size: number // in bytes
}

export interface DocumentItem {
  id: string
  business_id: string
  storage_path: string
  markdown_path?: string
  mime_type: MimeType
  doc_status: DocStatus
  stats: DocumentStats
  error_message?: string
  created_at: string
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
