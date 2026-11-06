import { MapPin, ArrowUpRight, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import { type ConvertedLead, type ConversionFunnelType } from "../types";

export default function ResolutionRate({
  convertedLeads,
  conversionFunnel,
}: {
  convertedLeads: ConvertedLead[];
  conversionFunnel: ConversionFunnelType;
}) {
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
    <div className="border border-border bg-card p-5">
      {/* Header: Title + KPIs */}
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Visitor → Lead Conversion
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Complete pipeline tracking anonymous widget visitors turned into identified, high-intent leads
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 border border-success/30 bg-success/10 px-2.5 py-1">
            <ArrowUpRight className="size-3.5 text-success" />
            <span className="font-mono text-xs font-bold text-success">
              {conversionFunnel.overallRate}
            </span>
            {conversionFunnel.rateDelta && (
              <span className="font-mono text-[10px] text-success/80">
                {conversionFunnel.rateDelta}
              </span>
            )}
          </div>
          <div className="border border-border bg-background px-2.5 py-1 text-xs">
            <span className="text-muted-foreground me-1 text-[11px]">
              Chat-to-Lead:
            </span>
            <span className="font-mono font-semibold text-foreground">
              {conversionFunnel.chatToLeadRate}
            </span>
          </div>
          {conversionFunnel.avgTimeToConvert && (
            <div className="border border-border bg-background px-2.5 py-1 text-xs">
              <span className="text-muted-foreground me-1 text-[11px]">
                Avg Time:
              </span>
              <span className="font-mono font-semibold text-foreground">
                {conversionFunnel.avgTimeToConvert}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Funnel Pipeline Visualizer */}
      <div className="mt-4 border border-border bg-background p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-foreground">
            Acquisition Funnel
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {conversionFunnel.capturedLeads} qualified leads captured
          </span>
        </div>

        {/* Tiered Visual Funnel Track (Layered & guaranteed zero overflow) */}
        <div className="mt-3 relative h-3.5 w-full border border-border/80 bg-muted overflow-hidden">
          {/* Stage 1: Total Visitors (Base 100%) */}
          <div
            className="absolute inset-0 bg-primary/20"
            title={`Total Visitors: ${totalVisitors}`}
          />

          {/* Stage 2: Engaged in Chat (Subset of Total) */}
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
            title={`Engaged in Chat: ${conversionFunnel.engagedVisitors} (${engagedPct}%)`}
          />

          {/* Stage 3: Captured Leads (Subset of Engaged) */}
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
            title={`Captured Leads: ${conversionFunnel.capturedLeads} (${leadPct}%)`}
          />
        </div>

        {/* Funnel Track Legend (Clarifies the 3 overlapping tiers) */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 bg-primary/25 border border-primary/40" />
              1. Total Visitors (100%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 bg-primary" />
              2. Engaged ({engagedPct}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-2 bg-success" />
              3. Leads ({leadPct}%)
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            Pipeline Yield: {conversionFunnel.overallRate}
          </span>
        </div>

        {/* 3 Funnel Stages Grid */}
        <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border/60 pt-3 sm:grid-cols-3">
          <div className="border border-border/60 bg-card p-3">
            <span className="block text-[10px] text-muted-foreground uppercase font-mono">
              1. Total Visitors
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
              All unique visitors who loaded the site & widget
            </p>
          </div>

          <div className="border border-border/60 bg-card p-3">
            <span className="block text-[10px] text-muted-foreground uppercase font-mono">
              2. Engaged in Chat
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
              Visitors who initiated at least one conversation
            </p>
          </div>

          <div className="border border-border/60 bg-card p-3">
            <span className="block text-[10px] text-muted-foreground uppercase font-mono">
              3. Captured Leads
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
              Provided contact information during interaction
            </p>
          </div>
        </div>
      </div>

      {/* Full-width Converted Leads Table */}
      <div className="mt-5">
        <div className="flex items-center justify-between border-b border-border pb-2 text-xs">
          <span className="font-semibold text-foreground">
            Recent Converted Leads ({conversionFunnel.capturedLeads} total)
          </span>
          <Link
            href="/dashboard/conversations"
            className="flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
          >
            <span>View in conversations</span>
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {convertedLeads.length === 0 ? (
          <div className="py-8 text-center border border-border/40 bg-muted/20 my-2">
            <UserCheck className="size-6 text-muted-foreground/50 mx-auto mb-2" />
            <p className="font-mono text-xs text-muted-foreground">
              No leads captured yet.
            </p>
            <p className="font-sans text-[11px] text-muted-foreground/80 mt-0.5">
              Identified leads and phone/email submissions will automatically appear here.
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

              return (
                <div
                  key={lead.id}
                  className="flex flex-col gap-2 py-3 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between px-1"
                >
                  {/* Lead Profile */}
                  <div className="flex items-center gap-3 min-w-0 sm:w-1/3">
                    <div className="flex size-8 shrink-0 items-center justify-center border border-border bg-muted text-xs font-semibold text-foreground font-mono">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">
                        {lead.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
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
                        className={`border px-1.5 py-px text-[9px] font-mono uppercase ${
                          lead.intent === "high"
                            ? "border-highlight/40 bg-highlight/10 text-highlight"
                            : "border-border bg-muted text-muted-foreground"
                        }`}
                      >
                        {lead.intentLabel}
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
                      {lead.chats} {lead.chats === 1 ? "chat" : "chats"}
                    </span>
                    <span
                      className={`border px-2 py-0.5 text-[10px] font-medium uppercase font-mono ${
                        lead.status === "New Lead"
                          ? "border-success/30 bg-success/10 text-success"
                          : lead.status === "Qualified"
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {lead.status}
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
