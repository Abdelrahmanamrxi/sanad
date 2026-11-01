"use client";

import React from "react";
import Link from "next/link";
import {
  Crown,
  Check,
  Lock,
  X,
  Sparkles,
  ShieldCheck,
  Layers,
  Globe,
  FileText,
  Zap,
} from "lucide-react";
import { PLANS, type PlanTier } from "@/features/billing/plans";
import { cn } from "@/lib/utils";

export interface RestrictedFeatureInfo {
  featureName: string;
  requiredTier: "starter" | "pro";
  reason: string;
}

export interface UpgradePlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  restrictedFeature?: RestrictedFeatureInfo | null;
  currentTier?: PlanTier;
  title?: string;
  subtitle?: string;
}

export default function UpgradePlansModal({
  isOpen,
  onClose,
  restrictedFeature,
  currentTier = "free",
  title,
  subtitle,
}: UpgradePlansModalProps) {
  if (!isOpen) return null;

  const currentPlan = PLANS[currentTier] || PLANS.free;
  const isStarterTarget = restrictedFeature?.requiredTier === "starter";
  const isProTarget = restrictedFeature?.requiredTier === "pro";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-150"
      dir="ltr"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] flex flex-col border border-primary/40 bg-card shadow-2xl my-auto rounded-none overflow-hidden">
        {/* Architectural Crosshair Accents */}
        <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-[10px] text-border select-none z-10">+</span>
        <span className="pointer-events-none absolute -top-1 -right-1 font-mono text-[10px] text-border select-none z-10">+</span>
        <span className="pointer-events-none absolute -bottom-1 -left-1 font-mono text-[10px] text-border select-none z-10">+</span>
        <span className="pointer-events-none absolute -bottom-1 -right-1 font-mono text-[10px] text-border select-none z-10">+</span>

        {/* Modal Header (Pinned at Top) */}
        <div className="flex items-start justify-between gap-3 border-b border-border p-4 sm:p-6 shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="flex size-10 sm:size-11 items-center justify-center bg-primary/15 border border-primary/40 text-primary shrink-0 rounded-none">
              <Crown className="size-4 sm:size-5" />
            </div>
            <div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                {title || "Upgrade Your Sanad Plan"}
              </h3>
              <p className="font-sans text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {subtitle ||
                  "Unlock custom storefront branding, larger knowledge base capacity, and multi-domain authorization."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-none hover:bg-muted/50 transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-4 overscroll-contain">
          {/* Restricted Feature Callout Banner (if triggered by a specific feature) */}
          {restrictedFeature && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 rounded-none">
              <div className="flex items-center gap-2">
                <Lock className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-foreground">Selected Feature: </span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">
                    {restrictedFeature.featureName}
                  </span>
                  <span className="text-muted-foreground ms-1.5 opacity-90">
                    ({restrictedFeature.reason})
                  </span>
                </div>
              </div>
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 self-start sm:self-auto shrink-0 rounded-none">
                Requires {restrictedFeature.requiredTier.toUpperCase()} Plan
              </span>
            </div>
          )}

          {/* Baseline Plan Context Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 border border-border text-xs font-sans text-muted-foreground rounded-none">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary shrink-0" />
              <span>
                Current Plan: <strong className="text-foreground">{currentPlan.name}</strong> ({currentPlan.messages.toLocaleString()} inquiries, {currentPlan.maxDocuments} doc, {currentPlan.maxDomains} domain)
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-bold">
              {currentTier.toUpperCase()}
            </span>
          </div>

          {/* Side-by-Side Dual Plan Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch pt-1">
            {/* ── CARD 1: STARTER PLAN ── */}
            <div
              className={cn(
                "border p-4 sm:p-5 flex flex-col justify-between transition-all bg-background/70 rounded-none",
                isStarterTarget
                  ? "border-amber-500/70 ring-1 ring-amber-500/30 shadow-xs"
                  : "border-border hover:border-primary/40"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-0.5 bg-muted/60 border border-border rounded-none">
                    Starter Tier
                  </span>
                  <span className="font-mono text-xs font-bold text-foreground">
                    Solo Practices
                  </span>
                </div>
                <h4 className="font-heading text-base font-bold text-foreground">
                  {PLANS.starter.name} Plan
                </h4>
                <p className="text-[11px] text-muted-foreground font-sans mt-0.5 mb-3 leading-relaxed">
                  Essential capacity for solo clinics, boutique shops, and single practitioners.
                </p>

                <ul className="space-y-1.5 sm:space-y-2 text-xs font-sans text-foreground/90 border-t border-border/60 pt-3">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>
                      <strong>{PLANS.starter.messages.toLocaleString()}</strong> customer inquiries / mo
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>
                      <strong>{PLANS.starter.maxDocuments} source documents</strong> (up to {PLANS.starter.maxTotalPages} pages, {PLANS.starter.maxFileSizeMb}MB/file)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>
                      Up to <strong>{PLANS.starter.maxDomains} authorized storefront domains</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>
                      <strong>Custom assistant name</strong> & branding identity
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>Standard conversation analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>All container silhouettes & styling included</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 sm:pt-5">
                <Link
                  href="/dashboard/billing"
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-sans font-semibold border border-border bg-background hover:bg-muted/60 text-foreground transition-colors cursor-pointer rounded-none"
                >
                  <span>Select Starter Plan</span>
                </Link>
              </div>
            </div>

            {/* ── CARD 2: PRO (GROWTH) PLAN ── */}
            <div
              className={cn(
                "border-2 p-4 sm:p-5 flex flex-col justify-between transition-all bg-background relative rounded-none",
                isProTarget
                  ? "border-primary ring-2 ring-primary/20 shadow-md"
                  : "border-primary/60 shadow-xs hover:border-primary"
              )}
            >
              {/* Most Popular Badge */}
              <div className="absolute -top-3 left-4">
                <span className="px-2.5 py-0.5 bg-primary text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-xs rounded-none">
                  Most Popular For Clinics
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 pt-1">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                    Growth Tier
                  </span>
                  <span className="font-mono text-sm font-bold text-primary">
                    990 EGP <span className="text-[10px] text-muted-foreground font-normal">/ mo</span>
                  </span>
                </div>
                <h4 className="font-heading text-base font-bold text-foreground">
                  Pro ({PLANS.pro.name}) Plan
                </h4>
                <p className="text-[11px] text-muted-foreground font-sans mt-0.5 mb-3 leading-relaxed">
                  For multi-doctor clinics, restaurants, and high-volume commerce stores.
                </p>

                <ul className="space-y-1.5 sm:space-y-2 text-xs font-sans text-foreground/90 border-t border-border/60 pt-3">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>
                      <strong>{PLANS.pro.messages.toLocaleString()}</strong> customer inquiries / mo
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-emerald-500 shrink-0" />
                    <span>
                      <strong>{PLANS.pro.maxDocuments} source documents</strong> (up to {PLANS.pro.maxTotalPages} pages, {PLANS.pro.maxFileSizeMb}MB/file)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>
                      Up to <strong>{PLANS.pro.maxDomains} authorized storefront domains</strong>
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>
                      <strong>100% White-Label</strong> (Remove &quot;Powered by Sanad&quot;)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>
                      <strong>Priority Human Support</strong> agent handoff
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>Live website URL crawler & auto-sync</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-primary shrink-0" />
                    <span>All container silhouettes & styling included</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 sm:pt-5">
                <Link
                  href="/dashboard/billing"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-sans font-bold bg-primary hover:bg-primary/90 text-white transition-colors cursor-pointer shadow-xs rounded-none"
                >
                  <Crown className="size-3.5" />
                  <span>Upgrade to Pro (990 EGP)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Pinned at Bottom) */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-t border-border bg-card/90 shrink-0">
          <span className="text-[11px] text-muted-foreground font-sans hidden sm:inline">
            Need help picking a plan? Contact our team anytime.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-sans font-medium text-muted-foreground hover:text-foreground border border-border bg-background hover:bg-muted/50 transition-colors cursor-pointer rounded-none"
          >
            Keep Previewing
          </button>
        </div>
      </div>
    </div>
  );
}
