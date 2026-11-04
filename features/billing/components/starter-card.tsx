import React from "react";
import { Check, ArrowRight, Building2 } from "lucide-react";
import type { PlanConfig, PlanTier } from "../plans";

interface StarterCardProps {
  currentTier: PlanTier;
  starterConfig: PlanConfig;
  onSelect?: () => void;
}

export function StarterCard({
  currentTier,
  starterConfig,
  onSelect,
}: StarterCardProps) {
  const isStarter = currentTier === "starter";

  return (
    <div className="relative bg-card border border-border p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors rounded-none">
      {/* Corner Crosshairs */}
      <span className="pointer-events-none absolute -top-1.5 -left-1.5 font-mono text-xs text-border font-bold select-none">+</span>
      <span className="pointer-events-none absolute -top-1.5 -right-1.5 font-mono text-xs text-border font-bold select-none">+</span>
      <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 font-mono text-xs text-border font-bold select-none">+</span>
      <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 font-mono text-xs text-border font-bold select-none">+</span>

      <div className="space-y-4">
        {/* Tier Label */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-0.5 bg-muted/60 border border-border rounded-none">
            Starter Tier
          </span>
          <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
            <Building2 className="size-3 text-primary" />
            Solo Practices
          </span>
        </div>

        {/* Plan Title & Price */}
        <div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            {starterConfig.name} Plan
          </h3>
          <div className="flex items-baseline gap-1.5 font-mono mt-1">
            <span className="text-3xl font-extrabold text-foreground">490</span>
            <span className="text-xs font-semibold text-foreground">EGP</span>
            <span className="text-xs text-muted-foreground font-sans">/ month</span>
          </div>
          <p className="text-xs text-muted-foreground font-sans mt-2 leading-relaxed">
            Essential capacity for solo clinics, single boutique stores, and individual consultants.
          </p>
        </div>

        {/* Feature List (NO PAGES MENTION!) */}
        <div className="border-t border-border/80 pt-4 space-y-2.5 text-xs font-sans">
          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-foreground">
              <strong>{starterConfig.messages.toLocaleString()}</strong> customer inquiries / mo
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-foreground">
              <strong>{starterConfig.maxDocuments} source documents</strong> ({starterConfig.maxFileSizeMb}MB/file)
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-foreground">
              Up to <strong>{starterConfig.maxDomains} authorized store domains</strong>
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-foreground">
              <strong>Custom assistant name</strong> & identity
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-foreground">
              Standard conversation analytics & logs
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-foreground">
              All container silhouettes & styling included
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-6">
        {isStarter ? (
          <div className="w-full py-2.5 text-xs font-mono font-bold bg-muted/60 border border-border text-foreground text-center rounded-none">
            Current Active Plan
          </div>
        ) : (
          <button
            type="button"
            onClick={onSelect}
            className="w-full py-2.5 text-xs font-mono font-bold border border-border bg-background hover:bg-muted/60 text-foreground transition-colors cursor-pointer flex items-center justify-center gap-1.5 rounded-none"
          >
            <span>{currentTier === "pro" ? "Switch to Starter" : "Select Starter Plan (490 EGP/mo)"}</span>
            <ArrowRight className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

