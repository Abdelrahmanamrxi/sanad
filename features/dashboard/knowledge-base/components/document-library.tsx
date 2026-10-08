"use client"

import React from "react"
import { Search, Trash2, AlertCircle } from "lucide-react"
import type { DocumentItem, MimeType } from "../types"
import { formatBytes, getFileName, getFileIcon, getFormatBadge } from "../mock-data"

interface DocumentLibraryProps {
  documents: DocumentItem[]
  selectedDocId: string
  selectedDocIds: Set<string>
  searchQuery: string
  typeFilter: "all" | MimeType
  onSearchChange: (query: string) => void
  onTypeFilterChange: (type: "all" | MimeType) => void
  onSelectDoc: (id: string) => void
  onToggleSelectDoc: (id: string, e: React.MouseEvent) => void
  onToggleSelectAll: () => void
  onDeleteSingle: (doc: DocumentItem) => void
  onOpenBulkDelete: () => void
}

export function DocumentLibrary({
  documents,
  selectedDocId,
  selectedDocIds,
  searchQuery,
  typeFilter,
  onSearchChange,
  onTypeFilterChange,
  onSelectDoc,
  onToggleSelectDoc,
  onToggleSelectAll,
  onDeleteSingle,
  onOpenBulkDelete,
}: DocumentLibraryProps) {
  // Filtered documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.storage_path
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || doc.mime_type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="border border-border bg-card p-4 lg:col-span-5 flex flex-col rounded-none">
      {/* Search & Type Filter Tabs */}
      <div className="flex flex-col gap-3 border-b border-border pb-3.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute start-2.5 top-2.5 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents by filename..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border border-border bg-background py-1.5 ps-8 pe-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none rounded-none font-mono"
          />
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap items-center gap-1 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => onTypeFilterChange("all")}
            className={`px-2 py-0.5 transition-colors rounded-none ${
              typeFilter === "all"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All ({documents.length})
          </button>
          <button
            type="button"
            onClick={() => onTypeFilterChange("application/pdf")}
            className={`px-2 py-0.5 transition-colors rounded-none ${
              typeFilter === "application/pdf"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            PDF
          </button>
          <button
            type="button"
            onClick={() => onTypeFilterChange("text/markdown")}
            className={`px-2 py-0.5 transition-colors rounded-none ${
              typeFilter === "text/markdown"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            MD
          </button>
          <button
            type="button"
            onClick={() => onTypeFilterChange("text/csv")}
            className={`px-2 py-0.5 transition-colors rounded-none ${
              typeFilter === "text/csv"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            CSV
          </button>
          <button
            type="button"
            onClick={() => onTypeFilterChange("text/plain")}
            className={`px-2 py-0.5 transition-colors rounded-none ${
              typeFilter === "text/plain"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            TXT
          </button>
        </div>

        {/* Bulk Selection Action Bar */}
        <div className="flex items-center justify-between border-t border-border/60 pt-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground select-none">
            <input
              type="checkbox"
              checked={
                filteredDocs.length > 0 &&
                selectedDocIds.size === filteredDocs.length
              }
              onChange={onToggleSelectAll}
              className="size-3.5 accent-[#3FB3A6] cursor-pointer rounded-none"
            />
            <span className="font-mono text-[11px]">Select All</span>
          </label>

          {selectedDocIds.size > 0 && (
            <button
              type="button"
              onClick={onOpenBulkDelete}
              className="flex items-center gap-1 border border-destructive/40 bg-destructive/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors rounded-none"
            >
              <Trash2 className="size-3" />
              <span>Delete Selected ({selectedDocIds.size})</span>
            </button>
          )}
        </div>
      </div>

      {/* Document List */}
      <div className="mt-3 flex flex-col gap-2 max-h-[calc(100vh-280px)] overflow-y-auto pe-1">
        {filteredDocs.length === 0 ? (
          <div className="border border-dashed border-border p-6 text-center text-xs text-muted-foreground rounded-none">
            No matching documents found.
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isSelected = doc.id === selectedDocId
            const isChecked = selectedDocIds.has(doc.id)
            const fileName = getFileName(doc.storage_path)
            const isFailed = doc.doc_status === "failed"

            return (
              <div
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className={`group relative flex flex-col border p-3 cursor-pointer transition-colors rounded-none ${
                  isSelected
                    ? "border-primary bg-primary/5 border-s-4 border-s-primary"
                    : "border-border bg-card hover:border-border/80 hover:bg-muted/20"
                }`}
              >
                {/* Top row: Checkbox, Icon, Name, Format Badge, Delete Button */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onClick={(e) => onToggleSelectDoc(doc.id, e)}
                      onChange={() => {}}
                      className="mt-0.5 size-3.5 accent-[#3FB3A6] shrink-0 cursor-pointer rounded-none"
                    />
                    <div className="mt-0.5 shrink-0">
                      {getFileIcon(doc.mime_type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-xs font-semibold text-foreground font-sans"
                        title={fileName}
                      >
                        {fileName}
                      </p>
                      <p className="truncate font-mono text-[10px] text-muted-foreground mt-0.5">
                        {doc.storage_path}
                      </p>
                    </div>
                  </div>

                  {/* Direct Single Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSingle(doc)
                    }}
                    className="shrink-0 p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors rounded-none"
                    title="Delete Document"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                {/* Metadata & Status Badges */}
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1 border-t border-border/40 pt-2 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="border border-border bg-muted px-1 py-px uppercase text-muted-foreground font-semibold rounded-none">
                      {getFormatBadge(doc.mime_type)}
                    </span>
                    <span className="text-muted-foreground">
                      {formatBytes(doc.stats.file_size)}
                    </span>
                    <span className="text-border">|</span>
                    <span className="text-muted-foreground">
                      {doc.stats.total_chunks} chunks
                    </span>
                  </div>

                  <div>
                    {isFailed ? (
                      <span className="border border-destructive/40 bg-destructive/10 px-1.5 py-px font-semibold text-destructive uppercase rounded-none">
                        Failed
                      </span>
                    ) : (
                      <span className="border border-success/40 bg-success/10 px-1.5 py-px font-semibold text-success uppercase rounded-none">
                        Indexed
                      </span>
                    )}
                  </div>
                </div>

                {/* Error preview if status is failed */}
                {isFailed && doc.error_message && (
                  <div className="mt-2 border border-destructive/30 bg-destructive/5 p-2 text-[11px] text-destructive flex items-start gap-1.5 rounded-none font-sans">
                    <AlertCircle className="size-3.5 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 leading-tight">
                      {doc.error_message}
                    </span>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
