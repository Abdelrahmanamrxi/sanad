"use client";

import React from "react";
import {
  RotateCcw,
  Sparkles,
  Bot,
  Columns,
} from "lucide-react";
import { SYSTEM_PRESETS, AVAILABLE_MODELS } from "../constants";
import type { PlaygroundConfig } from "../types";

interface PlaygroundHeaderProps {
  config: PlaygroundConfig;
  onConfigChange: (newConfig: PlaygroundConfig) => void;
  onResetConversation: () => void;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
  messageCount: number;
}

export function PlaygroundHeader({
  config,
  onConfigChange,
  onResetConversation,
  isInspectorOpen,
  onToggleInspector,
  messageCount,
}: PlaygroundHeaderProps) {
  const currentModel = AVAILABLE_MODELS.find((m) => m.id === config.model) || AVAILABLE_MODELS[0];

  const handlePresetSelect = (presetId: string) => {
    const preset = SYSTEM_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    onConfigChange({
      ...config,
      systemPrompt: preset.systemPrompt,
      temperature: preset.temperature,
      strictGrounding: preset.strictGrounding,
    });
  };

  return (
    <div className="flex flex-col gap-3 border-b border-border bg-card p-4 transition-colors">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Title & Purpose */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center border border-primary/30 bg-primary/10 text-primary">
            <Bot className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-base font-semibold tracking-tight text-foreground font-sans">
                AI Assistant Playground
              </h1>
              <span className="border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Live Simulator
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground font-sans">
              Test how your assistant answers customer questions using your uploaded knowledge base
            </p>
          </div>
        </div>

        {/* Right: Controls & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Model Indicator */}
          <div className="flex items-center gap-2 border border-border bg-background px-2.5 py-1.5 font-sans text-xs text-foreground">
            <span className="size-2 bg-emerald-500 inline-block animate-pulse" />
            <span className="text-muted-foreground text-[11px]">Assistant:</span>
            <span className="font-semibold text-foreground text-[11px]">{currentModel.name}</span>
            <span className="border border-border bg-muted px-1.5 py-0.2 font-mono text-[9px] text-muted-foreground">
              {currentModel.speed}
            </span>
          </div>

          {/* Preset Selector */}
          <div className="relative">
            <select
              aria-label="Assistant Role Preset"
              className="appearance-none border border-border bg-background px-3 py-1.5 pe-8 font-sans text-xs text-foreground outline-none hover:border-primary focus:border-primary transition-colors cursor-pointer rounded-none"
              onChange={(e) => handlePresetSelect(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select Role / Tone...
              </option>
              {SYSTEM_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
            <Sparkles className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
          </div>

          {/* Toggle Inspector Pane */}
          <button
            type="button"
            onClick={onToggleInspector}
            className={`flex items-center gap-1.5 border px-3 py-1.5 font-sans text-xs transition-colors rounded-none ${
              isInspectorOpen
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-border"
            }`}
            title="Toggle Settings and Document Sources Panel"
          >
            <Columns className="size-3.5" />
            <span className="hidden sm:inline">Settings & Sources</span>
          </button>

          {/* Clear Session */}
          <button
            type="button"
            onClick={onResetConversation}
            disabled={messageCount === 0}
            className="flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 font-sans text-xs text-muted-foreground transition-colors hover:border-destructive hover:text-destructive disabled:opacity-40 disabled:pointer-events-none rounded-none"
            title="Clear chat history"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
