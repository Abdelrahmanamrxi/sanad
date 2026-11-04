"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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
          <div className="relative flex size-11 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
            <Bot className="size-5" />
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
        

          {/* Expand / Minimize Container Toggle */}
          <Button
            type="button"
            size="sm"
            variant={isExpanded ? "secondary" : "outline"}
            onClick={onToggleExpand}
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
          </Button>

          {/* Toggle Inspector Pane Button */}
          <Button
            type="button"
            size="sm"
            variant={isInspectorOpen ? "secondary" : "outline"}
            onClick={onToggleInspector}
            title="Toggle Settings and Document Sources Panel"
          >
            <Sliders className="size-3.5" />
            <span className="hidden sm:inline">Settings & Sources</span>
          </Button>

          {/* Clear Session */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onResetConversation}
            disabled={messageCount === 0}
            className="hover:border-destructive hover:text-destructive"
            title="Clear chat history"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
