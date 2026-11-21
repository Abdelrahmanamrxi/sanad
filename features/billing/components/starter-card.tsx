"use client";

import React from "react";
import { Check, ArrowRight, Building2 } from "lucide-react";
import type { PlanConfig, PlanTier } from "../plans";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const isStarter = currentTier === "starter";

  return (
    <div className="relative bg-card border border-border p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors rounded-none">
      {/* Corner Crosshairs */}
      <span className="pointer-events-none absolute -top-1.5 -start-1.5 font-mono text-xs text-border font-bold select-none">+</span>
      <span className="pointer-events-none absolute -top-1.5 -end-1.5 font-mono text-xs text-border font-bold select-none">+</span>
      <span className="pointer-events-none absolute -bottom-1.5 -start-1.5 font-mono text-xs text-border font-bold select-none">+</span>
      <span className="pointer-events-none absolute -bottom-1.5 -end-1.5 font-mono text-xs text-border font-bold select-none">+</span>

      <div className="space-y-4">
        {/* Tier Label */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-0.5 bg-muted/60 border border-border rounded-none">
            {t("dashboard.billing.plans.starter.tier", "Starter Tier")}
          </span>
          <span className="font-mono text-xs text-muted-foreground flex items-center gap-1">
            <Building2 className="size-3 text-primary" />
            {t("dashboard.billing.plans.starter.audience", "Solo Practices")}
          </span>
        </div>

        {/* Plan Title & Price */}
        <div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground font-sans">
            {t("dashboard.billing.plans.starter.title", {
              name: starterConfig.name,
              defaultValue: `${starterConfig.name} Plan`,
            })}
          </h3>
          <div className="flex items-baseline gap-1.5 font-mono mt-1">
            <span className="text-3xl font-extrabold text-foreground">
              {t("dashboard.billing.plans.starter.price", "490")}
            </span>
            <span className="text-xs font-semibold text-foreground">
              {t("dashboard.billing.plans.currency", "EGP")}
            </span>
            <span className="text-xs text-muted-foreground font-sans">
              {t("dashboard.billing.plans.perMonth", "/ month")}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-sans mt-2 leading-relaxed">
            {t(
              "dashboard.billing.plans.starter.desc",
              "Essential capacity for solo clinics, single boutique stores, and individual consultants."
            )}
          </p>
        </div>

        {/* Feature List (Using source files / ملفات مصدرية!) */}
        <div className="border-t border-border/80 pt-4 space-y-2.5 text-xs font-sans">
          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span
              className="text-foreground"
              dangerouslySetInnerHTML={{
                __html: t("dashboard.billing.plans.starter.inquiries", {
                  count: starterConfig.messages.toLocaleString(),
                  defaultValue: `<strong>${starterConfig.messages.toLocaleString()}</strong> customer inquiries / mo`,
                }),
              }}
            />
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span
              className="text-foreground"
              dangerouslySetInnerHTML={{
                __html: t("dashboard.billing.plans.starter.files", {
                  count: starterConfig.maxDocuments,
                  size: starterConfig.maxFileSizeMb,
                  defaultValue: `<strong>${starterConfig.maxDocuments} source files</strong> (${starterConfig.maxFileSizeMb}MB/file)`,
                }),
              }}
            />
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span
              className="text-foreground"
              dangerouslySetInnerHTML={{
                __html: t("dashboard.billing.plans.starter.domains", {
                  count: starterConfig.maxDomains,
                  defaultValue: `Up to <strong>${starterConfig.maxDomains} authorized store domains</strong>`,
                }),
              }}
            />
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span
              className="text-foreground"
              dangerouslySetInnerHTML={{
                __html: t(
                  "dashboard.billing.plans.starter.branding",
                  "<strong>Custom assistant name</strong> & identity"
                ),
              }}
            />
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-foreground">
              {t(
                "dashboard.billing.plans.starter.analytics",
                "Standard conversation analytics & logs"
              )}
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
            <span className="text-foreground">
              {t(
                "dashboard.billing.plans.starter.styling",
                "All container silhouettes & styling included"
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-6">
        {isStarter ? (
          <div className="w-full py-2.5 text-xs font-mono font-bold bg-muted/60 border border-border text-foreground text-center rounded-none">
            {t("dashboard.billing.plans.currentPlan", "Current Active Plan")}
          </div>
        ) : (
          <button
            type="button"
            onClick={onSelect}
            className="w-full py-2.5 text-xs font-mono font-bold border border-border bg-background hover:bg-muted/60 text-foreground transition-colors cursor-pointer flex items-center justify-center gap-1.5 rounded-none"
          >
            <span>
              {currentTier === "pro"
                ? t("dashboard.billing.plans.starter.switchBtn", "Switch to Starter")
                : t("dashboard.billing.plans.starter.selectBtn", "Select Starter Plan (490 EGP/mo)")}
            </span>
            <ArrowRight className="size-3.5 rtl:rotate-180" />
          </button>
        )}
      </div>
    </div>
  );
}
