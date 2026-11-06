import {
  Clock,
  Users,
  CheckCircle2,
  MessageSquare,
  Sparkles,
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
              {item.delta}
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

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono text-muted-foreground bg-muted/40 border border-border px-2.5 py-1">
          <span className="size-1.5 bg-emerald-500 rounded-none inline-block animate-pulse" />
          <span>Live Sync Active</span>
        </div>
      </div>

      {/* ── 4 Stat Cards Grid ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">
        <StatCard item={stats.conversations} icon={MessageSquare} />
        <StatCard item={stats.visitors} icon={Users} />
        <StatCard item={stats.resolutionRate} icon={CheckCircle2} />
        <StatCard item={stats.avgResponse} icon={Clock} />
      </div>
    </div>
  );
}
