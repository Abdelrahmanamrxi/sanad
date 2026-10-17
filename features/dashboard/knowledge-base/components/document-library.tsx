"use client";

import {
  Search,
  Trash2,
  AlertCircle,
  Loader2,
  Clock,
  Check,
} from "lucide-react";

import type { DocumentItem, MimeType } from "../types";
import {
  formatBytes,
  getFileName,
  getFileIcon,
  getFormatBadge,
} from "../mock-data";

interface DocumentLibraryProps {
  documents: DocumentItem[];
  searchQuery: string;
  typeFilter: "all" | MimeType;
  onSearchChange: (query: string) => void;
  onTypeFilterChange: (type: "all" | MimeType) => void;
  onDeleteSingle: (doc: DocumentItem) => void;
  isPending: boolean;
  selectedDocId?: string | null;
  onSelectDoc: (id: string) => void;
}

export function DocumentLibrary({
  documents,
  searchQuery,
  typeFilter,
  onSearchChange,
  onTypeFilterChange,
  onDeleteSingle,
  isPending,
  selectedDocId,
  onSelectDoc,
}: DocumentLibraryProps) {
  

  // Filtered documents
  const filteredDocs = documents
    ? documents.filter((doc) => {
        const matchesSearch = doc.storage_path
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesType =
          typeFilter === "all" || doc.mime_type === typeFilter;
        return matchesSearch && matchesType;
      })
    : [];

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
            onClick={() => onTypeFilterChange("pdf")}
            className={`px-2 py-0.5 transition-colors rounded-none ${
              typeFilter === "pdf"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            PDF
          </button>
          <button
            type="button"
            onClick={() => onTypeFilterChange("docx")}
            className={`px-2 py-0.5 transition-colors rounded-none ${
              typeFilter === "docx"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            DOCX
          </button>
          <button
            type="button"
            onClick={() => onTypeFilterChange("txt")}
            className={`px-2 py-0.5 transition-colors rounded-none ${
              typeFilter === "txt"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            TXT
          </button>
          <button
            type="button"
            onClick={() => onTypeFilterChange("markdown")}
            className={`px-2 py-0.5 transition-colors rounded-none ${
              typeFilter === "markdown"
                ? "bg-primary text-primary-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            MD
          </button>
        </div>

        {/* Bulk Selection Action Bar */}
      
      </div>
      {!isPending ? (
        <div className="mt-3 flex flex-col gap-2 max-h-[calc(100vh-280px)] overflow-y-auto pe-1">
          {filteredDocs.length === 0 ? (
            <div className="border border-dashed border-border p-6 text-center text-xs text-muted-foreground rounded-none">
              No matching documents found.
            </div>
          ) : (
            filteredDocs.map((doc) => {
              const isSelected = doc.id === selectedDocId ;
           
              const fileName = doc.name || getFileName(doc.storage_path);
              const isFailed = doc.doc_status === "failed";

              return (
                <div
                  key={doc.id}
                  onClick={() =>{onSelectDoc(doc.id)} }
                  className={`group relative flex flex-col border p-3 cursor-pointer transition-colors rounded-none ${
                    isSelected
                      ? "border-primary bg-primary/5 border-s-4 border-s-primary"
                      : "border-border bg-card hover:border-border/80 hover:bg-muted/20"
                  }`}
                >
                  {/* Top row: Checkbox, Icon, Name, Format Badge, Delete Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                     
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
                        e.stopPropagation();
                        onDeleteSingle(doc);
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
                        {formatBytes(doc?.file_size ?? 0)}
                      </span>
                      <span className="text-border">|</span>
                      <span className="text-muted-foreground">
                        {doc.stats?.total_chunks ?? 0} chunks
                      </span>
                    </div>

                    <div>
                      {doc.doc_status === "failed" ? (
                        <span className="inline-flex items-center gap-1 border border-destructive/40 bg-destructive/10 px-1.5 py-px font-semibold text-destructive uppercase rounded-none">
                          <AlertCircle className="size-2.5 shrink-0" />
                          <span>Failed</span>
                        </span>
                      ) : doc.doc_status === "processing" ? (
                        <span className="inline-flex items-center gap-1.5 border border-primary/50 bg-primary/20 text-primary px-2 py-0.5 font-bold uppercase tracking-wider rounded-none shadow-xs">
                          <Loader2 className="size-3 animate-spin shrink-0 text-primary" />
                          <span>Processing</span>
                        </span>
                      ) : doc.doc_status === "queued" ? (
                        <span className="inline-flex items-center gap-1 border border-highlight/40 bg-highlight/10 text-highlight-foreground dark:text-highlight px-1.5 py-px font-semibold uppercase rounded-none">
                          <Clock className="size-2.5 shrink-0" />
                          <span>Queued</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 border border-success/40 bg-success/10 px-1.5 py-px font-semibold text-success uppercase rounded-none">
                          <Check className="size-2.5 shrink-0" />
                          <span>
                            {doc.doc_status === "ready" ? "Ready" : "Indexed"}
                          </span>
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
              );
            })
          )}
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2 max-h-[calc(100vh-280px)] overflow-hidden pe-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border border-border bg-card p-3 rounded-none animate-pulse flex flex-col gap-2.5"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <div className="mt-0.5 size-3.5 bg-muted rounded-none shrink-0" />
                  <div className="mt-0.5 size-4 bg-muted rounded-none shrink-0" />
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div
                      className="h-3 bg-muted rounded-none"
                      style={{ width: `${55 + (i % 4) * 12}%` }}
                    />
                    <div
                      className="h-2 bg-muted/60 rounded-none"
                      style={{ width: `${35 + (i % 3) * 15}%` }}
                    />
                  </div>
                </div>
                <div className="size-3.5 bg-muted/40 rounded-none shrink-0" />
              </div>

              {/* Bottom metadata row */}
              <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-8 bg-muted rounded-none" />
                  <div className="h-3 w-12 bg-muted/60 rounded-none" />
                  <span className="text-border">|</span>
                  <div className="h-3 w-14 bg-muted/60 rounded-none" />
                </div>
                <div className="h-3.5 w-14 bg-muted/70 rounded-none" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document List */}
    </div>
  );
}
