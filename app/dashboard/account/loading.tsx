import React from "react";

export default function AccountLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-pulse">
      {/* ── Page Header Skeleton ── */}
      <div className="border-b border-border pb-5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="size-2 bg-primary/40 rounded-none inline-block" />
          <div className="h-3 w-40 bg-muted/70 rounded-none" />
        </div>
        <div className="h-8 w-64 bg-muted rounded-none" />
        <div className="h-4 w-96 max-w-full bg-muted/60 rounded-none" />
      </div>

      {/* ── 1. Plan & Subscription Card Skeleton ── */}
      <section className="relative bg-card border border-border p-5 sm:p-6 shadow-2xs space-y-4 rounded-none">
        {/* Tactical Crosshairs */}
        <span className="pointer-events-none absolute -top-1.5 -left-1.5 font-mono text-xs text-primary/40 font-bold select-none">+</span>
        <span className="pointer-events-none absolute -top-1.5 -right-1.5 font-mono text-xs text-primary/40 font-bold select-none">+</span>
        <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 font-mono text-xs text-primary/40 font-bold select-none">+</span>
        <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 font-mono text-xs text-primary/40 font-bold select-none">+</span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 border border-border bg-background rounded-none shrink-0" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-5 w-32 bg-muted rounded-none" />
                <div className="h-4 w-14 bg-muted/60 rounded-none" />
              </div>
              <div className="h-3 w-64 max-w-full bg-muted/50 rounded-none" />
            </div>
          </div>
          <div className="h-8 w-44 bg-muted/60 border border-border rounded-none self-start sm:self-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border/70 bg-background/50 p-3 space-y-1.5 rounded-none">
              <div className="h-2.5 w-16 bg-muted/60 rounded-none" />
              <div className="h-4 w-24 bg-muted rounded-none" />
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. Operator Profile Skeleton ── */}
      <section className="bg-card border border-border p-5 sm:p-6 shadow-2xs space-y-5 rounded-none">
        <div className="flex items-center gap-2 border-b border-border/80 pb-3">
          <div className="size-4 bg-muted/70 rounded-none" />
          <div className="h-4 w-24 bg-muted rounded-none" />
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-2">
          {/* Avatar Skeleton */}
          <div className="size-16 border border-border bg-muted/50 rounded-none shrink-0" />

          <div className="grid grid-cols-1 gap-4 flex-1 w-full">
            <div className="space-y-2">
              <div className="h-3 w-24 bg-muted/70 rounded-none" />
              <div className="h-10 w-full bg-muted/40 border border-border rounded-none" />
            </div>
          </div>
        </div>

        {/* Dashboard Language Skeleton */}
        <div className="border-t border-border/60 pt-4 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="size-3.5 bg-muted/70 rounded-none" />
            <div className="h-3.5 w-44 bg-muted rounded-none" />
          </div>
          <div className="h-3 w-72 max-w-full bg-muted/50 rounded-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 border border-border bg-background space-y-2 rounded-none">
              <div className="h-3.5 w-24 bg-muted rounded-none" />
              <div className="h-3 w-40 bg-muted/50 rounded-none" />
            </div>
            <div className="p-3 border border-border bg-background space-y-2 rounded-none">
              <div className="h-3.5 w-24 bg-muted rounded-none" />
              <div className="h-3 w-40 bg-muted/50 rounded-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <div className="h-9 w-44 bg-muted/60 border border-border rounded-none" />
        </div>
      </section>

      {/* ── 3. Business Workspace Skeleton ── */}
      <section className="bg-card border border-border p-5 sm:p-6 shadow-2xs space-y-5 rounded-none">
        <div className="flex items-center gap-2 border-b border-border/80 pb-3">
          <div className="size-4 bg-muted/70 rounded-none" />
          <div className="h-4 w-36 bg-muted rounded-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="h-3 w-40 bg-muted/70 rounded-none" />
            <div className="h-10 w-full bg-muted/40 border border-border rounded-none" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-36 bg-muted/70 rounded-none" />
            <div className="h-10 w-full bg-muted/40 border border-border rounded-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-2">
            <div className="h-3 w-28 bg-muted/70 rounded-none" />
            <div className="h-10 w-full bg-muted/40 border border-border rounded-none" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-24 bg-muted/70 rounded-none" />
            <div className="h-10 w-full bg-muted/40 border border-border rounded-none" />
          </div>
        </div>

        {/* Tenant ID Skeleton */}
        <div className="border-t border-border/60 pt-4 space-y-2.5">
          <div className="h-3 w-36 bg-muted/70 rounded-none" />
          <div className="h-3 w-80 max-w-full bg-muted/50 rounded-none" />
          <div className="flex items-center gap-2">
            <div className="h-10 flex-1 bg-muted/30 border border-border rounded-none" />
            <div className="h-10 w-24 bg-muted/50 border border-border rounded-none shrink-0" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <div className="h-9 w-44 bg-muted/60 border border-border rounded-none" />
        </div>
      </section>

      {/* ── 4. Security & Password Skeleton ── */}
      <section className="bg-card border border-border p-5 sm:p-6 shadow-2xs space-y-5 rounded-none">
        <div className="flex items-center gap-2 border-b border-border/80 pb-3">
          <div className="size-4 bg-muted/70 rounded-none" />
          <div className="h-4 w-36 bg-muted rounded-none" />
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <div className="h-3 w-28 bg-muted/70 rounded-none" />
            <div className="h-10 w-full bg-muted/40 border border-border rounded-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <div className="h-3 w-24 bg-muted/70 rounded-none" />
              <div className="h-10 w-full bg-muted/40 border border-border rounded-none" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-28 bg-muted/70 rounded-none" />
              <div className="h-10 w-full bg-muted/40 border border-border rounded-none" />
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="h-3 w-44 bg-muted/50 rounded-none" />
          <div className="h-3 w-36 bg-muted/50 rounded-none" />
        </div>

        <div className="pt-2">
          <div className="h-9 w-36 bg-muted/60 border border-border rounded-none" />
        </div>
      </section>
    </div>
  );
}

