"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DirectChatNotFound() {
  return (
    <main className="w-full min-h-dvh flex items-center justify-center p-4 bg-background text-foreground antialiased font-sans">
      <div className="w-full max-w-md bg-card border border-border shadow-lg p-6 space-y-5 rounded-none">
        <div className="flex items-start gap-3.5">
          <div className="size-10 shrink-0 bg-destructive/10 border border-destructive/30 flex items-center justify-center text-destructive rounded-none">
            <AlertCircle className="size-5" />
          </div>
          <div className="space-y-1">
            <h1 className="font-heading font-bold text-base text-foreground leading-snug">
              Assistant Not Available
            </h1>
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              This chat link is invalid, inactive, or the assistant has been disabled.
            </p>
          </div>
        </div>

        <div className="p-3 bg-muted/40 border border-border/80 text-xs text-foreground/80 space-y-1.5 rounded-none font-sans">
          <p className="font-medium text-[11px] text-muted-foreground uppercase tracking-wider font-mono">
            Notice
          </p>
          <p className="leading-relaxed">
            Please verify that this assistant exists and is enabled in your Sanad dashboard under Widget Settings.
          </p>
          <p className="leading-relaxed font-sans text-right" dir="rtl">
            يرجى التحقق من وجود هذا المساعد وتفعيله من خلال إعدادات المساعد في لوحة التحكم.
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "gap-1.5 text-xs rounded-none",
            )}
          >
            <Home className="size-3.5 text-muted-foreground" />
            <span>Home</span>
          </Link>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors cursor-pointer rounded-none"
          >
            <RefreshCw className="size-3" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    </main>
  );
}
