"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

function DocumentLibraryFallback({ error, resetErrorBoundary }: FallbackProps) {
  const router = useRouter();

  const digest = (error as { digest?: string })?.digest;
  if (
    digest?.startsWith("NEXT_REDIRECT") ||
    digest?.startsWith("NEXT_NOT_FOUND")
  ) {
    throw error;
  }

  return (
    <div className="border border-border bg-card p-4 flex flex-col justify-between rounded-none min-h-[480px] w-full select-none">
      {/* Top Header matching DocumentLibrary */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h2 className="text-sm font-semibold tracking-tight text-foreground font-sans">
          Document Library
        </h2>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-destructive/30 bg-destructive/10 text-destructive text-[11px] font-mono uppercase tracking-wider rounded-none font-medium">
          <span className="size-1.5 bg-destructive shrink-0" />
          Error
        </span>
      </div>

      {/* Centered Clean Fallback State */}
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 my-auto">
        <div className="size-10 border border-border bg-muted/40 text-muted-foreground flex items-center justify-center rounded-none mb-3">
          <AlertCircle className="size-5 stroke-[1.5]" />
        </div>

        <h3 className="text-sm font-semibold text-foreground tracking-tight font-sans">
          Couldn&apos;t load documents
        </h3>

        <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed font-sans">
          Something went wrong while fetching this section. Please try again.
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            router.refresh();
            resetErrorBoundary();
          }}
          className="cursor-pointer mt-4 font-sans"
        >
          <RotateCcw className="size-3.5 me-1.5" />
          Try again
        </Button>
      </div>

      {/* Subtle bottom border line to balance the card frame */}
      <div className="border-t border-border pt-2 text-start">
        <span className="text-[10px] font-mono text-muted-foreground">
          Workspace / Documents
        </span>
      </div>
    </div>
  );
}

export default function DocumentLibrarySectionError({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="lg:col-span-5 w-full">
      <ErrorBoundary FallbackComponent={DocumentLibraryFallback}>
        {children}
      </ErrorBoundary>
    </div>
  );
}
