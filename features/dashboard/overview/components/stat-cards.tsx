import Link from "next/link";
import {
  Clock,
  Users,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Bot,
  Code2,
} from "lucide-react";
import { SingleCardProps, StatProps } from "../types";

function StatCard({ item, icon: Icon }: SingleCardProps) {
  return (
    <div className="relative border border-border bg-card p-4 min-w-0 flex flex-col justify-between shadow-2xs">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-mono">
            {item.label}
          </span>
          <div className="size-7 border border-border/80 bg-background flex items-center justify-center shrink-0">
            <Icon className="size-3.5 text-primary" />
          </div>
        </div>

        <div className="mt-2 flex items-baseline gap-2 min-w-0">
          <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
            {item.value}
          </span>

          {item.delta && (
            <span
              className={`font-mono text-xs font-semibold shrink-0 px-1.5 py-0.5 border ${
                item.deltaType === "positive"
                  ? "border-success/30 bg-success/10 text-success"
                  : "border-destructive/30 bg-destructive/10 text-destructive"
              }`}
            >
              {item.delta} This week
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-border/50">
        {item.progress !== undefined && (
          <div className="mb-2 h-1 w-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }}
            />
          </div>
        )}
        {item.description ? (
          <p className="font-sans text-[11px] text-muted-foreground truncate">
            {item.description}
          </p>
        ) : (
          <p className="font-sans text-[11px] text-muted-foreground truncate">
            Live metric from workspace
          </p>
        )}
      </div>
    </div>
  );
}

export default function DashboardStatCards({ stats }: { stats: StatProps }) {
  const convCount =
    typeof stats.conversations.value === "number"
      ? stats.conversations.value
      : parseInt(String(stats.conversations.value).replace(/,/g, ""), 10) || 0;

  const visCount =
    typeof stats.visitors.value === "number"
      ? stats.visitors.value
      : parseInt(String(stats.visitors.value).replace(/,/g, ""), 10) || 0;

  const isZeroState = convCount === 0 && visCount === 0;

  const adjustedStats: StatProps = isZeroState
    ? {
        ...stats,
        conversations: {
          ...stats.conversations,
          description: "Awaiting first customer chat",
        },
        visitors: {
          ...stats.visitors,
          description: "No website visitors tracked yet",
        },
        resolutionRate: {
          ...stats.resolutionRate,
          description: "Calculated after first conversation",
        },
        avgResponse: {
          ...stats.avgResponse,
          description: "Measured from live AI queries",
        },
      }
    : stats;

  return (
    <div className="space-y-4 w-full min-w-0">
      {/* ── Section Header ── */}
      <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 bg-primary inline-block" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Live Workspace Telemetry
            </span>
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Overview & Performance
          </h1>
          <p className="font-sans text-xs text-muted-foreground mt-0.5">
            Realtime customer inquiry volume, autonomous AI resolution rate, and response latencies.
          </p>
        </div>

        {isZeroState ? (
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-sans text-muted-foreground bg-muted/40 border border-border px-2.5 py-1">
            <span className="size-1.5 bg-amber-500 rounded-none inline-block animate-pulse" />
            <span>Awaiting Website Traffic</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-sans text-muted-foreground bg-muted/40 border border-border px-2.5 py-1">
            <span className="size-1.5 bg-emerald-500 rounded-none inline-block animate-pulse" />
            <span>Live Sync Active</span>
          </div>
        )}
      </div>

      {/* ── 4 Stat Cards Grid ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">
        <StatCard item={adjustedStats.conversations} icon={MessageSquare} />
        <StatCard item={adjustedStats.visitors} icon={Users} />
        <StatCard item={adjustedStats.resolutionRate} icon={CheckCircle2} />
        <StatCard item={adjustedStats.avgResponse} icon={Clock} />
      </div>

      {/* ── Fallback Callout: Both Conversations & Visitors === 0 ── */}
      {isZeroState && (
        <div className="border border-border bg-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-none shadow-2xs">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="size-10 border border-primary/30 bg-primary/10 text-primary flex items-center justify-center shrink-0 rounded-none mt-0.5">
              <Code2 className="size-5 stroke-[1.75]" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading font-semibold  text-xs sm:text-sm text-foreground">
                   Connect your website widget
                </h3>
                <span className="text-[10px] font-sans uppercase tracking-wider px-1.5 py-0.5 border border-primary/30 bg-primary/10 text-primary font-medium">
                  Setup Required
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-sans leading-relaxed max-w-xl">
                You currently have 0 visitors and 0 conversations logged. Embed the Sanad widget snippet on your website to start streaming visitor sessions, customer inquiries, and AI response.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/dashboard/widget"
              className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-sans uppercase font-semibold tracking-wider inline-flex items-center gap-1.5 rounded-none transition-colors cursor-pointer"
            >
              <span>Get Embed Code</span>
              <ArrowRight className="size-3.5" />
            </Link>
            <Link
              href="/dashboard/playground"
              className="h-9 px-3.5 border border-border bg-background hover:bg-muted/50 text-foreground text-xs font-sans uppercase font-semibold tracking-wider inline-flex items-center gap-1.5 rounded-none transition-colors cursor-pointer"
            >
              <Bot className="size-3.5" />
              <span>Playground</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
