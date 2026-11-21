"use client";

import React from "react";
import { ShieldCheck, Calendar, Zap } from "lucide-react";
import { UsageMeter } from "./usage-meter";
import type { BillingViewData } from "../types";
import { useTranslation } from "react-i18next";

interface CurrentPlanBannerProps {
  data: BillingViewData;
}

export function CurrentPlanBanner({ data }: CurrentPlanBannerProps) {
  const { t, i18n } = useTranslation();
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

  const isFree = planTier === "free";

  const localeCode = i18n.language === "ar" ? "ar-EG" : "en-US";

  const formattedPeriodEnd = periodEnd
    ? new Date(periodEnd).toLocaleDateString(localeCode, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedPeriodStart = periodStart
    ? new Date(periodStart).toLocaleDateString(localeCode, {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div className="relative bg-card border border-border p-5 sm:p-6 shadow-xl space-y-5 rounded-none">
      {/* Architectural Corner Crosshairs */}
      <span className="pointer-events-none absolute -top-2 -start-2 font-mono text-xs text-primary font-bold select-none">+</span>
      <span className="pointer-events-none absolute -top-2 -end-2 font-mono text-xs text-primary font-bold select-none">+</span>
      <span className="pointer-events-none absolute -bottom-2 -start-2 font-mono text-xs text-primary font-bold select-none">+</span>
      <span className="pointer-events-none absolute -bottom-2 -end-2 font-mono text-xs text-primary font-bold select-none">+</span>

      {/* Top Identity Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="size-11 bg-primary/10 border border-primary/40 flex items-center justify-center shrink-0 text-primary rounded-none">
            <Zap className="size-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-heading text-lg font-bold text-foreground font-sans">
                {planTier.toUpperCase()} {t("dashboard.billing.consumption.planSuffix", "PLAN")}
              </span>
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-primary/15 border border-primary/30 text-primary rounded-none">
                {planTier.toUpperCase()}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-none">
                <span className="size-1.5 bg-emerald-500 rounded-none animate-pulse" />
                {t("dashboard.billing.consumption.active", "ACTIVE")}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground font-sans">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="size-3 text-muted-foreground" />
                {isFree
                  ? t("dashboard.billing.consumption.cycleFree", {
                      start: formattedPeriodStart ? `${formattedPeriodStart} – ` : "",
                      end: formattedPeriodEnd || t("dashboard.billing.consumption.cycleThirtyDays", "30 Days"),
                      defaultValue: `Plan Cycle: ${formattedPeriodStart ? `${formattedPeriodStart} – ` : ""}${formattedPeriodEnd || "30 Days"} (Resets Monthly)`,
                    })
                  : t("dashboard.billing.consumption.cyclePaid", {
                      start: formattedPeriodStart,
                      end: formattedPeriodEnd,
                      defaultValue: `Cycle: ${formattedPeriodStart} – ${formattedPeriodEnd}`,
                    })}
              </span>
              <span className="text-border">•</span>
              <span>
                {isFree
                  ? t("dashboard.billing.consumption.inquiriesResetNote", "75 inquiries reset every 30 days")
                  : t("dashboard.billing.consumption.autoAdvanceNote", "Auto-advances every 30 days")}
              </span>
            </div>
          </div>
        </div>

        {/* Free Plan Status or Pro Confirmation */}
        <div className="self-start md:self-auto">
          {isFree ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-mono rounded-none">
              <ShieldCheck className="size-3.5 shrink-0" />
              <span>
                {t("dashboard.billing.consumption.freeQuotaNotice", {
                  limit: messageLimit,
                  defaultValue: `Free plan quota resets every 30 days (${messageLimit} inquiries/mo)`,
                })}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 border border-border text-foreground text-xs font-mono rounded-none">
              <ShieldCheck className="size-3.5 text-primary shrink-0" />
              <span>
                {t("dashboard.billing.consumption.proQuotaNotice", "Entitlements provisioned & authorized")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3 Real-Time Quota Telemetry Meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Meter 1: AI Messages */}
        <UsageMeter
          label={t("dashboard.billing.consumption.meters.inquiriesLabel", "AI Inquiries / Cycle")}
          used={messagesUsed}
          limit={messageLimit}
          unit={t("dashboard.billing.consumption.meters.inquiriesUnit", "inquiries")}
          footerText={t("dashboard.billing.consumption.meters.inquiriesFooter", "Resets every 30 days")}
        />

        {/* Meter 2: Knowledge Base Files (Using ملفات / files!) */}
        <UsageMeter
          label={t("dashboard.billing.consumption.meters.filesLabel", "Knowledge Base Files")}
          used={documentsCount}
          limit={maxDocuments}
          unit={t("dashboard.billing.consumption.meters.filesUnit", "files")}
          footerText={t("dashboard.billing.consumption.meters.filesFooter", {
            size: planConfig.maxFileSizeMb,
            defaultValue: `Up to ${planConfig.maxFileSizeMb}MB per file`,
          })}
        />

        {/* Meter 3: Authorized Storefront Domains */}
        <UsageMeter
          label={t("dashboard.billing.consumption.meters.domainsLabel", "Storefront Domains")}
          used={domainsCount}
          limit={maxDomains}
          unit={t("dashboard.billing.consumption.meters.domainsUnit", "domains")}
          footerText={t("dashboard.billing.consumption.meters.domainsFooter", "Multi-domain authorization")}
        />
      </div>
    </div>
  );
}
