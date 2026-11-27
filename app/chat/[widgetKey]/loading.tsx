import React from "react";

export default function DirectChatLoading() {
  return (
    <main className="min-h-dvh w-full flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 bg-background">
      <div className="flex flex-col w-full sm:max-w-[480px] md:max-w-[520px] h-dvh sm:h-[min(740px,calc(100dvh-3rem))] border border-border bg-card overflow-hidden animate-pulse rounded-none">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center border-b border-border px-4 py-5 space-y-2.5 shrink-0">
          <div className="size-14 bg-muted border border-border rounded-none" />
          <div className="h-4 w-36 bg-muted rounded-none" />
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 bg-primary/40 inline-block" />
            <div className="h-3 w-28 bg-muted/60 rounded-none" />
          </div>
          <div className="h-7 w-32 bg-muted/50 border border-border mt-1 rounded-none" />
        </div>

        {/* Message Feed Skeleton */}
        <div className="flex-1 p-4 space-y-4 overflow-hidden">
          <div className="flex items-start gap-2.5 max-w-[82%]">
            <div className="size-7 shrink-0 bg-muted border border-border rounded-none" />
            <div className="flex-1 space-y-1.5 bg-muted/40 border border-border p-3 rounded-none">
              <div className="h-3 w-48 max-w-full bg-muted" />
              <div className="h-3 w-36 max-w-full bg-muted/70" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <div className="h-8 w-36 bg-muted/40 border border-border rounded-none" />
            <div className="h-8 w-44 bg-muted/40 border border-border rounded-none" />
            <div className="h-8 w-32 bg-muted/40 border border-border rounded-none" />
          </div>
        </div>

        {/* Input Bar Skeleton */}
        <div className="border-t border-border p-3 flex items-center gap-2 shrink-0">
          <div className="h-10 flex-1 bg-muted/40 border border-border rounded-none" />
          <div className="size-10 bg-primary/30 border border-border rounded-none" />
        </div>

        {/* Footer Skeleton */}
        <div className="border-t border-border py-2 flex items-center justify-center shrink-0">
          <div className="h-2.5 w-28 bg-muted/50 rounded-none" />
        </div>
      </div>
    </main>
  );
}
