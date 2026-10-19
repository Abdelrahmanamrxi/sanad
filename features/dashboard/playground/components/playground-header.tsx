"use client";

import React from "react";
import {
  RotateCcw,
  Sparkles,
  Bot,
  Sliders,
  CheckCircle2,
  Maximize2,
  Minimize2,
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
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function PlaygroundHeader({
  config,
  onConfigChange,
  onResetConversation,
  isInspectorOpen,
  onToggleInspector,
  messageCount,
  isExpanded,
  onToggleExpand,
}: PlaygroundHeaderProps) {
  const currentModel = AVAILABLE_MODELS.find((m) => m.id === config.model) || AVAILABLE_MODELS[0];

  const handlePresetSelect = (presetId: string) => {
      const preset = SYSTEM_PRESETS.find((p) => p.id === presetId)
   
    if (!preset) return;
    onConfigChange({
      ...config,
      systemPrompt: preset.systemPrompt,
      temperature: preset.temperature,
      strictGrounding: preset.strictGrounding,
    });
  };
  console.log(config)
  return (
    <div className="relative flex flex-col gap-3 border-b border-border bg-card p-4 transition-colors">
      {/* Corner crosshair accents for architectural craft */}
      <span className="pointer-events-none absolute -bottom-1 -left-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -bottom-1 -right-1 font-mono text-[10px] text-border select-none">+</span>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Studio Identity & Knowledge Status */}
        <div className="flex items-center gap-3">
          <div className="relative flex size-9 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
            <Bot className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 size-1.5 bg-emerald-500 ring-2 ring-card" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-sm sm:text-base font-semibold tracking-tight text-foreground font-sans">
                Sanad AI Simulator
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <CheckCircle2 className="size-2.5 text-emerald-500" />
                <span>Knowledge Base Active</span>
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground font-sans">
              Test how your assistant answers customer questions using your verified documents
            </p>
          </div>
        </div>

        {/* Right: Controls & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Active Model Indicator */}
          <div className="flex items-center gap-2 border border-border bg-background px-2.5 py-1.5 font-sans text-xs text-foreground shadow-2xs">
            <span className="size-2 bg-emerald-500 inline-block animate-pulse" />
            <span className="text-muted-foreground text-[11px]">Engine:</span>
            <span className="font-semibold text-foreground text-[11px]">{currentModel.name}</span>
            <span className="border border-border bg-muted px-1.5 py-0.2 font-mono text-[9px] text-muted-foreground">
              {currentModel.speed}
            </span>
          </div>

          {/* Assistant Role & Tone Preset */}
          <div className="relative">
            <select
              aria-label="Assistant Role Preset"
              className="appearance-none border border-border bg-background px-3 py-1.5 pe-8 font-sans text-xs text-foreground outline-none hover:border-primary focus:border-primary transition-colors cursor-pointer rounded-none shadow-2xs"
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

          {/* Expand / Minimize Container Toggle */}
          <button
            type="button"
            onClick={onToggleExpand}
            className={`flex items-center gap-1.5 border px-3 py-1.5 font-sans text-xs transition-colors rounded-none shadow-2xs ${
              isExpanded
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-border"
            }`}
            title={isExpanded ? "Exit Expanded View (Esc)" : "Expand Container to Fullscreen"}
          >
            {isExpanded ? (
              <>
                <Minimize2 className="size-3.5" />
                <span className="hidden sm:inline">Minimize View</span>
                <span className="font-mono text-[10px] text-primary/70 ms-1 hidden lg:inline">Esc</span>
              </>
            ) : (
              <>
                <Maximize2 className="size-3.5" />
                <span className="hidden sm:inline">Expand Studio</span>
              </>
            )}
          </button>

          {/* Toggle Inspector Pane Button */}
          <button
            type="button"
            onClick={onToggleInspector}
            className={`flex items-center gap-1.5 border px-3 py-1.5 font-sans text-xs transition-colors rounded-none shadow-2xs ${
              isInspectorOpen
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-border"
            }`}
            title="Toggle Settings and Document Sources Panel"
          >
            <Sliders className="size-3.5" />
            <span className="hidden sm:inline">Settings & Sources</span>
          </button>

          {/* Clear Session */}
          <button
            type="button"
            onClick={onResetConversation}
            disabled={messageCount === 0}
            className="flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 font-sans text-xs text-muted-foreground transition-colors hover:border-destructive hover:text-destructive disabled:opacity-40 disabled:pointer-events-none rounded-none shadow-2xs"
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
