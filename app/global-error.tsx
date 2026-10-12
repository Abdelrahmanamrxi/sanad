"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" dir="ltr" className="h-full">
      <body className="min-h-full flex items-center justify-center bg-background text-foreground p-4 antialiased">
        <main className="w-full max-w-md border border-border bg-card p-6 sm:p-8 shadow-2xl rounded-none flex flex-col gap-6">
          {/* Header Status & Icon */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <span className="size-2 bg-destructive inline-block" />
              <span className="font-mono text-xs tracking-wider uppercase text-destructive font-semibold">
                Critical Error 500
              </span>
            </div>
            <div className="size-8 border border-destructive/20 bg-destructive/10 flex items-center justify-center text-destructive rounded-none">
              <AlertOctagon className="size-4" />
            </div>
          </div>

          {/* Heading & Details */}
          <div className="flex flex-col gap-2">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-sans">
              System Encountered an Unexpected Error
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              An unexpected failure occurred while processing this request. Our engineering team has been notified via Sentry telemetry.
            </p>
          </div>

          {/* Error Digest Reference */}
          {error.digest && (
            <div className="border border-border bg-muted/40 p-3 font-mono text-[11px] text-muted-foreground flex flex-col gap-1 select-all rounded-none">
              <span className="text-[10px] uppercase text-muted-foreground/70">
                Incident Reference (Digest)
              </span>
              <span className="text-foreground font-medium break-all">
                {error.digest}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => reset()}
              className="w-full sm:flex-1 gap-2"
            >
              <RotateCcw className="size-3.5" />
              <span>Try Again</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = "/";
              }}
              className="w-full sm:flex-1 gap-2"
            >
              <Home className="size-3.5" />
              <span>Return Home</span>
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
