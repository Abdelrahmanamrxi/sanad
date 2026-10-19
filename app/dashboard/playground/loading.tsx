export default function PlaygroundLoading() {
  return (
    <div className="relative flex h-[calc(100vh-8rem)] flex-col border border-border bg-card shadow-xs overflow-hidden animate-pulse">
      {/* Corner crosshair accents for architectural craft */}
      <span className="pointer-events-none absolute -bottom-1 -left-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -bottom-1 -right-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -top-1 -right-1 font-mono text-[10px] text-border select-none">+</span>

      {/* ── Top Header Bar Skeleton ── */}
      <div className="relative flex flex-col gap-3 border-b border-border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Identity Skeleton */}
          <div className="flex items-center gap-3">
            <div className="size-9 border border-border bg-muted/60 rounded-none shrink-0" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-4 w-36 bg-muted rounded-none" />
                <div className="h-4 w-28 bg-muted/50 border border-border rounded-none hidden sm:block" />
              </div>
              <div className="h-3 w-64 max-w-full bg-muted/60 rounded-none" />
            </div>
          </div>

          {/* Right: Controls & Presets Skeleton */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="h-7 w-32 border border-border bg-background rounded-none" />
            <div className="h-7 w-36 border border-border bg-background rounded-none" />
            <div className="h-7 w-24 border border-border bg-background rounded-none hidden sm:block" />
            <div className="h-7 w-24 border border-border bg-background rounded-none" />
          </div>
        </div>
      </div>

      {/* ── Main Chat Canvas Skeleton ── */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          {/* Center Badge Skeleton */}
          <div className="h-5 w-48 border border-border bg-card mb-4 rounded-none" />

          {/* Center Bot Icon Skeleton */}
          <div className="size-14 border border-border bg-card mb-4 rounded-none" />

          {/* Title & Subtitle Skeleton */}
          <div className="h-6 w-64 bg-muted mb-2.5 rounded-none" />
          <div className="h-3.5 w-96 max-w-full bg-muted/60 mb-8 rounded-none" />

          {/* Quick Starter Question Cards Skeleton */}
          <div className="w-full max-w-2xl space-y-2.5">
            <div className="flex items-center justify-between px-0.5">
              <div className="h-3 w-32 bg-muted/70 rounded-none" />
              <div className="h-3 w-20 bg-muted/40 rounded-none hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border border-border bg-card/60 p-3.5 flex flex-col gap-2 rounded-none text-start shadow-2xs"
                >
                  <div className="h-2.5 w-24 bg-primary/20 rounded-none" />
                  <div className="h-3.5 w-4/5 bg-muted rounded-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Input Bar Skeleton ── */}
        <div className="border-t border-border bg-card p-3 sm:p-4">
          <div className="mx-auto flex max-w-3xl items-center gap-2 border border-border bg-background p-2 rounded-none shadow-2xs">
            <div className="h-4 flex-1 bg-muted/40 rounded-none ps-2" />
            <div className="size-8 bg-muted rounded-none shrink-0" />
          </div>
          <div className="mx-auto mt-2 flex max-w-3xl items-center justify-between px-1">
            <div className="h-2.5 w-28 bg-muted/40 rounded-none" />
            <div className="h-2.5 w-36 bg-muted/40 rounded-none" />
          </div>
        </div>
      </div>
    </div>
  );
}