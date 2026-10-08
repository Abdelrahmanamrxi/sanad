"use client"

import React from "react"
import { Copy, Check } from "lucide-react"
import type { ChunkItem } from "../types"

interface ChunkCardProps {
  chunk: ChunkItem
  documentCreatedAt: string
  isCopied: boolean
  onCopy: (chunkId: string, text: string) => void
}

export function ChunkCard({
  chunk,
  documentCreatedAt,
  isCopied,
  onCopy,
}: ChunkCardProps) {
  return (
    <div className="border border-border bg-background p-3.5 flex flex-col gap-2 transition-colors hover:border-border/80 rounded-none">
      {/* Chunk Top Strip: Index, Heading Path, Token Count, Page */}
      <div className="flex items-center justify-between border-b border-border/40 pb-2 text-[10px] font-mono text-muted-foreground">
        <div className="flex items-center gap-2 min-w-0">
          <span className="border border-primary/40 bg-primary/10 px-1.5 py-px text-primary font-bold rounded-none">
            Chunk #{chunk.chunk_index + 1}
          </span>
          {chunk.heading_path && (
            <span
              className="truncate text-foreground font-semibold"
              title={chunk.heading_path}
            >
              {chunk.heading_path}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {chunk.page_number && (
            <span className="border border-border px-1 py-px bg-muted rounded-none">
              Page {chunk.page_number}
            </span>
          )}
          <span className="border border-border px-1 py-px bg-muted text-foreground rounded-none">
            {chunk.token_count} tokens
          </span>
          <button
            type="button"
            onClick={() => onCopy(chunk.id, chunk.content)}
            className="p-1 hover:text-foreground text-muted-foreground transition-colors rounded-none"
            title="Copy chunk text"
          >
            {isCopied ? (
              <Check className="size-3 text-success" />
            ) : (
              <Copy className="size-3" />
            )}
          </button>
        </div>
      </div>

      {/* Raw Content Box with Arabic RTL isolation */}
      <div className="border border-border/60 bg-card p-3 rounded-none">
        <p
          dir="auto"
          className="font-sans text-xs text-foreground leading-relaxed whitespace-pre-wrap text-start"
        >
          {chunk.content}
        </p>
      </div>

      {/* Vector metadata footer */}
      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-0.5">
        <span>Model: {chunk.embedding_model} (1536 dim)</span>
        <span>Indexed: {documentCreatedAt}</span>
      </div>
    </div>
  )
}
