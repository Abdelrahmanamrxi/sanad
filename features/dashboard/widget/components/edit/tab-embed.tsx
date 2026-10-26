"use client";

import React, { useState } from "react";
import { Copy, Check, ExternalLink, Code2 } from "lucide-react";
import { PLATFORM_GUIDES } from "../../constants";
import type { WidgetConfig } from "../../types";
import AllowedDomainsInput from "./allowed-domains-input";

interface TabEmbedProps {
  businessId: string;
  config?: WidgetConfig;
  onChange?: (config: WidgetConfig) => void;
  domainError?: string | null;
}

export default function TabEmbed({
  businessId,
  config,
  onChange,
  domainError,
}: TabEmbedProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activePlatform, setActivePlatform] = useState<"salla" | "shopify" | "wordpress">("salla");

  const appOrigin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://sanad.app";
  const positionAttr = config?.position ? `\n  data-position="${config.position}"` : "";

  const embedScript = `<script 
  src="${appOrigin}/widget.js" 
  data-business-id="${businessId}"${positionAttr} 
  defer>
</script>`;

  const directChatUrl = `${appOrigin}/chat/${businessId}`;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(embedScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(directChatUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const platformMeta = {
    salla: {
      color: "border-teal-500/40 bg-teal-500/10 text-teal-700 dark:text-teal-300",
      accent: "bg-teal-600",
    },
    shopify: {
      color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      accent: "bg-emerald-600",
    },
    wordpress: {
      color: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300",
      accent: "bg-blue-600",
    },
  };

  const currentPlatformGuide = PLATFORM_GUIDES.find((p) => p.id === activePlatform) || PLATFORM_GUIDES[0];

  return (
    <div className="space-y-6">
      {/* ── Top Helper Banner ── */}
      <div className="flex items-center gap-2.5 border border-teal-500/30 bg-teal-500/10 p-3 rounded-none">
        <Code2 className="size-4 text-teal-600 dark:text-teal-400 shrink-0" />
        <p className="text-xs font-sans text-teal-950 dark:text-teal-200 leading-relaxed">
          Configure authorized domains and copy this single script tag to embed in your online store.
        </p>
      </div>

      {/* 1. Authorized Domains Whitelist */}
      {config && onChange && (
        <div className="border border-border bg-card p-4 rounded-none shadow-2xs">
          <AllowedDomainsInput
            domains={config.allowedDomains || []}
            onChange={(domains) => onChange({ ...config, allowedDomains: domains })}
            error={domainError}
          />
        </div>
      )}

      {/* 2. Universal HTML Embed Script */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Universal HTML Embed Tag
          </label>
          <button
            type="button"
            onClick={handleCopyCode}
            className={`flex items-center gap-1.5 border px-3 py-1 font-sans text-xs font-semibold transition-all rounded-none shadow-2xs cursor-pointer ${
              copiedCode
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {copiedCode ? (
              <>
                <Check className="size-3.5" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy Snippet</span>
              </>
            )}
          </button>
        </div>

        {/* Syntax-Highlighted Terminal Container */}
        <div className="relative border border-stone-800 bg-stone-950 p-4 font-mono text-[11px] text-stone-200 leading-relaxed select-all overflow-x-auto rounded-none shadow-lg">
          <span className="text-teal-400">&lt;script</span>{" "}
          <br />
          &nbsp;&nbsp;<span className="text-amber-400">src</span>=
          <span className="text-emerald-400">&quot;{appOrigin}/widget.js&quot;</span>
          <br />
          &nbsp;&nbsp;<span className="text-amber-400">data-business-id</span>=
          <span className="text-purple-300">&quot;{businessId}&quot;</span>
          {config?.position && (
            <>
              <br />
              &nbsp;&nbsp;<span className="text-amber-400">data-position</span>=
              <span className="text-purple-300">&quot;{config.position}&quot;</span>
            </>
          )}
          <br />
          &nbsp;&nbsp;<span className="text-amber-400">defer</span>
          <br />
          <span className="text-teal-400">&gt;&lt;/script&gt;</span>
        </div>
        <p className="mt-1.5 font-sans text-[11px] text-muted-foreground leading-relaxed">
          Paste this tag into your store header or right before the closing <code>&lt;/body&gt;</code> tag. Operates with zero external runtime dependencies.
        </p>
      </div>

      {/* 2. Direct Shareable Link */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Direct Shareable URL
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1 border border-border bg-background px-2.5 py-1 font-sans text-xs text-muted-foreground hover:text-foreground transition-colors rounded-none shadow-2xs cursor-pointer"
            >
              {copiedLink ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
              <span>{copiedLink ? "Copied" : "Copy Link"}</span>
            </button>
            <a
              href={directChatUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 border border-border bg-background px-2.5 py-1 font-sans text-xs text-muted-foreground hover:text-foreground transition-colors rounded-none shadow-2xs"
            >
              <ExternalLink className="size-3" />
              <span>Preview</span>
            </a>
          </div>
        </div>

        <div className="border border-border bg-background px-3 py-2 font-mono text-xs text-primary font-medium truncate rounded-none select-all shadow-2xs">
          {directChatUrl}
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground font-sans">
          Use this standalone link for Instagram bio buttons, WhatsApp quick action catalogs, or SMS support flows.
        </p>
      </div>

      {/* 3. Platform Guides */}
      <div className="border-t border-border pt-4">
        <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Platform Installation Guides
        </label>

        {/* Platform switcher cards */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-2 mb-3">
          {PLATFORM_GUIDES.map((platform) => {
            const meta = platformMeta[platform.id];
            const isSelected = activePlatform === platform.id;
            return (
              <button
                key={platform.id}
                type="button"
                onClick={() => setActivePlatform(platform.id)}
                className={`border p-2.5 text-center font-sans text-xs transition-all rounded-none cursor-pointer shadow-2xs ${
                  isSelected
                    ? `${meta.color} font-bold ring-2 ring-primary/40`
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <span className="block font-bold">{platform.name}</span>
                <span className="block text-[10px] opacity-80">{platform.tagline}</span>
              </button>
            );
          })}
        </div>

        {/* Step-by-step card */}
        <div className="border border-border bg-background p-4 space-y-3 rounded-none shadow-2xs">
          <div className="flex items-center justify-between border-b border-border pb-2.5">
            <div className="flex items-center gap-2">
              <span className={`size-2.5 ${platformMeta[activePlatform].accent} inline-block`} />
              <span className="font-sans text-xs font-bold text-foreground">
                Integration Steps for {currentPlatformGuide.name}
              </span>
            </div>
            <span className="border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              3 Quick Steps
            </span>
          </div>

          <div className="space-y-3">
            {currentPlatformGuide.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="flex size-5 shrink-0 items-center justify-center font-mono text-[10px] font-bold bg-primary text-primary-foreground shadow-xs mt-0.5">
                  {idx + 1}
                </span>
                <p className="font-sans text-foreground text-xs leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
