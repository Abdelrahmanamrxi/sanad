"use client";

import React, { useRef, useEffect } from "react";
import { Send, CornerDownLeft, Loader2, X } from "lucide-react";

interface PlaygroundInputBarProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isRunning: boolean;
  modelName: string;
}

export function PlaygroundInputBar({
  input,
  setInput,
  onSubmit,
  isRunning,
  modelName,
}: PlaygroundInputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200,
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isRunning) {
        onSubmit();
      }
    }
  };

  return (
    <div className="border-t border-border bg-card p-4 transition-colors">
      <div className="flex flex-col border border-border bg-background focus-within:border-primary transition-colors">
        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          dir="auto"
          placeholder="Type a customer question or test inquiry... (e.g. ما هي سياسة الاسترجاع المعتمدة؟)"
          rows={2}
          disabled={isRunning}
          className="w-full resize-none bg-transparent p-3 text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans disabled:opacity-50"
        />

        {/* Action Toolbar */}
        <div className="flex items-center justify-between border-t border-border/50 px-3 py-2 bg-muted/20">
          <div className="flex items-center gap-3 text-[11px] font-sans text-muted-foreground">
            <span className="hidden sm:inline-flex items-center gap-1">
              <CornerDownLeft className="size-3 text-muted-foreground" />
              <span>Press Enter to send</span>
            </span>
            <span>•</span>
            <span className="text-primary font-medium">{modelName}</span>
          </div>

          <div className="flex items-center gap-2">
            {input.trim().length > 0 && !isRunning && (
              <button
                type="button"
                onClick={() => setInput("")}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Clear input"
              >
                <X className="size-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={onSubmit}
              disabled={!input.trim() || isRunning}
              className="flex items-center gap-1.5 border border-primary bg-primary px-3.5 py-1.5 font-sans text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none rounded-none"
            >
              {isRunning ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <Send className="size-3" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
