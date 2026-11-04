import React from "react";

export default function BillingLoading() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 animate-pulse">
      {/* ── Page Header Skeleton ── */}
      <div className="border-b border-border pb-5 space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="size-2 bg-primary/40 rounded-none inline-block" />
          <div className="h-3.5 w-44 bg-muted/70 rounded-none" />
        </div>
        <div className="h-8 w-80 bg-muted rounded-none" />
        <div className="h-4 w-96 max-w-full bg-muted/60 rounded-none" />
      </div>

      {/* ── Current Plan & Real-Time Telemetry Meters Skeleton ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-40 bg-muted/60 rounded-none" />
          <div className="h-3 w-32 bg-muted/50 rounded-none" />
        </div>

        {/* Tactical Banner Skeleton */}
        <div className="relative bg-card border border-border p-5 sm:p-6 shadow-xl space-y-6 rounded-none">
          {/* Corner Crosshairs */}
          <span className="pointer-events-none absolute -top-2 -left-2 font-mono text-xs text-primary/40 font-bold select-none">+</span>
          <span className="pointer-events-none absolute -top-2 -right-2 font-mono text-xs text-primary/40 font-bold select-none">+</span>
          <span className="pointer-events-none absolute -bottom-2 -left-2 font-mono text-xs text-primary/40 font-bold select-none">+</span>
          <span className="pointer-events-none absolute -bottom-2 -right-2 font-mono text-xs text-primary/40 font-bold select-none">+</span>

          {/* Top Banner Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
            <div className="flex items-center gap-3">
              <div className="size-11 bg-muted/70 border border-border rounded-none shrink-0" />
              <div className="space-y-1.5">
                <div className="h-5 w-36 bg-muted rounded-none" />
                <div className="h-3 w-48 bg-muted/60 rounded-none" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-7 w-28 bg-muted/50 rounded-none border border-border" />
              <div className="h-7 w-32 bg-muted/50 rounded-none border border-border" />
            </div>
          </div>

          {/* 3 Quota Meters Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-border/70 bg-background/50 p-4 space-y-3 rounded-none"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3.5 w-28 bg-muted/70 rounded-none" />
                  <div className="h-3.5 w-12 bg-muted/60 rounded-none" />
                </div>
                {/* Segmented LED Bar Skeleton */}
                <div className="grid grid-cols-10 gap-1 h-3">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-full ${idx < 4 ? "bg-primary/30" : "bg-muted/40"} rounded-none`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="h-2.5 w-20 bg-muted/50 rounded-none" />
                  <div className="h-2.5 w-16 bg-muted/50 rounded-none" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Available Subscription Plans Grid Skeleton ── */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="h-3 w-44 bg-muted/60 rounded-none" />
          <div className="h-3 w-56 bg-muted/50 rounded-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* Starter Card Skeleton */}
          <div className="border border-border bg-card p-6 space-y-6 rounded-none flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-28 bg-muted rounded-none" />
                <div className="h-4 w-16 bg-muted/60 rounded-none" />
              </div>
              <div className="h-9 w-40 bg-muted/80 rounded-none" />
              <div className="h-3.5 w-full bg-muted/50 rounded-none" />
              <div className="border-t border-border/60 pt-4 space-y-2.5">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="size-3.5 bg-muted/60 rounded-none shrink-0" />
                    <div className="h-3 w-3/4 bg-muted/50 rounded-none" />
                  </div>
                ))}
              </div>
            </div>
            <div className="h-10 w-full bg-muted/70 rounded-none border border-border" />
          </div>

          {/* Flagship Pro Card Skeleton */}
          <div className="border-2 border-primary/40 bg-card p-6 space-y-6 rounded-none flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-32 bg-primary/20 rounded-none" />
                <div className="h-4 w-20 bg-amber-500/20 rounded-none" />
              </div>
              <div className="h-9 w-44 bg-muted/80 rounded-none" />
              <div className="h-3.5 w-full bg-muted/50 rounded-none" />
              <div className="border-t border-border/60 pt-4 space-y-2.5">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="size-3.5 bg-primary/40 rounded-none shrink-0" />
                    <div className="h-3 w-4/5 bg-muted/50 rounded-none" />
                  </div>
                ))}
              </div>
            </div>
            <div className="h-10 w-full bg-primary/30 rounded-none" />
          </div>
        </div>
      </section>

      {/* ── Invoices / Ledger Table Skeleton ── */}
      <section className="space-y-3 pt-2">
        <div className="h-3 w-36 bg-muted/60 rounded-none" />
        <div className="border border-border bg-card p-4 space-y-3 rounded-none">
          <div className="h-4 w-full bg-muted/60 rounded-none" />
          <div className="h-8 w-full bg-muted/30 rounded-none" />
          <div className="h-8 w-full bg-muted/30 rounded-none" />
        </div>
      </section>
    </div>
  );
}

