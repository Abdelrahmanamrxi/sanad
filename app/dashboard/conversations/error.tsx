"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ConversationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Conversations route error:", error);
  }, [error]);

  return (
    <div className="h-[calc(100vh-6.5rem)] min-h-[500px] border border-border bg-card flex flex-col items-center justify-center p-8 text-center rounded-none shadow-xs">
      <div className="max-w-md w-full flex flex-col items-center space-y-4">
        <div className="size-12 bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center rounded-none shadow-2xs">
          <AlertCircle className="size-6 stroke-[1.75]" />
        </div>

        <div className="space-y-1.5">
          <h2 className="font-heading font-semibold text-base text-foreground tracking-tight">
            Failed to load conversations
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {error?.message ||
              "An unexpected error occurred while loading this section. Please try again."}
          </p>
          {error?.digest && (
            <p className="text-[10px] font-mono text-muted-foreground/70">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer rounded-none shadow-2xs mt-2"
        >
          <RefreshCw className="size-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
