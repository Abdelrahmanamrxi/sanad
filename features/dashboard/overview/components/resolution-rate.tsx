"use client";

import { MapPin, ArrowUpRight, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { type ConvertedLead, type ConversionFunnelType } from "../types";

export default function ResolutionRate({
  convertedLeads,
  conversionFunnel,
}: {
  convertedLeads: ConvertedLead[];
  conversionFunnel: ConversionFunnelType;
}) {
  const { t } = useTranslation();

  const totalVisitors = conversionFunnel.totalVisitors;
  const engagedPct =
    totalVisitors > 0
      ? ((conversionFunnel.engagedVisitors / totalVisitors) * 100).toFixed(1)
      : "0.0";
  const leadPct =
    totalVisitors > 0
      ? ((conversionFunnel.capturedLeads / totalVisitors) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="border border-border bg-card p-5 rounded-none">
      {/* Header: Title + KPIs */}
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {t("dashboard.overview.conversion.title")}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("dashboard.overview.conversion.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 border border-success/30 bg-success/10 px-2.5 py-1 rounded-none">
            <ArrowUpRight className="size-3.5 text-success rtl:rotate-90" />
            <span className="font-mono text-xs font-bold text-success">
              {conversionFunnel.overallRate}
            </span>
            {conversionFunnel.rateDelta && (
              <span className="font-mono text-[10px] text-success/80">
                {conversionFunnel.rateDelta}
              </span>
            )}
          </div>
          <div className="border border-border bg-background px-2.5 py-1 text-xs rounded-none">
            <span className="text-muted-foreground me-1 text-[11px]">
              {t("dashboard.overview.conversion.chatToLead")}
            </span>
            <span className="font-mono font-semibold text-foreground">
              {conversionFunnel.chatToLeadRate}
            </span>
          </div>
          {conversionFunnel.avgTimeToConvert && (
            <div className="border border-border bg-background px-2.5 py-1 text-xs rounded-none">
              <span className="text-muted-foreground me-1 text-[11px]">
                {t("dashboard.overview.conversion.avgTime")}
              </span>
              <span className="font-mono font-semibold text-foreground">
                {conversionFunnel.avgTimeToConvert}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Funnel Pipeline Visualizer */}
      <div className="mt-4 border border-border bg-background p-4 rounded-none">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">
            {t("dashboard.overview.conversion.funnelTitle")}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {t("dashboard.overview.conversion.funnelLeadsCaptured", {
              count: conversionFunnel.capturedLeads,
            })}
          </span>
        </div>

        {/* Tiered Visual Funnel Track */}
        <div className="mt-3 relative h-3.5 w-full border border-border/80 bg-muted overflow-hidden rounded-none">
          {/* Stage 1: Total Visitors (Base 100%) */}
          <div
            className="absolute inset-0 bg-primary/20"
            title={`${t("dashboard.overview.conversion.stage1Title")}: ${totalVisitors}`}
          />

          {/* Stage 2: Engaged in Chat */}
          <div
            className="absolute inset-y-0 start-0 bg-primary border-e border-border/70 transition-all duration-300"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  totalVisitors > 0 && conversionFunnel.engagedVisitors > 0
                    ? 3
                    : 0,
                  Number(engagedPct)
                )
              )}%`,
            }}
            title={`${t("dashboard.overview.conversion.stage2Title")}: ${conversionFunnel.engagedVisitors} (${engagedPct}%)`}
          />

          {/* Stage 3: Captured Leads */}
          <div
            className="absolute inset-y-0 start-0 bg-success border-e border-border/70 transition-all duration-300"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  conversionFunnel.capturedLeads > 0 ? 3 : 0,
                  Number(leadPct)
                )
              )}%`,
            }}
            title={`${t("dashboard.overview.conversion.stage3Title")}: ${conversionFunnel.capturedLeads} (${leadPct}%)`}
          />
        </div>

        {/* Funnel Track Legend */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 bg-primary/25 border border-primary/40 rounded-none" />
              {t("dashboard.overview.conversion.stage1Track")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 bg-primary rounded-none" />
              {t("dashboard.overview.conversion.stage2Track", { pct: engagedPct })}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 bg-success rounded-none" />
              {t("dashboard.overview.conversion.stage3Track", { pct: leadPct })}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {t("dashboard.overview.conversion.pipelineYield", {
              rate: conversionFunnel.overallRate,
            })}
          </span>
        </div>

        {/* 3 Funnel Stages Grid */}
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border/60 pt-3 sm:grid-cols-3">
          <div className="border border-border/60 bg-card p-3 rounded-none">
            <span className="block text-[10px] text-muted-foreground uppercase font-mono">
              {t("dashboard.overview.conversion.stage1Title")}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-foreground">
                {conversionFunnel.totalVisitors}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                100%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {t("dashboard.overview.conversion.stage1Desc")}
            </p>
          </div>

          <div className="border border-border/60 bg-card p-3 rounded-none">
            <span className="block text-[10px] text-muted-foreground uppercase font-mono">
              {t("dashboard.overview.conversion.stage2Title")}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-primary">
                {conversionFunnel.engagedVisitors}
              </span>
              <span className="font-mono text-xs text-primary font-semibold">
                {engagedPct}%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {t("dashboard.overview.conversion.stage2Desc")}
            </p>
          </div>

          <div className="border border-border/60 bg-card p-3 rounded-none">
            <span className="block text-[10px] text-muted-foreground uppercase font-mono">
              {t("dashboard.overview.conversion.stage3Title")}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-xl font-bold text-success">
                {conversionFunnel.capturedLeads}
              </span>
              <span className="font-mono text-xs text-success font-semibold">
                {conversionFunnel.overallRate}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {t("dashboard.overview.conversion.stage3Desc")}
            </p>
          </div>
        </div>
      </div>

      {/* Full-width Converted Leads Table */}
      <div className="mt-5">
        <div className="flex items-center justify-between border-b border-border pb-2 text-xs">
          <span className="font-semibold text-foreground">
            {t("dashboard.overview.conversion.recentLeads", {
              count: conversionFunnel.capturedLeads,
            })}
          </span>
          <Link
            href="/dashboard/conversations"
            className="flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
          >
            <span>{t("dashboard.overview.conversion.viewConversations")}</span>
            <ArrowRight className="size-3 rtl:rotate-180" />
          </Link>
        </div>

        {convertedLeads.length === 0 ? (
          <div className="py-8 text-center border border-border/40 bg-muted/20 my-2 rounded-none">
            <UserCheck className="size-6 text-muted-foreground/50 mx-auto mb-2" />
            <p className="font-mono text-xs text-muted-foreground">
              {t("dashboard.overview.conversion.noLeads")}
            </p>
            <p className="font-sans text-[11px] text-muted-foreground/80 mt-0.5">
              {t("dashboard.overview.conversion.noLeadsDesc")}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {convertedLeads.map((lead) => {
              const initials =
                (lead.name || "Lead")
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase() || "LD";

              const translatedStatus = t(
                `dashboard.overview.conversion.status.${lead.status}`,
                { defaultValue: lead.status }
              );

              const translatedIntent = t(
                `dashboard.overview.conversion.intent.${lead.intent}`,
                { defaultValue: lead.intentLabel }
              );

              return (
                <div
                  key={lead.id}
                  className="flex flex-col gap-2 py-3 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between px-1"
                >
                  {/* Lead Profile */}
                  <div className="flex items-center gap-3 min-w-0 sm:w-1/3">
                    <div className="flex size-8 shrink-0 items-center justify-center border border-border bg-muted text-xs font-semibold text-foreground font-mono rounded-none">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {lead.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground" dir="ltr">
                        <span>{lead.email}</span>
                        {lead.phone && lead.phone !== "—" && (
                          <>
                            <span className="text-border">|</span>
                            <span>{lead.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Intent Topic & Details */}
                  <div className="min-w-0 sm:w-1/3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`border px-1.5 py-px text-[9px] font-mono uppercase rounded-none ${
                          lead.intent === "high"
                            ? "border-highlight/40 bg-highlight/10 text-highlight"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {translatedIntent}
                      </span>
                      {lead.location && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                          <MapPin className="size-3" />
                          {lead.location}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {lead.topic}
                    </p>
                  </div>

                  {/* Status & Time */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 sm:w-1/4">
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {lead.chats}{" "}
                      {lead.chats === 1
                        ? t("dashboard.overview.conversion.chat")
                        : t("dashboard.overview.conversion.chats")}
                    </span>
                    <span
                      className={`border px-2 py-0.5 text-[10px] font-medium uppercase font-mono rounded-none ${
                        lead.status === "New Lead"
                          ? "border-success/30 bg-success/10 text-success"
                          : lead.status === "Qualified"
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {translatedStatus}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground w-16 text-end">
                      {lead.convertedAt}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
