"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

interface BillingErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BillingError({ error, reset }: BillingErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="relative flex min-h-[460px] w-full flex-col items-center justify-center border border-border bg-card p-6 shadow-xs max-w-5xl mx-auto my-6">
      {/* Corner crosshairs */}
      <span className="pointer-events-none absolute -bottom-1 -left-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -bottom-1 -right-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-[10px] text-border select-none">+</span>
      <span className="pointer-events-none absolute -top-1 -right-1 font-mono text-[10px] text-border select-none">+</span>

      <div className="flex w-full max-w-lg flex-col gap-5 border border-border bg-background p-6 sm:p-8 rounded-none shadow-md text-start">
        {/* Top Status Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <span className="size-2 bg-destructive inline-block" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-destructive">
              Billing & Subscription Exception
            </span>
          </div>
          <div className="flex size-8 items-center justify-center border border-destructive/30 bg-destructive/10 text-destructive rounded-none">
            <AlertOctagon className="size-4" />
          </div>
        </div>

        {/* Error Titles & Description */}
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground font-sans">
            Unable to Load Subscription Data
          </h1>
          <p className="font-sans text-xs text-muted-foreground leading-relaxed">
            An error occurred while loading your current plan tier, inquiry quotas, or payment history.
          </p>
          {error.digest && (
            <p className="font-mono text-[10px] text-muted-foreground/80 bg-muted/40 p-2 border border-border">
              Digest: {error.digest}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2 border-t border-border">
          <Button
            onClick={() => reset()}
            size="sm"
            className="w-full sm:w-auto font-sans text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>Retry Billing</span>
          </Button>

          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-full sm:w-auto gap-2 font-sans text-xs"
            )}
          >
            <Home className="size-3.5 text-muted-foreground" />
            <span>Dashboard Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

