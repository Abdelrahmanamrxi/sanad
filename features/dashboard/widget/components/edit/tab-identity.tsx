"use client";

import React from "react";
import { Globe, Bot, Lock } from "lucide-react";
import type { WidgetConfig, WidgetLanguage } from "../../types";
import { type PlanTier, PLANS } from "@/features/billing/plans";
import { cn } from "@/lib/utils";

import AllowedDomainsInput from "./allowed-domains-input";

interface TabIdentityProps {
  config: WidgetConfig;
  onChange: (config: WidgetConfig) => void;
  domainError?: string | null;
  planTier?: PlanTier;
  onUpgrade?: () => void;
}

export default function TabIdentity({
  config,
  onChange,
  domainError,
  planTier = "free",
  onUpgrade,
}: TabIdentityProps) {
  const isFree = planTier === "free";
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
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <span>Assistant Name</span>
            {isFree && (
              <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1 rounded-none">
                <Lock className="size-2.5" />
                <span>STARTER TIER</span>
              </span>
            )}
          </label>
          <span className="font-mono text-[10px] text-muted-foreground">
            {isFree ? "Default Name" : `${config.botName.length} / 40`}
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            maxLength={40}
            disabled={isFree}
            value={isFree ? (config.botName || "Sanad Assistant") : config.botName}
            onChange={(e) => onChange({ ...config, botName: e.target.value })}
            placeholder="e.g. Sanad AI Support"
            className={cn(
              "w-full border px-3 py-2 font-sans text-xs outline-none transition-all rounded-none shadow-2xs",
              isFree
                ? "border-border/80 bg-muted/60 text-muted-foreground cursor-not-allowed border-dashed select-none"
                : "border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/30"
            )}
          />
          {isFree && (
            <div className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Lock className="size-3.5" />
            </div>
          )}
        </div>

        {isFree ? (
          <div className="mt-2 flex items-center justify-between p-2.5 bg-amber-500/10 border border-amber-500/25 text-xs rounded-none">
            <div className="flex items-center gap-2">
              <Lock className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-[11px] text-foreground/90 leading-tight">
                Free plan defaults to <strong>&quot;Sanad Assistant&quot;</strong>. Upgrade to Starter to brand with your store or clinic name.
              </span>
            </div>
            {onUpgrade && (
              <button
                type="button"
                onClick={onUpgrade}
                className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-500/40 shrink-0 cursor-pointer transition-colors rounded-none whitespace-nowrap"
              >
                UPGRADE
              </button>
            )}
          </div>
        ) : (
          <p className="mt-1 text-[11px] text-muted-foreground font-sans">
            Displayed prominently in the widget header and above verified AI responses.
          </p>
        )}
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
          maxAllowed={PLANS[planTier || "free"].maxDomains}
          planTier={planTier}
          onUpgrade={onUpgrade}
        />
      </div>
    </div>
  );
}
