"use client";

import React, { useState, useTransition } from "react";
import {
  FileText,
  Sliders,
  ChevronDown,
  ChevronUp,
  BookOpen,
  X,
  Lock,
  Sparkles,
  Loader2,
  Check,
  AlertCircle,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  PlaygroundConfig,
  PlaygroundChunk,
  InspectorTab,
} from "../types";
import { PlanTier } from "@/features/billing";
import { updateAssistantSettingsAction } from "../actions";
import UpgradePlansModal, {
  type RestrictedFeatureInfo,
} from "@/features/billing/components/upgrade-plans-modal";

interface PlaygroundInspectorPanelProps {
  activeTab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  chunks: PlaygroundChunk[];
  onToggleChunkInclusion: (chunkId: string) => void;
  selectedChunkId: string | null;
  config: PlaygroundConfig;
  onConfigChange: (newConfig: PlaygroundConfig) => void;
  onClose?: () => void;
  planTier: PlanTier;
}

const TONE_PRESETS = [
  {
    value: 0.0,
    title: "Strict",
    desc: "Direct facts only, strictly from knowledge documents. Zero guesswork.",
  },
  {
    value: 0.25,
    title: "Balanced",
    desc: "Helpful and conversational while remaining accurate. (Recommended)",
  },
  {
    value: 0.5,
    title: "Friendly",
    desc: "Warm and approachable phrasing, best for customer engagement.",
  },
];

