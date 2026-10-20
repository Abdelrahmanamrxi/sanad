"use client";

import React, { useState } from "react";
import {
  Sliders,
  Code2,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Bot,
  Copy,
  ExternalLink,
} from "lucide-react";
import type { WidgetConfig, EditTab } from "../types";
import { DEFAULT_WIDGET_CONFIG } from "../constants";
import WidgetEditPanel from "./widget-edit-panel";
import WidgetViewPanel from "./widget-view-panel";

interface WidgetStudioViewProps {
  businessId?: string;
}

export default function WidgetStudioView({
  businessId = "workspace-live",
}: WidgetStudioViewProps) {
  const [config, setConfig] = useState<WidgetConfig>(DEFAULT_WIDGET_CONFIG);
  const [activeTab, setActiveTab] = useState<EditTab>("identity");
  const [isSaved, setIsSaved] = useState(false);
  const [isCopiedCode, setIsCopiedCode] = useState(false);

  const embedScript = `<script src="https://cdn.sanad.app/widget.js" data-business-id="${businessId}" defer></script>`;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(embedScript);
    setIsCopiedCode(true);
    setTimeout(() => setIsCopiedCode(false), 2000);
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_WIDGET_CONFIG);
  };

  return (
    <div className="relative flex min-h-[820px] h-[calc(100vh-6.5rem)] flex-col border border-border bg-card shadow-xs overflow-hidden">
      {/* Corner crosshairs for architectural craft */}
      <span className="pointer-events-none absolute -bottom-1 -left-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -bottom-1 -right-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -top-1 -right-1 font-mono text-[10px] text-border select-none">+</span>

      {/* ── Studio Header Bar ── */}
      <div className="flex flex-col gap-3 border-b border-border bg-card p-4 transition-colors lg:flex-row lg:items-center lg:justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative flex size-11 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
            <Bot className="size-5" />
            <span className="absolute -top-0.5 -right-0.5 size-1.5 bg-emerald-500 ring-2 ring-card" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-base font-semibold tracking-tight text-foreground font-sans">
                Sanad Widget Studio
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                <span className="size-1.5 bg-emerald-500 inline-block animate-pulse" />
                <span>Live Deploy Ready</span>
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground font-sans">
              Customize your storefront assistant appearance, branding, and copy the embed script
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Reset button */}
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 font-sans text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors rounded-none shadow-2xs cursor-pointer"
            title="Reset configuration to initial defaults"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          {/* Quick Copy Script */}
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 font-sans text-xs text-foreground hover:border-primary transition-colors rounded-none shadow-2xs cursor-pointer"
          >
            {isCopiedCode ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span>Copied Script!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5 text-muted-foreground" />
                <span>Copy Script</span>
              </>
            )}
          </button>

          {/* Save Changes button */}
          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center gap-1.5 border px-4 py-1.5 font-sans text-xs font-semibold transition-all rounded-none shadow-2xs cursor-pointer ${
              isSaved
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isSaved ? (
              <>
                <Check className="size-3.5" />
                <span>Saved Changes!</span>
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Two-Column Studio Workspace ── */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-12 overflow-hidden bg-background">
        {/* Left Column: Configuration Panels (4 cols on xl, 5 cols on lg) */}
        <div className="flex flex-col border-b border-border lg:border-b-0 lg:border-e lg:col-span-5 xl:col-span-4 h-full overflow-hidden">
          <WidgetEditPanel
            config={config}
            onChange={setConfig}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            businessId={businessId}
          />
        </div>

        {/* Right Column: Live Interactive Storefront Sandbox (8 cols on xl, 7 cols on lg) */}
        <div className="flex flex-col lg:col-span-7 xl:col-span-8 h-full overflow-hidden">
          <WidgetViewPanel config={config} />
        </div>
      </div>
    </div>
  );
}
