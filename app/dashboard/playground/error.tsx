"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertOctagon, RotateCcw, BookOpen, Home } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

interface PlaygroundErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PlaygroundError({ error, reset }: PlaygroundErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="relative flex h-[calc(100vh-8rem)] w-full flex-col items-center justify-center border border-border bg-card p-6 shadow-xs">
      {/* Corner crosshairs for architectural craft */}
      <span className="pointer-events-none absolute -bottom-1 -left-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -bottom-1 -right-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -top-1 -right-1 font-mono text-[10px] text-border select-none">+</span>

      <div className="flex w-full max-w-lg flex-col gap-6 border border-border bg-background p-6 sm:p-8 rounded-none shadow-md text-start">
        {/* Top Status Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="size-2 bg-destructive inline-block" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-destructive">
              Studio Runtime Error
            </span>
          </div>
          <div className="flex size-8 items-center justify-center border border-destructive/30 bg-destructive/10 text-destructive rounded-none">
            <AlertOctagon className="size-4" />
          </div>
        </div>

        {/* Error Titles & Description */}
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground font-sans">
            Unable to Initialize AI Playground
          </h1>
          <p className="font-sans text-xs text-muted-foreground leading-relaxed" dir="auto">
            تعذر تشغيل بيئة محاكاة سند. حدث خطأ غير متوقع أثناء إعداد المساعد أو تحميل بيانات قاعدة المعرفة.
          </p>
          <p className="font-sans text-xs text-muted-foreground/80 leading-relaxed">
            An unexpected error occurred while preparing the simulator session. Our engineering team has been notified via automated telemetry.
          </p>
        </div>

        {/* Technical Digest Box (if available) */}
     

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-border">
          <Button
            type="button"
            onClick={reset}
            variant="default"
            size="sm"
            className="w-full sm:w-auto gap-2"
          >
            <RotateCcw className="size-3.5" />
            <span>Try Again (إعادة المحاولة)</span>
          </Button>

          <Link
            href="/dashboard/knowledge-base"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full sm:w-auto gap-2")}
          >
            <BookOpen className="size-3.5" />
            <span>Knowledge Base</span>
          </Link>

          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "w-full sm:w-auto gap-2")}
          >
            <Home className="size-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
