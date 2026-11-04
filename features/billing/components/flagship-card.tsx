import React from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import type { PlanConfig, PlanTier } from "../plans";

interface FlagshipCardProps {
  currentTier: PlanTier;
  flagshipConfig: PlanConfig;
  onUpgrade?: () => void;
}

export function FlagshipCard({
  currentTier,
  flagshipConfig,
  onUpgrade,
}: FlagshipCardProps) {
  const isPro = currentTier === "pro";

  return (
    <div className="relative bg-card border-2 border-primary p-6 sm:p-7 shadow-xl flex flex-col justify-between rounded-none">
      {/* Flagship Corner Crosshairs */}
      <span className="pointer-events-none absolute -top-1.5 -left-1.5 font-mono text-xs text-primary font-bold select-none">+</span>
      <span className="pointer-events-none absolute -top-1.5 -right-1.5 font-mono text-xs text-primary font-bold select-none">+</span>
      <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 font-mono text-xs text-primary font-bold select-none">+</span>
      <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 font-mono text-xs text-primary font-bold select-none">+</span>

      {/* Flagship Top Badge */}
      <div className="absolute -top-3.5 left-5">
        <span className="px-3 py-1 bg-amber-500 text-amber-950 font-mono text-[10px] font-bold uppercase tracking-wider shadow-sm rounded-none">
          ★ Flagship For Clinics & High-Volume Commerce
        </span>
      </div>

      <div className="space-y-4 pt-1">
        {/* Tier Label */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary px-2 py-0.5 bg-primary/10 border border-primary/30 rounded-none">
            Growth Tier
          </span>
          <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
            Multi-Doctor & Stores
          </span>
        </div>

        {/* Plan Title & Price */}
        <div>
          <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-foreground">
            {flagshipConfig.name} (Pro)
          </h3>
          <div className="flex items-baseline gap-1.5 font-mono mt-1">
            <span className="text-3xl font-extrabold text-primary">990</span>
            <span className="text-xs font-semibold text-foreground">EGP</span>
            <span className="text-xs text-muted-foreground font-sans">/ month</span>
          </div>
          <p className="text-xs text-muted-foreground font-sans mt-2 leading-relaxed">
            Engineered for high-volume customer inquiries, comprehensive multi-document knowledge bases, and multi-tenant storefront deployments.
          </p>
        </div>

        {/* Feature List (NO PAGES MENTION!) */}
        <div className="border-t border-border/80 pt-4 space-y-2.5 text-xs font-sans">
          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-foreground">
              <strong>{flagshipConfig.messages.toLocaleString()}</strong> customer inquiries / mo
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-foreground">
              <strong>{flagshipConfig.maxDocuments} source documents</strong> ({flagshipConfig.maxFileSizeMb}MB/file)
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-foreground">
              Up to <strong>{flagshipConfig.maxDomains} authorized store domains</strong>
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-primary shrink-0 mt-0.5" />
            <span className="text-foreground">
              <strong>100% White-Label</strong> (Remove badge)
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-primary shrink-0 mt-0.5" />
            <span className="text-foreground">
              <strong>Verified Document Citation Badges</strong> (PRO)
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-primary shrink-0 mt-0.5" />
            <span className="text-foreground">
              <strong>Priority Human Support</strong> agent handoff
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-primary shrink-0 mt-0.5" />
            <span className="text-foreground">
              Live URL website crawler & auto-sync
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-6">
        {isPro ? (
          <div className="w-full py-2.5 text-xs font-mono font-bold bg-primary/15 border border-primary/50 text-primary text-center rounded-none">
            Current Active Plan
          </div>
        ) : (
          <button
            type="button"
            onClick={onUpgrade}
            className="w-full py-2.5 text-xs font-mono font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 rounded-none"
          >
            <Sparkles className="size-4" />
            <span>Upgrade to Flagship Pro (990 EGP/mo)</span>
            <ArrowRight className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
