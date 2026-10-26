"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function EmbedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Embed Widget Error]", error);
  }, [error]);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs text-foreground antialiased font-sans">
      <div className="w-full max-w-sm bg-card border border-destructive/40 shadow-xl p-5 space-y-4 rounded-none">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-destructive/15 border border-destructive/40 flex items-center justify-center text-destructive rounded-none">
            <AlertCircle className="size-4 shrink-0" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-xs text-foreground">
              Assistant Connection Error
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Unable to load the assistant at this time.
            </p>
          </div>
        </div>

        <p className="text-xs text-foreground/80 leading-relaxed font-sans">
          The chat widget encountered an error while connecting. Please try again.
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <span className="text-[10px] font-mono text-muted-foreground">
            Error
          </span>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer rounded-none"
          >
            <RefreshCw className="size-3" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    </div>
  );
}
