"use client";

import React, { useState, useCallback, useSyncExternalStore } from "react";
import { AlertCircle, X, ChevronUp, RefreshCw } from "lucide-react";

// Idiomatic external store to check if inside an iframe without triggering setState in effects
const emptySubscribe = () => () => {};
const getIsIframe = () => typeof window !== "undefined" && window.parent !== window;
const getServerSnapshot = () => false;

export default function EmbedNotFound() {
  const isIframe = useSyncExternalStore(emptySubscribe, getIsIframe, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  const notifyParent = useCallback((open: boolean) => {
    try {
      if (typeof window !== "undefined" && window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "sanad:not_found",
            isOpen: open,
          },
          "*"
        );
      }
    } catch {
      // Suppress cross-origin messaging errors
    }
  }, []);

  const toggleOpen = (nextState?: boolean) => {
    setIsOpen((prev) => {
      const next = nextState !== undefined ? nextState : !prev;
      notifyParent(next);
      return next;
    });
  };

  // Standalone full-page view (when opened directly in browser tab)
  if (!isIframe) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center p-4 bg-background text-foreground antialiased font-sans">
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
                This chat widget is not present, inactive, or the widget key is invalid.
              </p>
            </div>
          </div>

          <div className="p-3 bg-muted/40 border border-border/80 text-xs text-foreground/80 space-y-1.5 rounded-none font-sans">
            <p className="font-medium text-[11px] text-muted-foreground uppercase tracking-wider font-mono">
              Notice / ملاحظة
            </p>
            <p className="leading-relaxed">
              Please verify that this widget exists and is enabled in your Sanad dashboard under Widget Settings.
            </p>
            <p className="leading-relaxed font-sans text-right" dir="rtl">
              يرجى التحقق من وجود هذا المساعد وتفعيله من خلال إعدادات المساعد في لوحة التحكم.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-mono text-muted-foreground tracking-tight">
              Sanad AI Platform
            </span>
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

  // Inside Embed Iframe View
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-end items-end p-2 sm:p-3 overflow-hidden antialiased font-sans">
      {isOpen ? (
        /* Expanded Fallback Error Card */
        <div
          role="alert"
          aria-live="polite"
          className="pointer-events-auto w-full max-w-[380px] bg-card border border-destructive/40 shadow-xl p-4 space-y-3.5 rounded-none text-foreground animate-in fade-in zoom-in-95 duration-200"
          style={{ backgroundColor: "#132322", color: "#E8EFEE" }}
        >
          <div className="flex items-center justify-between border-b border-border/30 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="size-6 bg-destructive/15 border border-destructive/40 flex items-center justify-center text-destructive rounded-none">
                <AlertCircle className="size-3.5" />
              </div>
              <span className="font-heading font-semibold text-xs text-foreground">
                Assistant Unavailable
              </span>
            </div>
            <button
              type="button"
              onClick={() => toggleOpen(false)}
              className="p-1 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-none"
              title="Close"
              aria-label="Close"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs leading-relaxed text-foreground/85">
            <p>
              This chat widget is currently inactive or not found. Please verify your widget configuration in the store dashboard.
            </p>
            <p className="text-right opacity-85 text-[11px]" dir="rtl">
              هذا المساعد غير متوفر حالياً أو لم يتم العثور على معرّفه. يرجى التحقق من إعدادات المساعد في لوحة التحكم.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-border/30 text-[10px] text-muted-foreground">
            <span className="font-mono">Status: 404 Not Found</span>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1 text-xs text-foreground hover:underline cursor-pointer"
            >
              <RefreshCw className="size-2.5" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      ) : (
        /* Collapsed Error Launcher Badge */
        <button
          type="button"
          onClick={() => toggleOpen(true)}
          className="pointer-events-auto inline-flex items-center gap-2 px-3 py-2 bg-destructive/90 hover:bg-destructive text-white shadow-lg border border-destructive/50 transition-transform active:scale-95 cursor-pointer rounded-none font-sans text-xs select-none"
          title="Assistant Unavailable"
        >
          <AlertCircle className="size-4 shrink-0 text-white animate-pulse" />
          <span className="font-medium text-[11px] truncate max-w-[130px]">
            Assistant Unavailable
          </span>
          <ChevronUp className="size-3 opacity-75 shrink-0" />
        </button>
      )}
    </div>
  );
}
