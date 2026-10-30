export default function DocumentInspectorSkeleton() {
  return (
    <div className="border border-border bg-card p-5 lg:col-span-7 flex flex-col rounded-none animate-pulse select-none">
      {/* ── Header Skeleton ── */}
      <div className="border-b border-border pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 pe-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-10 bg-muted rounded-none" />
              <div className="h-5 w-52 bg-muted rounded-none" />
            </div>
            <div className="h-3 w-64 bg-muted/60 rounded-none" />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="h-7 w-20 bg-muted rounded-none" />
            <div className="h-7 w-16 bg-muted rounded-none" />
            <div className="h-7 w-18 bg-muted rounded-none" />
          </div>
        </div>

        {/* 4 Summary stat boxes */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 border-t border-border/50 pt-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="border border-border/60 bg-background/50 p-2.5 rounded-none space-y-1.5"
            >
              <div className="h-2.5 w-14 bg-muted/60 rounded-none" />
              <div className="h-3.5 w-20 bg-muted rounded-none" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Tabs Skeleton ── */}
      <div className="mt-4 flex items-center justify-between border-b border-border pb-1">
        <div className="flex items-center gap-4">
          <div className="h-6 w-24 bg-muted rounded-none" />
          <div className="h-6 w-28 bg-muted/60 rounded-none" />
          <div className="h-6 w-24 bg-muted/60 rounded-none" />
        </div>
      </div>

      {/* ── Body Skeleton ── */}
      <div className="mt-4 flex flex-col gap-3">
        {/* KPI Cards Skeleton */}
      

        {/* Content Box Skeleton */}
        <div className="border border-border bg-background p-3.5 rounded-none space-y-2.5 mt-1">
          <div className="h-3 w-32 bg-muted rounded-none" />
          <div className="space-y-2 pt-1">
            <div className="h-7 w-full bg-muted/30 rounded-none" />
            <div className="h-7 w-full bg-muted/30 rounded-none" />
            <div className="h-7 w-full bg-muted/30 rounded-none" />
          </div>
        </div>
      </div>
    </div>
  );
}