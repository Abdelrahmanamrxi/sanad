"use client"

import React, { useState } from "react"
import { X, UploadCloud, RefreshCw } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { MimeType } from "../types"

interface AddDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onAddDocument: (data: {
    fileName: string
    mimeType: MimeType
    rawText: string
  }) => void
}

export function AddDocumentModal({
  isOpen,
  onClose,
  onAddDocument,
}: AddDocumentModalProps) {
  const [fileName, setFileName] = useState("")
  const [mimeType, setMimeType] = useState<MimeType>("application/pdf")
  const [rawText, setRawText] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileName.trim()) return

    setIsUploading(true)
    setTimeout(() => {
      onAddDocument({
        fileName: fileName.trim(),
        mimeType,
        rawText: rawText.trim(),
      })
      setIsUploading(false)
      setFileName("")
      setRawText("")
      setMimeType("application/pdf")
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg border border-border bg-card p-6 shadow-2xl flex flex-col gap-4 rounded-none">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Add Document to Knowledge Base
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Upload file or enter raw text to parse and index into pgvector
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded-none"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Document Filename / Storage Path
            </label>
            <input
              type="text"
              required
              placeholder="e.g. policies/pricing_and_delivery_terms_2026.pdf"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full border border-border bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none rounded-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              MIME Type / Format
            </label>
            <Select
              value={mimeType}
              onValueChange={(val) => {
                if (val) setMimeType(val as MimeType)
              }}
            >
              <SelectTrigger className="w-full h-9 border border-border bg-background px-3 py-1.5 text-xs text-foreground focus-visible:border-primary font-mono rounded-none">
                <SelectValue placeholder="Select MIME format" />
              </SelectTrigger>
              <SelectContent className="rounded-none border border-border bg-popover font-mono text-xs">
                <SelectItem value="application/pdf" className="rounded-none">
                  application/pdf (PDF Document)
                </SelectItem>
                <SelectItem value="text/markdown" className="rounded-none">
                  text/markdown (Markdown Document)
                </SelectItem>
                <SelectItem value="text/csv" className="rounded-none">
                  text/csv (CSV Spreadsheet)
                </SelectItem>
                <SelectItem value="text/plain" className="rounded-none">
                  text/plain (Plain Text File)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Raw Content / Initial Text (Optional)
            </label>
            <textarea
              rows={4}
              placeholder="Paste raw text or policy rules here in Arabic or English..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none font-sans rounded-none"
            />
          </div>

          {/* Drag & Drop Area */}
          <div className="border border-dashed border-border p-4 text-center text-xs text-muted-foreground bg-muted/10 rounded-none">
            <UploadCloud className="size-6 mx-auto mb-1 text-primary" />
            <span>Drag & drop source file or click to select</span>
            <span className="block font-mono text-[10px] text-muted-foreground/60 mt-0.5">
              Supported formats: PDF, DOCX, TXT, CSV, Markdown (Max 25MB)
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="border border-primary bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-none"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>Parsing & Chunking...</span>
                </>
              ) : (
                <span>Index Document</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
