"use client";

import React, { useState } from "react";
import {
  FileText,
  Sliders,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
} from "lucide-react";
import type {
  PlaygroundConfig,
  PlaygroundChunk,
  InspectorTab,
} from "../types";
import { AVAILABLE_MODELS } from "../constants";

interface PlaygroundInspectorPanelProps {
  activeTab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  chunks: PlaygroundChunk[];
  onToggleChunkInclusion: (chunkId: string) => void;
  selectedChunkId: string | null;
  config: PlaygroundConfig;
  onConfigChange: (newConfig: PlaygroundConfig) => void;
}

export function PlaygroundInspectorPanel({
  activeTab,
  onTabChange,
  chunks,
  onToggleChunkInclusion,
  selectedChunkId,
  config,
  onConfigChange,
}: PlaygroundInspectorPanelProps) {
  const [expandedChunkIds, setExpandedChunkIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedChunkIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getTemperatureLabel = (temp: number) => {
    if (temp <= 0.15) return "Strict & Factual (دقيق ومطابق تماماً للمستندات)";
    if (temp <= 0.35) return "Balanced & Direct (متوازن ومباشر — مستحسن)";
    if (temp <= 0.6) return "Friendly & Conversational (مرن وودود مع العميل)";
    return "Expressive & Creative (تعبيري وابتكاري)";
  };

  return (
    <div className="flex h-full flex-col border-s border-border bg-card transition-colors">
      {/* ── 2 Clear Tabs ── */}
      <div className="flex border-b border-border bg-background">
        <button
          type="button"
          onClick={() => onTabChange("sources")}
          className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 font-sans text-xs transition-colors rounded-none ${
            activeTab === "sources"
              ? "border-primary bg-card font-semibold text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="size-3.5" />
          <span>Referenced Documents</span>
          {chunks.length > 0 && (
            <span className="border border-border bg-muted px-1.5 py-0.2 font-mono text-[10px] text-muted-foreground">
              {chunks.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onTabChange("settings")}
          className={`flex flex-1 items-center justify-center gap-2 border-b-2 py-3 font-sans text-xs transition-colors rounded-none ${
            activeTab === "settings"
              ? "border-primary bg-card font-semibold text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sliders className="size-3.5" />
          <span>Assistant Settings</span>
        </button>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* ── 1. Referenced Documents Tab ── */}
        {activeTab === "sources" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div>
                <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                  Verified Document Sources
                </h3>
                <p className="mt-0.5 font-sans text-[11px] text-muted-foreground">
                  The specific document sections read to generate the answer
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-primary">
                {chunks.filter((c) => c.includedInContext).length} of {chunks.length} Active
              </span>
            </div>

            {chunks.length === 0 ? (
              <div className="border border-border/70 bg-background/50 p-6 text-center">
                <FileText className="mx-auto size-6 text-muted-foreground mb-2" />
                <p className="font-sans text-xs text-muted-foreground">
                  No documents referenced yet. Send a test inquiry to see which document sections
                  are used.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {chunks.map((chunk, index) => {
                  const matchPct = Math.round(chunk.similarity * 100);
                  const isHigh = matchPct >= 80;
                  const isSelected = selectedChunkId === chunk.id;
                  const isExpanded = expandedChunkIds[chunk.id] ?? false;

                  return (
                    <div
                      key={chunk.id || index}
                      className={`border transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                          : chunk.includedInContext
                          ? "border-border bg-background"
                          : "border-border/60 bg-muted/20 opacity-60"
                      }`}
                    >
                      {/* Document Card Header */}
                      <div className="flex items-start justify-between border-b border-border/60 p-3 gap-2">
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={() => onToggleChunkInclusion(chunk.id)}
                            className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                            title={
                              chunk.includedInContext
                                ? "Exclude this section from the assistant's answer"
                                : "Include this section in the assistant's answer"
                            }
                          >
                            {chunk.includedInContext ? (
                              <CheckSquare className="size-4 text-primary" />
                            ) : (
                              <Square className="size-4" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-semibold text-foreground">
                                Source #{index + 1}
                              </span>
                              <span className="font-sans text-xs font-medium text-foreground truncate max-w-[150px]">
                                {chunk.documentName || "Document"}
                              </span>
                            </div>
                            {chunk.headingPath && (
                              <span className="font-sans text-[11px] text-muted-foreground block truncate max-w-[210px] mt-0.5">
                                {chunk.headingPath}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Relevance Pill */}
                        <div className="text-end shrink-0">
                          <span
                            className={`font-mono text-[10px] px-1.5 py-0.5 border ${
                              isHigh
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                                : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
                            }`}
                          >
                            {matchPct}% Match
                          </span>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className="p-3">
                        <p
                          className={`font-sans text-xs text-foreground/90 leading-relaxed ${
                            !isExpanded ? "line-clamp-3" : ""
                          }`}
                          dir="auto"
                        >
                          {chunk.content}
                        </p>

                        <button
                          type="button"
                          onClick={() => toggleExpand(chunk.id)}
                          className="mt-2.5 flex items-center gap-1 font-sans text-[11px] text-primary hover:underline"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="size-3" />
                              <span>Show less</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="size-3" />
                              <span>Show full section text</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── 2. Assistant Settings Tab ── */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Assistant Engine */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Assistant Engine
                </label>
                <span className="font-sans text-[11px] text-primary font-medium">Click to change</span>
              </div>
              <div className="space-y-2">
                {AVAILABLE_MODELS.map((model) => {
                  const isSelected = config.model === model.id;
                  return (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => onConfigChange({ ...config, model: model.id })}
                      className={`w-full p-3 text-start border transition-colors rounded-none ${
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/40"
                          : "border-border bg-background text-muted-foreground hover:border-border hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-sans text-xs font-semibold text-foreground">
                          {model.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="border border-border bg-muted px-1.5 py-0.2 font-mono text-[9px] text-muted-foreground">
                            {model.speed}
                          </span>
                          <span
                            className={`border px-1.5 py-0.2 font-mono text-[9px] ${
                              model.badge === "Recommended"
                                ? "border-primary/40 bg-primary/10 text-primary font-medium"
                                : "border-border bg-muted text-muted-foreground"
                            }`}
                          >
                            {model.badge}
                          </span>
                        </div>
                      </div>
                      <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">
                        {model.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone & Creativity Slider */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-1">
                <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Response Tone & Creativity
                </label>
                <span className="font-mono text-xs font-bold text-primary">
                  {config.temperature}
                </span>
              </div>

              <span className="font-sans text-[11px] text-foreground font-medium block mb-2">
                {getTemperatureLabel(config.temperature)}
              </span>

              <input
                type="range"
                min={0.0}
                max={1.0}
                step={0.05}
                value={config.temperature}
                onChange={(e) =>
                  onConfigChange({ ...config, temperature: parseFloat(e.target.value) })
                }
                className="w-full accent-primary cursor-pointer"
              />

              <div className="flex justify-between font-sans text-[10px] text-muted-foreground mt-1">
                <span>0.0 (Strict & Factual)</span>
                <span>1.0 (Conversational & Friendly)</span>
              </div>

              <p className="mt-2 font-sans text-[11px] text-muted-foreground leading-relaxed">
                Lower values keep the assistant strictly anchored to the exact text in your files.
                Higher values allow a friendlier, warmer conversational style.
              </p>
            </div>

            {/* Strict Knowledge Base Mode */}
            <div className="border-t border-border pt-4">
              <div className="flex items-start gap-2.5 border border-border bg-background p-3">
                <button
                  type="button"
                  onClick={() =>
                    onConfigChange({ ...config, strictGrounding: !config.strictGrounding })
                  }
                  className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                >
                  {config.strictGrounding ? (
                    <CheckSquare className="size-4 text-primary" />
                  ) : (
                    <Square className="size-4" />
                  )}
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-primary" />
                    <span className="font-sans text-xs font-semibold text-foreground">
                      Strict Knowledge Base Mode
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-[11px] text-muted-foreground leading-relaxed">
                    Ensures the assistant only answers using verified documents. If an answer cannot
                    be confirmed in your files, it politely informs the customer rather than guessing.
                  </p>
                </div>
              </div>
            </div>

            {/* Assistant Role & Instructions */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Custom Instructions & Rules
                </label>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {config.systemPrompt.length} chars
                </span>
              </div>
              <textarea
                value={config.systemPrompt}
                onChange={(e) => onConfigChange({ ...config, systemPrompt: e.target.value })}
                rows={5}
                dir="auto"
                className="w-full border border-border bg-background p-2.5 font-sans text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-y rounded-none leading-relaxed"
                placeholder="Describe how your assistant should greet customers, speak to them, and format its replies..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
