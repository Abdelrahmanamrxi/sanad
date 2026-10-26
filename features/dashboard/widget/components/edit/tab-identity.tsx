"use client";

import React from "react";
import { Globe, Bot } from "lucide-react";
import type { WidgetConfig, WidgetLanguage } from "../../types";

import AllowedDomainsInput from "./allowed-domains-input";

interface TabIdentityProps {
  config: WidgetConfig;
  onChange: (config: WidgetConfig) => void;
  domainError?: string | null;
}

export default function TabIdentity({ config, onChange, domainError }: TabIdentityProps) {
  const languageOptions = [
    {
      id: "auto",
      label: "Auto Detect",
      badge: "AUTO",
      badgeColor: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
      desc: "Matches the visitor's storefront language automatically.",
    },
    {
      id: "en",
      label: "English (LTR)",
      badge: "LTR",
      badgeColor: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
      desc: "Standard left-to-right alignment for English storefronts.",
    },
    {
      id: "ar",
      label: "Arabic (RTL)",
      badge: "RTL",
      badgeColor: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      desc: "Forces right-to-left alignment for Arabic storefronts.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Top Helper Banner ── */}
      <div className="flex items-center gap-2.5 border border-emerald-500/30 bg-emerald-500/10 p-3 rounded-none">
        <Bot className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <p className="text-xs font-sans text-emerald-950 dark:text-emerald-200 leading-relaxed">
          Configure your assistant&apos;s public brand name, online presence subtitle, and default language.
        </p>
      </div>

      {/* Assistant Name */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Assistant Name
          </label>
          <span className="font-mono text-[10px] text-primary font-bold">
            {config.botName.length} / 40
          </span>
        </div>
        <input
          type="text"
          maxLength={40}
          value={config.botName}
          onChange={(e) => onChange({ ...config, botName: e.target.value })}
          placeholder="e.g. Sanad AI Support"
          className="w-full border border-border bg-background px-3 py-2 font-sans text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all rounded-none shadow-2xs"
        />
        <p className="mt-1 text-[11px] text-muted-foreground font-sans">
          Displayed prominently in the widget header and above verified AI responses.
        </p>
      </div>

      {/* Status Subtitle */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Status Subtitle
          </label>
          <span className="font-mono text-[10px] text-primary font-bold">
            {config.subtitle.length} / 60
          </span>
        </div>
        <input
          type="text"
          maxLength={60}
          value={config.subtitle}
          onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
          placeholder="e.g. Online • Instant verified answers"
          className="w-full border border-border bg-background px-3 py-2 font-sans text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all rounded-none shadow-2xs"
        />
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground font-sans">
          <span className="size-1.5 bg-emerald-500 rounded-none inline-block animate-pulse" />
          <span>Accompanied by a pulsing green availability indicator in the header.</span>
        </div>
      </div>

      {/* Language & Text Direction */}
      <div className="border-t border-border pt-4">
        <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Language & Text Direction
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {languageOptions.map((item) => {
            const isSelected = config.defaultLanguage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ ...config, defaultLanguage: item.id as WidgetLanguage })}
                className={`border p-3 text-start transition-all rounded-none shadow-2xs cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30 font-semibold"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Globe className="size-3.5 text-primary" />
                  <span className={`border px-1.5 py-0.2 font-mono text-[9px] font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <span className="block font-sans text-xs text-foreground font-semibold">{item.label}</span>
                <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Authorized Domains Whitelist */}
      <div className="border-t border-border pt-4">
        <AllowedDomainsInput
          domains={config.allowedDomains || []}
          onChange={(domains) => onChange({ ...config, allowedDomains: domains })}
          error={domainError}
        />
      </div>
    </div>
  );
}
