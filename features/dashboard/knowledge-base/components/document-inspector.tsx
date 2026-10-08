"use client"

import React, { useState } from "react"
import { RefreshCw, Trash2, Search, AlertCircle } from "lucide-react"
import type { DocumentItem, ChunkItem } from "../types"
import { formatBytes, getFileName, getFormatBadge } from "../mock-data"
import { ChunkCard } from "./chunk-card"

interface DocumentInspectorProps {
  selectedDoc: DocumentItem | null
  chunks: ChunkItem[]
  onDeleteSingle: (doc: DocumentItem) => void
}

export function DocumentInspector({
  selectedDoc,
  chunks,
  onDeleteSingle,
}: DocumentInspectorProps) {
  const [inspectorTab, setInspectorTab] = useState<"chunks" | "markdown" | "metadata">("chunks")
  const [chunkSearch, setChunkSearch] = useState("")
  const [copiedChunkId, setCopiedChunkId] = useState<string | null>(null)

  const handleCopyChunk = (chunkId: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedChunkId(chunkId)
    setTimeout(() => setCopiedChunkId(null), 2000)
  }

  if (!selectedDoc) {
    return (
      <div className="border border-border bg-card p-12 text-center text-xs text-muted-foreground lg:col-span-7 rounded-none">
        Select a document from the left library to inspect chunks.
      </div>
    )
  }

  // Filtered chunks in inspector
  const filteredChunks = chunks.filter((chunk) => {
    if (!chunkSearch) return true
    return (
      chunk.content.toLowerCase().includes(chunkSearch.toLowerCase()) ||
      (chunk.heading_path &&
        chunk.heading_path.toLowerCase().includes(chunkSearch.toLowerCase()))
    )
  })

  return (
    <div className="border border-border bg-card p-5 lg:col-span-7 flex flex-col rounded-none">
      {/* Document Header & Global Actions */}
      <div className="border-b border-border pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 pe-2">
            <div className="flex items-center gap-2">
              <span className="border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-muted-foreground rounded-none">
                {getFormatBadge(selectedDoc.mime_type)}
              </span>
              <h2 className="truncate text-base font-bold text-foreground font-sans">
                {getFileName(selectedDoc.storage_path)}
              </h2>
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground truncate">
              {selectedDoc.storage_path}
            </p>
          </div>

          {/* Top-Right Action Buttons: Re-sync + Prominent Red Delete */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="flex items-center gap-1.5 border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors rounded-none font-mono"
            >
              <RefreshCw className="size-3 text-muted-foreground" />
              <span>Re-sync</span>
            </button>

            <button
              type="button"
              onClick={() => onDeleteSingle(selectedDoc)}
              className="flex items-center gap-1.5 border border-destructive bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors rounded-none font-mono"
            >
              <Trash2 className="size-3" />
              <span>Delete Document</span>
            </button>
          </div>
        </div>

        {/* Metadata Summary Strip */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-border/60 pt-3 sm:grid-cols-4 text-xs font-mono">
          <div className="border border-border bg-background p-2 rounded-none">
            <span className="block text-[9px] uppercase text-muted-foreground">
              Status
            </span>
            <span
              className={`text-xs font-bold uppercase ${
                selectedDoc.doc_status === "failed"
                  ? "text-destructive"
                  : "text-success"
              }`}
            >
              {selectedDoc.doc_status}
            </span>
          </div>

          <div className="border border-border bg-background p-2 rounded-none">
            <span className="block text-[9px] uppercase text-muted-foreground">
              Total Chunks
            </span>
            <span className="text-xs font-bold text-foreground">
              {selectedDoc.stats.total_chunks} chunks
            </span>
          </div>

          <div className="border border-border bg-background p-2 rounded-none">
            <span className="block text-[9px] uppercase text-muted-foreground">
              Tokens Used
            </span>
            <span className="text-xs font-bold text-primary">
              {selectedDoc.stats.total_tokens.toLocaleString()}
            </span>
          </div>

          <div className="border border-border bg-background p-2 rounded-none">
            <span className="block text-[9px] uppercase text-muted-foreground">
              File Size
            </span>
            <span className="text-xs font-bold text-foreground">
              {formatBytes(selectedDoc.stats.file_size)}
            </span>
          </div>
        </div>
      </div>

      {/* Inspector View Navigation Tabs */}
      <div className="mt-3 flex items-center justify-between border-b border-border pb-1">
        <div className="flex items-center gap-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => setInspectorTab("chunks")}
            className={`px-3 py-1.5 border-b-2 transition-colors font-medium rounded-none ${
              inspectorTab === "chunks"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Indexed Chunks ({chunks.length})
          </button>

          <button
            type="button"
            onClick={() => setInspectorTab("markdown")}
            className={`px-3 py-1.5 border-b-2 transition-colors font-medium rounded-none ${
              inspectorTab === "markdown"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Parsed Markdown
          </button>

          <button
            type="button"
            onClick={() => setInspectorTab("metadata")}
            className={`px-3 py-1.5 border-b-2 transition-colors font-medium rounded-none ${
              inspectorTab === "metadata"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Raw DB Record
          </button>
        </div>

        {inspectorTab === "chunks" && chunks.length > 0 && (
          <div className="relative w-48">
            <Search className="absolute start-2 top-1.5 size-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter chunks..."
              value={chunkSearch}
              onChange={(e) => setChunkSearch(e.target.value)}
              className="w-full border border-border bg-background py-1 ps-6 pe-2 text-[11px] text-foreground placeholder:text-muted-foreground focus:outline-none rounded-none font-mono"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Indexed Chunks List (The Core RAG View) */}
      {inspectorTab === "chunks" && (
        <div className="mt-4 flex flex-col gap-3 max-h-[calc(100vh-380px)] overflow-y-auto pe-1">
          {selectedDoc.doc_status === "failed" ? (
            <div className="border border-destructive/40 bg-destructive/5 p-4 text-xs text-destructive rounded-none">
              <div className="flex items-center gap-2 font-semibold">
                <AlertCircle className="size-4 shrink-0" />
                <span>Document Ingestion Failed</span>
              </div>
              <p className="mt-1.5 font-mono text-[11px] leading-relaxed">
                {selectedDoc.error_message}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  className="border border-destructive bg-destructive px-2.5 py-1 text-[11px] font-semibold text-destructive-foreground hover:bg-destructive/90 rounded-none font-mono"
                >
                  Retry Parser
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteSingle(selectedDoc)}
                  className="border border-destructive/40 bg-background px-2.5 py-1 text-[11px] text-destructive hover:bg-destructive/10 rounded-none font-mono"
                >
                  Purge Document
                </button>
              </div>
            </div>
          ) : filteredChunks.length === 0 ? (
            <div className="border border-dashed border-border p-6 text-center text-xs text-muted-foreground rounded-none">
              No vector chunks match your search query.
            </div>
          ) : (
            filteredChunks.map((chunk) => (
              <ChunkCard
                key={chunk.id}
                chunk={chunk}
                documentCreatedAt={selectedDoc.created_at}
                isCopied={copiedChunkId === chunk.id}
                onCopy={handleCopyChunk}
              />
            ))
          )}
        </div>
      )}

      {/* Tab 2: Parsed Markdown View */}
      {inspectorTab === "markdown" && (
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground font-mono border-b border-border/40 pb-2">
            <span>Path: {selectedDoc.markdown_path || "N/A"}</span>
            <span>Format: CommonMark / GFM</span>
          </div>
          <div className="border border-border bg-background p-4 max-h-[calc(100vh-380px)] overflow-y-auto rounded-none">
            <pre className="font-mono text-xs text-foreground leading-relaxed whitespace-pre-wrap">
              {`# ${getFileName(selectedDoc.storage_path)}

Document processed and converted to Markdown structure for vector embedding chunking.

${chunks.map((c) => `## ${c.heading_path || `Section ${c.chunk_index + 1}`}\n\n${c.content}`).join("\n\n---\n\n")}
`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Raw Supabase DB Record */}
      {inspectorTab === "metadata" && (
        <div className="mt-4 flex flex-col gap-2">
          <div className="border border-border bg-background p-4 max-h-[calc(100vh-380px)] overflow-y-auto rounded-none">
            <pre className="font-mono text-[11px] text-primary leading-relaxed whitespace-pre-wrap">
              {JSON.stringify(
                {
                  table: "documents",
                  id: selectedDoc.id,
                  business_id: selectedDoc.business_id,
                  storage_path: selectedDoc.storage_path,
                  markdown_path: selectedDoc.markdown_path,
                  mime_type: selectedDoc.mime_type,
                  doc_status: selectedDoc.doc_status,
                  stats: selectedDoc.stats,
                  error_message: selectedDoc.error_message || null,
                  created_at: selectedDoc.created_at,
                  chunks_table_count: chunks.length,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
