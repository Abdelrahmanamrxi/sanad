import React from "react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-full min-w-0 animate-pulse">
      {/* ── Section Header Skeleton ── */}
      <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="size-2 bg-primary/40 inline-block" />
            <div className="h-3 w-36 bg-muted/70" />
          </div>
          <div className="h-7 w-56 bg-muted" />
          <div className="h-3.5 w-80 max-w-full bg-muted/50" />
        </div>
        <div className="h-7 w-32 bg-muted/50 border border-border" />
      </div>

      {/* ── 1. 4 Stat Cards Skeleton Grid ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border border-border bg-card p-4 min-w-0 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-muted/70" />
              <div className="size-7 bg-muted/40 border border-border/80" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="h-7 w-20 bg-muted" />
              <div className="h-4 w-12 bg-muted/50" />
            </div>
            <div className="pt-2 border-t border-border/40 space-y-1.5">
              <div className="h-1 w-full bg-muted/60" />
              <div className="h-2.5 w-36 bg-muted/40" />
            </div>
          </div>
        ))}
      </div>

      {/* ── 2. Daily Traffic Chart Skeleton ── */}
      <div className="border border-border bg-card p-5 min-h-[300px] flex flex-col justify-between shadow-2xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="space-y-1.5">
            <div className="h-4 w-32 bg-muted" />
            <div className="h-3 w-56 bg-muted/60" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-20 bg-muted/50" />
            <div className="h-3 w-20 bg-muted/50" />
          </div>
        </div>

        <div className="h-44 bg-muted/30 my-4" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60">
          <div className="h-11 bg-muted/20 border border-border/40" />
          <div className="h-11 bg-muted/20 border border-border/40" />
          <div className="h-11 bg-muted/20 border border-border/40" />
          <div className="h-11 bg-muted/20 border border-border/40" />
        </div>
      </div>

      {/* ── 3. Visitor to Lead Conversion Skeleton ── */}
      <div className="border border-border bg-card p-5 min-h-[300px] space-y-4 shadow-2xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="space-y-1.5">
            <div className="h-4 w-44 bg-muted" />
            <div className="h-3 w-64 bg-muted/60" />
          </div>
          <div className="h-6 w-24 bg-muted/40" />
        </div>

        <div className="h-3.5 w-full bg-muted/40 border border-border/60" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="h-20 bg-muted/30 border border-border/40" />
          <div className="h-20 bg-muted/30 border border-border/40" />
          <div className="h-20 bg-muted/30 border border-border/40" />
        </div>

        <div className="space-y-2 pt-2 border-t border-border/60">
          <div className="h-10 bg-muted/20 border border-border/30" />
          <div className="h-10 bg-muted/20 border border-border/30" />
        </div>
      </div>

      {/* ── 4. Recent Conversations Skeleton ── */}
      <div className="border border-border bg-card p-5 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="space-y-1.5">
            <div className="h-4 w-36 bg-muted" />
            <div className="h-3 w-52 bg-muted/60" />
          </div>
          <div className="h-4 w-16 bg-muted/40" />
        </div>

        <div className="divide-y divide-border/60">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-3 flex items-center justify-between">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-24 bg-muted/70" />
                  <div className="h-3 w-12 bg-muted/40" />
                  <div className="h-3 w-16 bg-muted/40" />
                </div>
                <div className="h-3 w-72 max-w-full bg-muted/50" />
              </div>
              <div className="h-5 w-20 bg-muted/40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

