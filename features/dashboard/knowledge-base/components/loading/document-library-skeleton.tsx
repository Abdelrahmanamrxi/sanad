
export default function DocumentLibrarySkeleton() {
  return (
    <div className="border border-border bg-card p-4 lg:col-span-5 flex flex-col rounded-none animate-pulse select-none">
      {/* Search & Type Filter Tabs Skeleton */}
      <div className="flex flex-col gap-3 border-b border-border pb-3.5">
        <div className="h-8 bg-muted/50 rounded-none w-full" />
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-14 bg-muted rounded-none" />
          <div className="h-5 w-10 bg-muted/60 rounded-none" />
          <div className="h-5 w-12 bg-muted/60 rounded-none" />
          <div className="h-5 w-10 bg-muted/60 rounded-none" />
          <div className="h-5 w-10 bg-muted/60 rounded-none" />
        </div>
      </div>

      {/* Document card skeletons */}
      <div className="mt-3 flex flex-col gap-2 max-h-[calc(100vh-280px)] overflow-hidden pe-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border border-border bg-card p-3 rounded-none flex flex-col gap-2.5"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <div className="mt-0.5 size-3.5 bg-muted rounded-none shrink-0" />
                <div className="mt-0.5 size-4 bg-muted rounded-none shrink-0" />
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div
                    className="h-3 bg-muted rounded-none"
                    style={{ width: `${55 + (i % 4) * 12}%` }}
                  />
                  <div
                    className="h-2 bg-muted/60 rounded-none"
                    style={{ width: `${35 + (i % 3) * 15}%` }}
                  />
                </div>
              </div>
              <div className="size-3.5 bg-muted/40 rounded-none shrink-0" />
            </div>

            {/* Bottom metadata row */}
            <div className="flex items-center justify-between border-t border-border/40 pt-2 text-[10px]">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-8 bg-muted rounded-none" />
                <div className="h-3 w-12 bg-muted/60 rounded-none" />
                <span className="text-border">|</span>
                <div className="h-3 w-14 bg-muted/60 rounded-none" />
              </div>
              <div className="h-3.5 w-14 bg-muted/70 rounded-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
