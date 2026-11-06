import React from "react";

export default function WidgetLoading() {
  return (
    <div className="relative flex min-h-0 lg:min-h-[820px] h-[calc(100vh-6.5rem)] flex-col border border-border bg-card shadow-xs overflow-hidden animate-pulse rounded-none">
      {/* Corner crosshairs for architectural craft */}
      <span className="pointer-events-none absolute -bottom-1 -left-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -bottom-1 -right-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -top-1 -right-1 font-mono text-[10px] text-border select-none">+</span>

      {/* ── Studio Header Bar Skeleton ── */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
        {/* Title & Status */}
        <div className="flex items-center gap-3">
          <div className="size-8 border border-border bg-muted/40 rounded-none" />
          <div className="space-y-1">
            <div className="h-4 w-28 bg-muted rounded-none" />
            <div className="h-2.5 w-44 bg-muted/60 rounded-none hidden sm:block" />
          </div>
        </div>

        {/* Tab Controls Skeleton */}
        <div className="hidden md:flex items-center gap-1 border border-border bg-muted/20 p-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-7 w-20 bg-muted/50 rounded-none" />
          ))}
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 bg-muted/60 border border-border rounded-none hidden sm:block" />
          <div className="h-8 w-28 bg-muted rounded-none" />
        </div>
      </div>

      {/* ── Split-Pane Studio Content Skeleton ── */}
      <div className="flex flex-1 min-h-0 flex-col lg:flex-row overflow-hidden">
        {/* Left: Configuration Form Panel Skeleton (45%) */}
        <div className="w-full lg:w-[45%] xl:w-[40%] border-b lg:border-b-0 lg:border-e border-border bg-card flex flex-col p-5 space-y-6 overflow-y-auto">
          {/* Section 1 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <div className="h-3.5 w-32 bg-muted rounded-none" />
              <div className="h-3 w-16 bg-muted/50 rounded-none" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-20 bg-muted/70 rounded-none" />
              <div className="h-9 w-full bg-muted/30 border border-border rounded-none" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-28 bg-muted/70 rounded-none" />
              <div className="h-16 w-full bg-muted/20 border border-border rounded-none" />
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="h-3.5 w-36 bg-muted rounded-none" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-14 bg-muted/30 border border-border rounded-none" />
              <div className="h-14 bg-muted/30 border border-border rounded-none" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 w-24 bg-muted/70 rounded-none" />
              <div className="h-9 w-full bg-muted/30 border border-border rounded-none" />
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <div className="h-3.5 w-40 bg-muted rounded-none" />
            <div className="h-20 bg-muted/20 border border-border rounded-none" />
          </div>
        </div>

        {/* Right: Interactive Live Preview Panel Skeleton (55%) */}
        <div className="flex-1 bg-muted/15 flex flex-col p-5 sm:p-8 items-center justify-center min-h-[400px]">
          {/* Mock Browser Window Skeleton */}
          <div className="w-full max-w-2xl border border-border bg-background shadow-md flex flex-col h-[520px] rounded-none">
            {/* Browser top chrome */}
            <div className="flex h-9 items-center justify-between border-b border-border px-3 bg-muted/30">
              <div className="flex items-center gap-1.5">
                <span className="size-2 bg-muted/70 rounded-none" />
                <span className="size-2 bg-muted/70 rounded-none" />
                <span className="size-2 bg-muted/70 rounded-none" />
              </div>
              <div className="h-4 w-48 bg-muted/50 rounded-none" />
              <div className="size-3 bg-muted/40 rounded-none" />
            </div>

            {/* Store mockup body with floating widget launcher */}
            <div className="relative flex-1 p-6 flex flex-col justify-between bg-muted/5">
              <div className="space-y-3 max-w-md">
                <div className="h-5 w-40 bg-muted/60 rounded-none" />
                <div className="h-3 w-full bg-muted/40 rounded-none" />
                <div className="h-3 w-3/4 bg-muted/30 rounded-none" />
              </div>

              {/* Chat bubble launcher skeleton */}
              <div className="self-end flex items-center gap-2">
                <div className="h-8 w-32 bg-muted/50 border border-border rounded-none hidden sm:block" />
                <div className="size-12 bg-primary/40 border border-border rounded-none shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

