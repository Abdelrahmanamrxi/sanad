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
  BookOpen,
  X,
} from "lucide-react";
import type {
  PlaygroundConfig,
  PlaygroundChunk,
  InspectorTab,
} from "../types";
import { AVAILABLE_MODELS, calibrateSimilarity } from "../constants";

interface PlaygroundInspectorPanelProps {
  activeTab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  chunks: PlaygroundChunk[];
  onToggleChunkInclusion: (chunkId: string) => void;
  selectedChunkId: string | null;
  config: PlaygroundConfig;
  onConfigChange: (newConfig: PlaygroundConfig) => void;
  onClose?: () => void;
}

export function PlaygroundInspectorPanel({
  activeTab,
  onTabChange,
  chunks,
  onToggleChunkInclusion,
  selectedChunkId,
  config,
  onConfigChange,
  onClose,
}: PlaygroundInspectorPanelProps) {
  const [expandedChunkIds, setExpandedChunkIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedChunkIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getTemperatureLabel = (temp: number) => {
    if (temp <= 0.15) return { title: "Strict & Factual", titleAr: "دقيق ومطابق تماماً للمستندات", badge: "0.0 – 0.15" };
    if (temp <= 0.35) return { title: "Balanced & Direct", titleAr: "متوازن ومباشر (مستحسن للشركات)", badge: "0.2 – 0.35" };
    if (temp <= 0.6) return { title: "Friendly & Conversational", titleAr: "مرن وودود مع العملاء", badge: "0.4 – 0.6" };
    return { title: "Expressive & Creative", titleAr: "تعبيري وابتكاري", badge: "0.65 – 1.0" };
  };

  const tempInfo = getTemperatureLabel(config.temperature);

  return (
    <div className="relative flex h-full flex-col border-s border-border bg-card transition-colors">
      {/* ── 2 Clear Tabs ── */}
      <div className="flex border-b border-border bg-background">
        <button
          type="button"
          onClick={() => onTabChange("sources")}
          className={`relative flex flex-1 items-center justify-center gap-2 border-b-2 py-3 font-sans text-xs transition-colors rounded-none ${
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
          className={`relative flex flex-1 items-center justify-center gap-2 border-b-2 py-3 font-sans text-xs transition-colors rounded-none ${
            activeTab === "settings"
              ? "border-primary bg-card font-semibold text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sliders className="size-3.5" />
          <span>Assistant Settings</span>
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center px-3.5 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors border-s border-border"
            title="Close panel"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ── 1. Referenced Documents Tab (Physical Clipping Look) ── */}
        {activeTab === "sources" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div>
                <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                  Verified Knowledge Clippings
                </h3>
                <p className="mt-0.5 font-sans text-[11px] text-muted-foreground">
                  Exact policy paragraphs cited by the assistant
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-primary">
                {chunks.filter((c) => c.includedInContext).length} of {chunks.length} Active
              </span>
            </div>

            {chunks.length === 0 ? (
              <div className="border border-border/70 bg-background/50 p-6 text-center">
                <BookOpen className="mx-auto size-6 text-muted-foreground mb-2" />
                <p className="font-sans text-xs text-muted-foreground">
                  No documents referenced yet. Send a test inquiry to see which document sections
                  are used.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {chunks.map((chunk, index) => {
                  const matchPct = calibrateSimilarity(chunk.similarity);
                  const isHigh = matchPct >= 75;
                  const isSelected = selectedChunkId === chunk.id;
                  const isExpanded = expandedChunkIds[chunk.id] ?? false;
                  const fileExt = chunk.documentName?.endsWith(".pdf") ? "PDF" : "DOCX";

                  return (
                    <div
                      key={chunk.id || index}
                      className={`relative border transition-all shadow-2xs ${
                        isSelected
                          ? "border-primary bg-card ring-1 ring-primary/40 shadow-xs"
                          : chunk.includedInContext
                          ? "border-border bg-card"
                          : "border-border/60 bg-muted/20 opacity-60"
                      }`}
                    >
                      {/* Top Match Quality Meter Bar */}
                      <div className="h-0.5 w-full bg-muted overflow-hidden">
                        <div
                          style={{ width: `${matchPct}%` }}
                          className={`h-full ${isHigh ? "bg-emerald-500" : "bg-amber-500"}`}
                        />
                      </div>

                      {/* Clipping Header */}
                      <div className="flex items-start justify-between border-b border-border/60 p-3 gap-2">
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={() => onToggleChunkInclusion(chunk.id)}
                            className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                            title={
                              chunk.includedInContext
                                ? "Exclude this clipping from the assistant's answer"
                                : "Include this clipping in the assistant's answer"
                            }
                          >
                            {chunk.includedInContext ? (
                              <CheckSquare className="size-4 text-primary" />
                            ) : (
                              <Square className="size-4" />
                            )}
                          </button>
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="border border-primary/30 bg-primary/10 px-1 py-0.2 font-mono text-[9px] font-bold text-primary">
                                {fileExt}
                              </span>
                              <span className="font-sans text-xs font-semibold text-foreground truncate max-w-[160px]">
                                {chunk.documentName || "Document"}
                              </span>
                            </div>
                            {chunk.headingPath && (
                              <span className="font-mono text-[10px] text-muted-foreground block truncate max-w-[210px]">
                                {chunk.headingPath}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Relevance Tag */}
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

                      {/* Content Preview with Highlighter effect */}
                      <div className="p-3 bg-muted/10">
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
                          className="mt-2.5 flex items-center gap-1 font-sans text-[11px] text-primary hover:underline font-medium"
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

        {/* ── 2. Assistant Settings Tab (Precision Controls) ── */}
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
                      className={`w-full p-3 text-start border transition-all rounded-none shadow-2xs ${
                        isSelected
                          ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/40 shadow-xs"
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

            {/* Stepped Hardware Slider for Tone & Creativity */}
            <div className="border-t border-border pt-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Response Tone & Creativity
                </label>
                <span className="font-mono text-xs font-bold text-primary">
                  {config.temperature}
                </span>
              </div>

              {/* High-contrast status pill */}
              <div className="border border-border bg-background p-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-semibold text-foreground">
                    {tempInfo.title}
                  </span>
                  <span className="font-mono text-[10px] text-primary border border-primary/30 bg-primary/10 px-1.5 py-0.2">
                    {tempInfo.badge}
                  </span>
                </div>
                <span className="font-sans text-[11px] text-muted-foreground mt-0.5 block" dir="auto">
                  {tempInfo.titleAr}
                </span>
              </div>

              {/* Slider with discrete stepped rail */}
              <div className="pt-1">
                <input
                  type="range"
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  value={config.temperature}
                  onChange={(e) =>
                    onConfigChange({ ...config, temperature: parseFloat(e.target.value) })
                  }
                  className="w-full accent-primary cursor-pointer h-2 bg-muted rounded-none"
                />

                <div className="flex justify-between font-mono text-[10px] text-muted-foreground mt-1">
                  <span>0.0 (Strict)</span>
                  <span>0.25 (Balanced)</span>
                  <span>0.5 (Friendly)</span>
                  <span>1.0 (Creative)</span>
                </div>
              </div>

              <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">
                Lower values keep the assistant strictly anchored to exact text. Higher values allow
                warmer, friendlier conversational phrasing.
              </p>
            </div>

            {/* Strict Knowledge Base Mode */}
            <div className="border-t border-border pt-4">
              <div className="flex items-start gap-2.5 border border-border bg-background p-3 shadow-2xs">
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

            {/* Custom Instructions */}
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
                className="w-full border border-border bg-background p-2.5 font-sans text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-y rounded-none leading-relaxed shadow-2xs"
                placeholder="Describe how your assistant should greet customers, speak to them, and format its replies..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
