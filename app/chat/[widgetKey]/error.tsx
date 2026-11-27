"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DirectChatErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DirectChatError({
  error,
  reset,
}: DirectChatErrorProps) {
  useEffect(() => {
    console.error("[Direct Chat Error]", error);
  }, [error]);

  return (
    <main className="min-h-dvh w-full flex items-center justify-center p-4 bg-background text-foreground antialiased font-sans">
      <div className="relative flex w-full max-w-md flex-col gap-5 border border-border bg-card p-6 sm:p-8 rounded-none shadow-md text-start">
        {/* Corner crosshairs */}
        <span className="pointer-events-none absolute -bottom-1 -start-1 font-mono text-[10px] text-border select-none">+</span>
        <span className="pointer-events-none absolute -bottom-1 -end-1 font-mono text-[10px] text-border select-none">+</span>
        <span className="pointer-events-none absolute -top-1 -start-1 font-mono text-[10px] text-border select-none">+</span>
        <span className="pointer-events-none absolute -top-1 -end-1 font-mono text-[10px] text-border select-none">+</span>

        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="size-2 bg-destructive inline-block" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-destructive">
              Assistant Connection Error
            </span>
          </div>
          <div className="flex size-8 items-center justify-center border border-destructive/30 bg-destructive/10 text-destructive rounded-none">
            <AlertOctagon className="size-4" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-lg font-bold tracking-tight text-foreground">
            Unable to Load Chat Assistant
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            An unexpected error occurred while connecting to this assistant. Please try again.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed text-right" dir="rtl">
            حدث خطأ غير متوقع أثناء الاتصال بالمساعد. يرجى المحاولة مرة أخرى.
          </p>
          {error.digest && (
            <p className="font-mono text-[10px] text-muted-foreground/80 bg-muted/40 p-2 border border-border rounded-none">
              Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-border">
          <Button
            type="button"
            onClick={() => reset()}
            size="sm"
            className="w-full sm:w-auto font-sans text-xs font-semibold cursor-pointer rounded-none"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again</span>
          </Button>

          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full sm:w-auto gap-2 font-sans text-xs rounded-none",
            )}
          >
            <Home className="size-3.5 text-muted-foreground" />
            <span>Back Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
