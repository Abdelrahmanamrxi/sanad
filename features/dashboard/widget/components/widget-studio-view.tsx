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
  Loader2,
  AlertCircle,
  Eye,
  X,
} from "lucide-react";
import type { WidgetConfig, EditTab } from "../types";
import { DEFAULT_WIDGET_CONFIG } from "../constants";
import { saveWidgetSettings } from "../actions";
import WidgetEditPanel from "./widget-edit-panel";
import WidgetViewPanel from "./widget-view-panel";

interface WidgetStudioViewProps {
  businessId: string;
  initialConfig?: WidgetConfig;
  widgetSettings?: WidgetConfig;
}

export default function WidgetStudioView({
  businessId = "workspace-live",
  initialConfig,
  widgetSettings,
}: WidgetStudioViewProps) {
  const [config, setConfig] = useState<WidgetConfig>(
    widgetSettings || initialConfig || DEFAULT_WIDGET_CONFIG
  );
  const [activeTab, setActiveTab] = useState<EditTab>("identity");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isCopiedCode, setIsCopiedCode] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  const embedScript = `<script src="https://cdn.sanad.app/widget.js" data-business-id="${businessId}" defer></script>`;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      await saveWidgetSettings(config);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save settings";
      console.error("Failed to save widget settings:", message);
      setSaveError(message);
      setTimeout(() => setSaveError(null), 4000);
    } finally {
      setIsSaving(false);
    }
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
    <div className="relative flex min-h-0 lg:min-h-[820px] h-[calc(100vh-6.5rem)] flex-col border border-border bg-card shadow-xs overflow-hidden">
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
          {/* Mobile: View Chatbot button */}
          <button
            type="button"
            onClick={() => setShowMobilePreview(true)}
            className="lg:hidden flex items-center gap-1.5 border border-primary/50 bg-primary/10 px-3 py-1.5 font-sans text-xs font-semibold text-primary hover:bg-primary/20 transition-colors rounded-none shadow-2xs cursor-pointer"
          >
            <Eye className="size-3.5" />
            <span>View Chatbot</span>
          </button>

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
            disabled={isSaving}
            className={`flex items-center gap-1.5 border px-4 py-1.5 font-sans text-xs font-semibold transition-all rounded-none shadow-2xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
              isSaved
                ? "border-emerald-600 bg-emerald-600 text-white"
                : saveError
                ? "border-destructive bg-destructive text-white"
                : "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : isSaved ? (
              <>
                <Check className="size-3.5" />
                <span>Saved Changes!</span>
              </>
            ) : saveError ? (
              <>
                <AlertCircle className="size-3.5" />
                <span>Save Failed</span>
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

      {/* ── Two-Column Studio Workspace (Desktop: side-by-side, Mobile: single editor column) ── */}
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-12 overflow-hidden bg-background">
        {/* Left Column: Configuration Panels (Full width on mobile, 4 cols on xl, 5 cols on lg) */}
        <div className="flex flex-col lg:border-e border-border lg:col-span-5 xl:col-span-4 h-full overflow-hidden">
          <WidgetEditPanel
            config={config}
            onChange={setConfig}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            businessId={businessId}
          />
        </div>

        {/* Right Column: Live Interactive Storefront Sandbox (Hidden on mobile, 8 cols on xl, 7 cols on lg) */}
        <div className="hidden lg:flex flex-col lg:col-span-7 xl:col-span-8 h-full overflow-hidden">
          <WidgetViewPanel config={config} />
        </div>
      </div>

      {/* ── Mobile Floating "View Chatbot" CTA Button ── */}
      <div className="fixed bottom-5 end-5 z-40 lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobilePreview(true)}
          className="flex items-center gap-2 border border-primary bg-primary px-4 py-2.5 font-sans text-xs font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 transition-all rounded-none cursor-pointer"
        >
          <Bot className="size-4" />
          <span>View Chatbot</span>
          <span className="size-1.5 bg-emerald-400 inline-block animate-pulse" />
        </button>
      </div>

      {/* ── Mobile Full-Screen Chatbot Preview Overlay ── */}
      {showMobilePreview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
          {/* Mobile Preview Top Header */}
          <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="flex size-8 items-center justify-center border shrink-0 text-white shadow-xs"
                style={{
                  backgroundColor: config.primaryColor || "#0F5C55",
                  borderColor: `${config.primaryColor || "#0F5C55"}80`,
                }}
              >
                <Bot className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-sm font-semibold truncate text-foreground">
                    {config.botName || "Sanad Assistant"}
                  </h2>
                  <span className="border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground shrink-0">
                    Live Preview
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {config.subtitle || "Online • Instant verified answers"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowMobilePreview(false)}
                className="flex items-center gap-1.5 border border-border bg-background px-3 py-1.5 font-sans text-xs font-medium text-foreground hover:bg-muted/40 transition-colors rounded-none shadow-2xs cursor-pointer"
              >
                <X className="size-3.5" />
                <span>Close</span>
              </button>
            </div>
          </div>

          {/* Mobile Preview Sandbox */}
          <div className="relative flex-1 overflow-hidden">
            <WidgetViewPanel config={config} isMobileModal />
          </div>
        </div>
      )}
    </div>
  );
}
