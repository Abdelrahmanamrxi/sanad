import React from "react";
import { Loader2 } from "lucide-react";

export default function ConversationsLoading() {
  return (
    <div className="h-[calc(100vh-6.5rem)] min-h-[550px] border border-border bg-card flex flex-col md:flex-row overflow-hidden rounded-none shadow-xs">
      {/* Left Column Skeleton */}
      <div className="w-full md:w-[340px] lg:w-[380px] shrink-0 h-full border-r border-border bg-card p-4 space-y-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="h-5 w-32 bg-muted/70 rounded-none animate-pulse" />
          <div className="h-4 w-8 bg-muted/50 rounded-none animate-pulse" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="h-8 w-full bg-muted/40 border border-border/60 rounded-none animate-pulse" />

        {/* Tab Filter Skeleton */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <div className="h-6 w-14 bg-muted/60 rounded-none animate-pulse" />
          <div className="h-6 w-16 bg-muted/40 rounded-none animate-pulse" />
          <div className="h-6 w-20 bg-muted/40 rounded-none animate-pulse" />
        </div>

        {/* Conversation List Cards Skeleton */}
        <div className="space-y-3 pt-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="p-3 border border-border/60 bg-muted/15 flex flex-col gap-2 rounded-none animate-pulse"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="h-3 w-28 bg-muted/70 rounded-none" />
                <div className="h-2.5 w-12 bg-muted/50 rounded-none" />
              </div>
              <div className="h-3.5 w-4/5 bg-muted/80 rounded-none" />
              <div className="h-2.5 w-1/2 bg-muted/50 rounded-none" />
              <div className="flex items-center gap-2 pt-0.5">
                <div className="h-3 w-16 bg-muted/60 rounded-none" />
                <div className="h-3 w-24 bg-muted/40 rounded-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Centered Loading Spinner with Layout Preview */}
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center p-8 text-center bg-background">
        <div className="flex flex-col items-center space-y-3">
          <div className="size-10 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center rounded-none shadow-2xs">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading font-medium text-sm text-foreground">
              Loading conversations...
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              Retrieving customer inquiries and leads
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
