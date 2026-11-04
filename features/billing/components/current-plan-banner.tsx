import React from "react";
import { ShieldCheck, Calendar, Zap, AlertTriangle } from "lucide-react";
import { UsageMeter } from "./usage-meter";
import type { BillingViewData } from "../types";
import { cn } from "@/lib/utils";

interface CurrentPlanBannerProps {
  data: BillingViewData;
}

export function CurrentPlanBanner({ data }: CurrentPlanBannerProps) {
  const {
    planTier,
    planConfig,
    messagesUsed,
    messageLimit,
    documentsCount,
    maxDocuments,
    domainsCount,
    maxDomains,
    periodStart,
    periodEnd,
  } = data;

  const isPro = planTier === "pro";
  const isFree = planTier === "free";

  const formattedPeriodEnd = periodEnd
    ? new Date(periodEnd).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedPeriodStart = periodStart
    ? new Date(periodStart).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="relative bg-card border border-border p-5 sm:p-6 shadow-xl space-y-5 rounded-none">
      {/* Architectural Corner Crosshairs */}
      <span className="pointer-events-none absolute -top-2 -left-2 font-mono text-xs text-primary font-bold select-none">+</span>
      <span className="pointer-events-none absolute -top-2 -right-2 font-mono text-xs text-primary font-bold select-none">+</span>
      <span className="pointer-events-none absolute -bottom-2 -left-2 font-mono text-xs text-primary font-bold select-none">+</span>
      <span className="pointer-events-none absolute -bottom-2 -right-2 font-mono text-xs text-primary font-bold select-none">+</span>

      {/* Top Identity Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="size-11 bg-primary/10 border border-primary/40 flex items-center justify-center shrink-0 text-primary">
            <Zap className="size-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading text-lg font-bold text-foreground">
                {planTier.toUpperCase()} PLAN
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/15 border border-primary/30 text-primary rounded-none">
                {planTier.toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-none">
                <span className="size-1.5 bg-emerald-500 rounded-none animate-pulse" />
                ACTIVE
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground font-sans">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="size-3 text-muted-foreground" />
                {isFree
                  ? `Plan Cycle: ${formattedPeriodStart ? `${formattedPeriodStart} – ` : ""}${formattedPeriodEnd || "30 Days"} (Resets Monthly)`
                  : `Cycle: ${formattedPeriodStart} – ${formattedPeriodEnd}`}
              </span>
              <span className="text-border">•</span>
              <span>
                {isFree
                  ? "75 inquiries reset every 30 days"
                  : "Auto-advances every 30 days"}
              </span>
            </div>
          </div>
        </div>

        {/* Free Plan Status or Pro Confirmation */}
        <div className="self-start md:self-auto">
          {isFree ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-mono rounded-none">
              <ShieldCheck className="size-3.5 shrink-0" />
              <span>Free plan quota resets every 30 days ({messageLimit} inquiries/mo)</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 border border-border text-foreground text-xs font-mono rounded-none">
              <ShieldCheck className="size-3.5 text-primary shrink-0" />
              <span>Entitlements provisioned & authorized</span>
            </div>
          )}
        </div>
      </div>

      {/* 3 Real-Time Quota Telemetry Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Meter 1: AI Messages */}
        <UsageMeter
          label="AI Inquiries / Cycle"
          used={messagesUsed}
          limit={messageLimit}
          unit="inquiries"
          footerText="Resets every 30 days"
        />

        {/* Meter 2: Knowledge Base Documents (NO pages mention!) */}
        <UsageMeter
          label="Knowledge Base Docs"
          used={documentsCount}
          limit={maxDocuments}
          unit="documents"
          footerText={`Up to ${planConfig.maxFileSizeMb}MB per file`}
        />

        {/* Meter 3: Authorized Storefront Domains */}
        <UsageMeter
          label="Storefront Domains"
          used={domainsCount}
          limit={maxDomains}
          unit="domains"
          footerText="Multi-domain authorization"
        />
      </div>
    </div>
  );
}

