"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ThumbsDown,
  Sparkles,
  ArrowUpRight,
  AlertTriangle,
  FileText,
  Layers,
  Search,
  RefreshCw,
  Trash2,
  Download,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import type { DocumentItem, ChunkItem } from "../types";
import { formatBytes, getFileName, getFormatBadge } from "../mock-data";
import { ChunkCard } from "./chunk-card";
import { Button } from "@/components/ui/button";

interface DocumentInspectorProps {
  selectedDoc: DocumentItem | null;
  chunks: ChunkItem[];
  onDeleteSingle: (doc: DocumentItem) => void;
}

export function DocumentInspector({
  selectedDoc,
  chunks,
  onDeleteSingle,
}: DocumentInspectorProps) {
  const [activeTab, setActiveTab] = useState<"performance" | "content" | "chunks">(
    "performance"
  );
  const [chunkSearch, setChunkSearch] = useState("");
  const [copiedChunkId, setCopiedChunkId] = useState<string | null>(null);

  const handleCopyChunk = (chunkId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChunkId(chunkId);
    setTimeout(() => setCopiedChunkId(null), 2000);
  };

  if (!selectedDoc) {
    return (
      <div className="border border-border bg-card p-12 text-center text-xs text-muted-foreground lg:col-span-7 rounded-none">
        Select a document from the left library to inspect performance and content.
      </div>
    );
  }

  const perf = selectedDoc.performance ?? {
    times_cited_30d: 0,
    times_cited_7d: 0,
    satisfaction_rate: 0,
    thumbs_down_count: 0,
    top_queries_helped: [],
    suggested_questions: [],
  };

  const isColdDoc = perf.times_cited_30d === 0 && selectedDoc.doc_status === "indexed";

  // Filtered chunks in raw inspector tab
  const filteredChunks = chunks.filter((chunk) => {
    if (!chunkSearch) return true;
    return (
      chunk.content.toLowerCase().includes(chunkSearch.toLowerCase()) ||
      (chunk.heading_path &&
        chunk.heading_path.toLowerCase().includes(chunkSearch.toLowerCase()))
    );
  });

  // Extract unique detected headings
  const detectedHeadings = Array.from(
    new Set(chunks.map((c) => c.heading_path).filter(Boolean))
  ) as string[];
  

  return (
    <div className="border border-border bg-card p-5 lg:col-span-7 flex flex-col rounded-none select-none">
      {/* ── Document Header & Global Actions ── */}
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

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="xs"
              className="font-mono text-xs cursor-pointer"
              onClick={() => alert(`Downloading ${selectedDoc.storage_path}`)}
            >
              <Download className="size-3 me-1" />
              Download
            </Button>

            <Button
              variant="outline"
              size="xs"
              className="font-mono text-xs cursor-pointer"
            >
              <RefreshCw className="size-3 me-1" />
              Re-sync
            </Button>

            <Button
              variant="destructive"
              size="xs"
              onClick={() => onDeleteSingle(selectedDoc)}
              className="font-mono text-xs cursor-pointer"
            >
              <Trash2 className="size-3 me-1" />
              Delete
            </Button>
          </div>
        </div>

        {/* Status & Quick Stats Strip */}
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
              {selectedDoc.stats.total_chunks} partitions
            </span>
          </div>

          <div className="border border-border bg-background p-2 rounded-none">
            <span className="block text-[9px] uppercase text-muted-foreground">
              Tokens Indexed
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

      {/* ── View Navigation Tabs ── */}
      <div className="mt-3 flex items-center justify-between border-b border-border pb-1">
        <div className="flex items-center gap-1 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("performance")}
            className={`px-3 py-1.5 border-b-2 transition-colors font-medium rounded-none flex items-center gap-1.5 ${
              activeTab === "performance"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <TrendingUp className="size-3.5" />
            <span>Usage & Performance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`px-3 py-1.5 border-b-2 transition-colors font-medium rounded-none flex items-center gap-1.5 ${
              activeTab === "content"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="size-3.5" />
            <span>Document Content</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("chunks")}
            className={`px-3 py-1.5 border-b-2 transition-colors font-medium rounded-none flex items-center gap-1.5 ${
              activeTab === "chunks"
                ? "border-primary text-foreground font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="size-3.5" />
            <span>Raw Chunks ({chunks.length})</span>
          </button>
        </div>

        {activeTab === "chunks" && chunks.length > 0 && (
          <div className="relative w-44">
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

      {/* ── TAB 1: Usage & Performance ("How is this document performing?") ── */}
      {activeTab === "performance" && (
        <div className="mt-4 flex flex-col gap-4 max-h-[calc(100vh-380px)] overflow-y-auto pe-1">
          {/* Performance Metrics Cards */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {/* Citations */}
            <div className="border border-border bg-background p-3.5 rounded-none flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-mono uppercase tracking-wider">
                  Citations (30d)
                </span>
                <TrendingUp className="size-3.5 text-primary" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-foreground">
                  {perf.times_cited_30d}
                </span>
                <span className="text-[11px] font-mono text-primary">
                  +{perf.times_cited_7d} in 7d
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Times referenced in customer answers
              </p>
            </div>

            {/* Satisfaction / Helpfulness */}
            <div className="border border-border bg-background p-3.5 rounded-none flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-mono uppercase tracking-wider">
                  Helpfulness Rate
                </span>
                <CheckCircle2 className="size-3.5 text-success" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-foreground">
                  {perf.times_cited_30d > 0 ? `${perf.satisfaction_rate}%` : "N/A"}
                </span>
                {perf.times_cited_30d > 0 && (
                  <span className="text-[11px] font-mono text-success">Positive</span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Feedback on answers citing this doc
              </p>
            </div>

            {/* Thumbs Down / Issues */}
            <div className="border border-border bg-background p-3.5 rounded-none flex flex-col justify-between">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-mono uppercase tracking-wider">
                  Thumbs Down
                </span>
                <ThumbsDown className="size-3.5 text-destructive" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className={`text-2xl font-bold font-mono ${
                    perf.thumbs_down_count > 0 ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {perf.thumbs_down_count}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  downvotes
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Negative ratings on cited answers
              </p>
            </div>
          </div>

          {/* Cold Document Alert (Never Retrieved) */}
          {isColdDoc && (
            <div className="border border-highlight/40 bg-highlight/5 p-3.5 rounded-none flex items-start gap-3">
              <AlertTriangle className="size-4 text-highlight shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-foreground font-sans">
                  Never retrieved in the last 30 days
                </span>
                <p className="text-muted-foreground mt-0.5 leading-relaxed font-sans">
                  This document has not been cited in any customer responses. It may
                  contain obsolete terms or lack specific headings that match frequent
                  customer inquiries.
                </p>
              </div>
            </div>
          )}

          {/* Questions This Document Can Answer (Chips with "Try in Playground") */}
          <div className="border border-border bg-background p-4 rounded-none">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                  Questions This Document Answers
                </h3>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Generated at ingestion
              </span>
            </div>

            <p className="text-xs text-muted-foreground mb-3 leading-relaxed font-sans">
              Click any question below to test retrieval and prompt answers live in the
              Playground:
            </p>

            {perf.suggested_questions.length === 0 ? (
              <p className="text-xs text-muted-foreground font-mono py-2">
                No suggested questions generated for this document.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {perf.suggested_questions.map((question, i) => (
                  <Link
                    key={i}
                    href={`/dashboard/playground?q=${encodeURIComponent(question)}`}
                    className="group flex items-center gap-1.5 border border-border bg-card px-2.5 py-1.5 text-xs text-foreground hover:border-primary hover:bg-muted/50 transition-colors rounded-none"
                  >
                    <span className="font-sans text-[11px]">{question}</span>
                    <ArrowUpRight className="size-3 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Top Real Customer Questions It Helped Answer */}
          {perf.top_queries_helped.length > 0 && (
            <div className="border border-border bg-background p-4 rounded-none">
              <div className="flex items-center gap-2 border-b border-border/60 pb-2.5 mb-3">
                <HelpCircle className="size-4 text-muted-foreground" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                  Top Customer Questions Answered
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                {perf.top_queries_helped.map((q, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border border-border/60 bg-card p-2 text-xs rounded-none"
                  >
                    <span className="font-sans text-foreground truncate pe-2">
                      {q.query}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground shrink-0 border border-border bg-muted px-1.5 py-0.5 rounded-none">
                      {q.count} citations
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 2: Document Content & Outline ── */}
      {activeTab === "content" && (
        <div className="mt-4 flex flex-col gap-4 max-h-[calc(100vh-380px)] overflow-y-auto pe-1">
          {/* Detected Headings Outline */}
          {detectedHeadings.length > 0 && (
            <div className="border border-border bg-background p-3.5 rounded-none">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-2">
                Detected Section Outline
              </span>
              <div className="flex flex-wrap gap-1.5">
                {detectedHeadings.map((heading, i) => (
                  <span
                    key={i}
                    className="border border-border bg-card px-2 py-0.5 font-mono text-[10px] text-foreground rounded-none"
                  >
                    {heading}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Rendered Document Text */}
          <div className="border border-border bg-background p-4 rounded-none">
            <pre className="font-mono text-xs text-foreground leading-relaxed whitespace-pre-wrap select-text">
              {`# ${getFileName(selectedDoc.storage_path)}

${chunks.map((c) => `### ${c.heading_path || `Partition ${c.chunk_index + 1}`}\n${c.content}`).join("\n\n---\n\n")}
`}
            </pre>
          </div>
        </div>
      )}

      {/* ── TAB 3: Raw Vector Chunks (Advanced) ── */}
      {activeTab === "chunks" && (
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
    </div>
  );
}
