"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Send,
  CornerDownLeft,
  Loader2,
  X,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

interface PlaygroundInputBarProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isRunning: boolean;
  modelName: string;
  isLimitReached: boolean;
  remainingMessages: number;
}

export function PlaygroundInputBar({
  input,
  setInput,
  onSubmit,
  isRunning,
  modelName,
  remainingMessages,
  isLimitReached,
}: PlaygroundInputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180,
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isRunning && !isLimitReached) {
        onSubmit();
      }
    }
  };

  return (
    <div className="border-t border-border bg-card p-3 sm:p-4 transition-colors">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col border border-border bg-background focus-within:border-primary transition-all shadow-xs">
          {/* Main Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            dir="auto"
            placeholder={
              isLimitReached
                ? "Testing quota exhausted for this billing cycle. Upgrade your plan to send more inquiries..."
                : "Type a customer question or test inquiry... (e.g. What is the return and exchange policy?)"
            }
            rows={2}
            disabled={isRunning || isLimitReached}
            className="w-full resize-none bg-transparent p-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans disabled:opacity-50 leading-relaxed"
          />

          {/* Quota Limit Reached Banner */}
          {isLimitReached && (
            <div className="flex items-center justify-between gap-3 border-t border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="size-4 shrink-0 text-destructive" />
                <span className="font-medium truncate">
                  Quota limit reached. You have 0 test inquiries remaining in this cycle.
                </span>
              </div>
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-destructive hover:underline uppercase tracking-wider shrink-0"
              >
                <span>Upgrade Plan</span>
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="flex items-center justify-between border-t border-border/50 px-3.5 py-2 bg-muted/20">
            <div className="flex items-center gap-3 text-[11px] font-sans text-muted-foreground">
              <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px]">
                <CornerDownLeft className="size-3 text-muted-foreground" />
                <span>Enter to send</span>
              </span>

              <span className="hidden sm:inline-block text-border">|</span>

              {/* Remaining Messages Indicator */}
              <span
                className={`inline-flex items-center gap-1.5 font-mono text-[10px] ${
                  isLimitReached
                    ? "text-destructive font-semibold"
                    : remainingMessages <= 10
                    ? "text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                <span
                  className={`size-1.5 ${
                    isLimitReached
                      ? "bg-destructive"
                      : remainingMessages <= 10
                      ? "bg-amber-500"
                      : "bg-primary"
                  }`}
                />
                <span>
                  {isLimitReached
                    ? "0 inquiries remaining"
                    : `${remainingMessages} inquiries remaining`}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {input.trim().length > 0 && !isRunning && !isLimitReached && (
                <button
                  type="button"
                  onClick={() => setInput("")}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Clear input"
                >
                  <X className="size-3.5" />
                </button>
              )}

              <Button
                type="button"
                size="sm"
                onClick={() => onSubmit()}
                disabled={!input.trim() || isRunning || isLimitReached}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : isLimitReached ? (
                  <span>Limit Reached</span>
                ) : (
                  <>
                    <span>Send Inquiry</span>
                    <Send className="size-3" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
