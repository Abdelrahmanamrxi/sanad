"use client"

import React from "react"
import { AlertCircle } from "lucide-react"
import type { DocumentItem } from "../types"
import { getFileName } from "../mock-data"

interface DeleteSingleModalProps {
  document: DocumentItem | null
  onClose: () => void
  onConfirm: () => void
}

export function DeleteSingleModal({
  document,
  onClose,
  onConfirm,
}: DeleteSingleModalProps) {
  if (!document) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md border border-destructive/60 bg-card p-6 shadow-2xl flex flex-col gap-3 rounded-none">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <h3 className="text-sm font-bold text-foreground">
            Confirm Document Deletion
          </h3>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you sure you want to permanently delete{" "}
          <strong className="text-foreground font-mono">
            {getFileName(document.storage_path)}
          </strong>
          ?
        </p>

        <div className="border border-destructive/20 bg-destructive/5 p-3 text-[11px] text-destructive leading-tight font-mono rounded-none">
          Warning: This will immediately delete the storage object and cascade
          delete all {document.stats.total_chunks} indexed vector chunks from
          your AI retrieval database.
        </div>

        <div className="mt-3 flex items-center justify-end gap-2 border-t border-border pt-3">
          <button
            type="button"
            onClick={onClose}
            className="border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-muted rounded-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="border border-destructive bg-destructive px-3.5 py-1.5 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 rounded-none"
          >
            Delete Permanently
          </button>
        </div>
      </div>
    </div>
  )
}

interface BulkDeleteModalProps {
  isOpen: boolean
  count: number
  onClose: () => void
  onConfirm: () => void
}

export function BulkDeleteModal({
  isOpen,
  count,
  onClose,
  onConfirm,
}: BulkDeleteModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md border border-destructive/60 bg-card p-6 shadow-2xl flex flex-col gap-3 rounded-none">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="size-5 shrink-0" />
          <h3 className="text-sm font-bold text-foreground">
            Delete {count} Selected Documents?
          </h3>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          You are about to batch delete{" "}
          <strong className="text-foreground font-mono">
            {count} documents
          </strong>
          . All corresponding embeddings and chunks in the vector store will be
          purged.
        </p>

        <div className="border border-destructive/20 bg-destructive/5 p-3 text-[11px] text-destructive leading-tight font-mono rounded-none">
          Warning: This operation cannot be undone. All vector chunks will be
          permanently purged from pgvector.
        </div>

        <div className="mt-3 flex items-center justify-end gap-2 border-t border-border pt-3">
          <button
            type="button"
            onClick={onClose}
            className="border border-border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-muted rounded-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="border border-destructive bg-destructive px-3.5 py-1.5 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 rounded-none"
          >
            Purge All Selected
          </button>
        </div>
      </div>
    </div>
  )
}