export function PlaygroundInspectorPanel({
  activeTab,
  onTabChange,
  chunks,
  config,
  onConfigChange,
  onClose,
  planTier,
}: PlaygroundInspectorPanelProps) {
  const [expandedChunkIds, setExpandedChunkIds] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Upgrade Modal state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [restrictedFeature, setRestrictedFeature] = useState<RestrictedFeatureInfo | null>(null);

  const isFree = planTier === "free";
  const isStarter = planTier === "starter";
  const isPro = planTier === "pro";
  const maxInstructionChars = isFree ? 0 : isStarter ? 1000 : 3000;

  const toggleExpand = (id: string) => {
    setExpandedChunkIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openUpgradeModal = (
    featureName: string,
    reason: string,
    requiredTier: "starter" | "pro" = "starter"
  ) => {
    setRestrictedFeature({
      featureName,
      requiredTier,
      reason,
    });
    setIsUpgradeModalOpen(true);
  };

  const handleSaveSettings = () => {
    setStatusMessage(null);
    startTransition(async () => {
      const result = await updateAssistantSettingsAction({
        customInstructions: config.systemPrompt,
        temperature: config.temperature,
      });

      if (!result.success) {
        setStatusMessage({
          type: "error",
          text: result.error || "Failed to save assistant settings.",
        });
      } else {
        setStatusMessage({
          type: "success",
          text: "Saved to live store assistant!",
        });
        setTimeout(() => setStatusMessage(null), 4000);
      }
    });
  };

  const currentChars = config.systemPrompt.length;
  const isOverCharLimit = maxInstructionChars > 0 && currentChars > maxInstructionChars;

  return (
    <div className="flex h-full flex-col bg-card font-sans border-s border-border">
      {/* ── Panel Header & Tabs ── */}
      <div className="flex items-center border-b border-border bg-muted/20">
        <button
          type="button"
          onClick={() => onTabChange("sources")}
          className={`relative flex flex-1 items-center justify-center gap-2 border-b-2 py-3 font-sans text-xs transition-colors rounded-none cursor-pointer ${
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
          className={`relative flex flex-1 items-center justify-center gap-2 border-b-2 py-3 font-sans text-xs transition-colors rounded-none cursor-pointer ${
            activeTab === "settings"
              ? "border-primary bg-card font-semibold text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sliders className="size-3.5" />
          <span>Assistant Settings</span>
        </button>

        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="border-s border-border"
            title="Close panel"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ── 1. Referenced Documents Tab ── */}
        {activeTab === "sources" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div>
                <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground font-mono">
                  Verified Knowledge Clippings
                </h3>
                <p className="mt-0.5 font-sans text-[11px] text-muted-foreground">
                  Exact document paragraphs cited by the assistant
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
                  const isExpanded = !!expandedChunkIds[chunk.id];
                  const matchPct = Math.round(chunk.similarity * 100);
                  const isHigh = matchPct >= 70;

                  return (
                    <div
                      key={chunk.id || index}
                      className="border border-border bg-background p-3.5 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2 border-b border-border/40 pb-2">
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] text-primary uppercase tracking-wider font-semibold">
                            Source #{index + 1}
                          </span>
                          <h4 className="font-sans text-xs font-semibold text-foreground truncate">
                            {chunk.documentName || "Verified Document"}
                          </h4>
                          {chunk.headingPath && (
                            <p className="font-mono text-[10px] text-muted-foreground truncate">
                              {chunk.headingPath}
                            </p>
                          )}
                        </div>

                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 border shrink-0 ${
                            isHigh
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                              : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
                          }`}
                        >
                          {matchPct}% Match
                        </span>
                      </div>

                      <p
                        className={`font-sans text-xs text-foreground/90 leading-relaxed ${
                          !isExpanded ? "line-clamp-3" : ""
                        }`}
                        dir="auto"
                      >
                        {chunk.content}
                      </p>

                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => toggleExpand(chunk.id)}
                        className="mt-1 h-auto p-0 text-[11px] text-primary hover:bg-transparent hover:underline"
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
                      </Button>
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
            {/* Tone & Temperature Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <label className="font-sans text-xs font-semibold text-foreground">
                    Response Tone & Creativity
                  </label>
                  {!isPro && (
                    <span className="inline-flex items-center gap-1 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                      <Lock className="size-2.5" />
                      Pro Only
                    </span>
                  )}
                  {isPro && (
                    <span className="inline-flex items-center gap-1 border border-primary/30 bg-primary/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-primary uppercase">
                      <Sparkles className="size-2.5" />
                      Pro Unlocked
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs font-bold text-primary">
                  {config.temperature.toFixed(2)}
                </span>
              </div>

              {!isPro ? (
                /* Non-Pro (Free & Starter): Locked to Default Balanced */
                <div className="border border-border bg-muted/30 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-semibold text-foreground">
                      Balanced & Grounded (0.20)
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] border border-border bg-card px-1.5 py-0.5 text-muted-foreground">
                      <Lock className="size-2.5 text-amber-600 dark:text-amber-400" />
                      <span>Default Mode</span>
                    </span>
                  </div>
                  <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">
                    Custom response tone and sampling temperature tuning are exclusive to the Flagship Pro plan.
                  </p>
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={() =>
                      openUpgradeModal(
                        "Response Tone & Creativity",
                        "Upgrade to Flagship Pro to unlock custom AI tone presets, conversational warmth, and sampling temperature tuning.",
                        "pro"
                      )
                    }
                    className="w-full mt-1 font-sans text-xs font-semibold tracking-wide border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
                  >
                    Upgrade to Flagship Pro
                  </Button>
                </div>
              ) : (
                /* Pro Plan: Full Unlocked Controls (Presets + Precision Slider) */
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {TONE_PRESETS.map((preset) => {
                      const isSelected =
                        Math.abs(config.temperature - preset.value) < 0.05;
                      return (
                        <button
                          key={preset.title}
                          type="button"
                          onClick={() =>
                            onConfigChange({ ...config, temperature: preset.value })
                          }
                          className={`p-2.5 text-start border transition-all rounded-none cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-background hover:bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-sans text-xs font-semibold text-foreground">
                              {preset.title}
                            </span>
                            {isSelected && (
                              <Check className="size-3 text-primary" />
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-primary block">
                            {preset.value.toFixed(2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <input
                      type="range"
                      min={0.0}
                      max={0.5}
                      step={0.05}
                      value={config.temperature}
                      onChange={(e) =>
                        onConfigChange({
                          ...config,
                          temperature: parseFloat(e.target.value),
                        })
                      }
                      className="w-full accent-primary cursor-pointer h-2 bg-muted rounded-none"
                    />
                    <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
                      <span>0.0 (Strict)</span>
                      <span>0.25 (Balanced)</span>
                      <span>0.50 (Friendly)</span>
                    </div>
                  </div>
                </div>
              )}

              <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">
                Lower values keep the assistant strictly anchored to exact text. Higher values allow
                warmer, friendlier conversational phrasing.
              </p>
            </div>

            {/* Custom Instructions Section */}
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <label className="font-sans text-xs font-semibold text-foreground">
                    Custom Store Instructions
                  </label>
                  {isFree && (
                    <span className="inline-flex items-center gap-1 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                      <Lock className="size-2.5" />
                      Starter
                    </span>
                  )}
                  {isStarter && (
                    <span className="font-mono text-[9px] border border-border bg-muted px-1.5 py-0.2 text-muted-foreground uppercase">
                      Starter Plan
                    </span>
                  )}
                  {isPro && (
                    <span className="inline-flex items-center gap-1 border border-primary/30 bg-primary/10 px-1.5 py-0.2 font-mono text-[9px] font-bold text-primary uppercase">
                      <Sparkles className="size-2.5" />
                      Pro Plan
                    </span>
                  )}
                </div>

                <span
                  className={`font-mono text-[10px] ${
                    isOverCharLimit
                      ? "text-destructive font-bold"
                      : "text-muted-foreground"
                  }`}
                >
                  {currentChars} {maxInstructionChars > 0 ? `/ ${maxInstructionChars}` : ""} chars
                </span>
              </div>

              {/* Free Plan Upgrade Prompt */}
              {isFree ? (
                <div className="border border-amber-500/40 bg-amber-500/10 p-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <Lock className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-sans text-xs font-semibold text-foreground">
                        Custom Brand Instructions (Starter Feature)
                      </h4>
                      <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">
                        Customize how your assistant greets customers, what dialect to speak (Saudi, Egyptian, Formal), and specific store policies.
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="default"
                    onClick={() =>
                      openUpgradeModal(
                        "Custom Store Instructions",
                        "Upgrade to Starter to customize your assistant's personality, dialect, and specific store etiquette."
                      )
                    }
                    className="w-full mt-1 font-sans text-xs font-semibold tracking-wide"
                  >
                    Upgrade to Starter (490 EGP/mo)
                  </Button>
                </div>
              ) : (
                <textarea
                  value={config.systemPrompt}
                  onChange={(e) =>
                    onConfigChange({ ...config, systemPrompt: e.target.value })
                  }
                  rows={6}
                  dir="auto"
                  disabled={isFree}
                  className="w-full border border-border bg-background p-2.5 font-sans text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors resize-y rounded-none leading-relaxed shadow-2xs"
                  placeholder="Describe how your assistant should greet customers, speak to them, and format its replies... (e.g. Speak politely in Egyptian Arabic, never offer unlisted discounts, format return steps in bullet points)."
                />
              )}

              {isOverCharLimit && (
                <p className="font-sans text-[11px] text-destructive flex items-center gap-1 font-medium">
                  <AlertCircle className="size-3.5 shrink-0" />
                  <span>
                    Character limit exceeded by {currentChars - maxInstructionChars} characters.
                  </span>
                </p>
              )}
            </div>

            {/* Status Feedback Message */}
            {statusMessage && (
              <div
                className={`flex items-center gap-2 p-2.5 text-xs font-sans border ${
                  statusMessage.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                    : "border-destructive/30 bg-destructive/10 text-destructive font-medium"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <Check className="size-4 shrink-0 text-emerald-500" />
                ) : (
                  <AlertCircle className="size-4 shrink-0 text-destructive" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Save to Live Store Assistant Action */}
            <div className="pt-2 border-t border-border">
              <Button
                type="button"
                size="sm"
                onClick={handleSaveSettings}
                disabled={isPending || isOverCharLimit || (isFree && config.systemPrompt.trim().length > 0)}
                className="w-full flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Saving Settings...</span>
                  </>
                ) : (
                  <>
                    <Save className="size-3.5" />
                    <span>Save to Live Store Assistant</span>
                  </>
                )}
              </Button>
              <p className="font-sans text-[10px] text-muted-foreground text-center mt-1.5">
                Saved changes take effect immediately for both Playground and customer storefronts.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Plans Modal */}
      <UpgradePlansModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        restrictedFeature={restrictedFeature}
        currentTier={planTier}
        title="Unlock Custom Brand Instructions"
        subtitle="Give your AI assistant a distinct store personality, language dialect, and customized customer service guidelines."
      />
    </div>
  );
}
