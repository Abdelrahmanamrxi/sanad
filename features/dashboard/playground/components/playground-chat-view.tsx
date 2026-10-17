"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  FileText,
  ArrowUpRight,
  ChevronRight,
  Zap,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Clock,
  BookOpen,
} from "lucide-react";
import type { PlaygroundMessage, PlaygroundChunk } from "../types";
import { CATEGORIZED_STARTERS } from "../constants";

interface PlaygroundChatViewProps {
  messages: PlaygroundMessage[];
  isRunning: boolean;
  activeKbPrompt: string | null;
  onRunKbPrompt: (prompt: string) => void;
  onDismissKbPrompt: () => void;
  onSelectStarterQuery: (query: string) => void;
  onSelectChunkForInspection: (chunk: PlaygroundChunk) => void;
  onFeedbackChange?: (
    messageId: string,
    feedback: "positive" | "negative",
  ) => void;
}

export function PlaygroundChatView({
  messages,
  isRunning,
  activeKbPrompt,
  onRunKbPrompt,
  onDismissKbPrompt,
  onSelectStarterQuery,
  onSelectChunkForInspection,
  onFeedbackChange,
}: PlaygroundChatViewProps) {
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<
    Record<string, "positive" | "negative">
  >({});

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleFeedback = (id: string, feedback: "positive" | "negative") => {
    setFeedbackState((prev) => ({
      ...prev,
      [id]: prev[id] === feedback ? ("" as unknown as "positive") : feedback,
    }));
    if (onFeedbackChange) {
      onFeedbackChange(id, feedback);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* ── Active Knowledge Base Handoff Banner ── */}
      {activeKbPrompt && (
        <div className="border border-primary/40 bg-primary/5 p-4 transition-all">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center border border-primary/30 bg-primary/20 text-primary">
                <Sparkles className="size-4" />
              </div>
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
                  Question Selected From Knowledge Base
                </span>
                <p
                  className="mt-1 font-sans text-sm font-medium text-foreground"
                  dir="auto"
                >
                  {activeKbPrompt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => onRunKbPrompt(activeKbPrompt)}
                disabled={isRunning}
                className="flex items-center gap-1.5 border border-primary bg-primary px-3 py-1.5 font-sans text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 rounded-none"
              >
                <Zap className="size-3" />
                <span>Test Question</span>
              </button>
              <button
                type="button"
                onClick={onDismissKbPrompt}
                className="border border-border bg-background px-2.5 py-1.5 font-sans text-xs text-muted-foreground hover:text-foreground transition-colors rounded-none"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty State / Customer Test Center ── */}
      {messages.length === 0 && !isRunning && (
        <div className="my-auto flex flex-col items-center justify-center py-10 text-center">
          <div className="flex size-14 items-center justify-center border border-primary/40 bg-primary/10 text-primary mb-4">
            <Bot className="size-7" />
          </div>

          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground font-sans">
            Customer Support Simulator
          </h2>
          <p className="mt-1.5 max-w-md text-xs text-muted-foreground font-sans leading-relaxed">
            Test how your assistant answers customer questions using your
            verified knowledge base documents.
          </p>

          {/* Categorized Test Starter Cards */}
          <div className="mt-8 w-full max-w-2xl text-start">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-3 text-center sm:text-start">
              Select a customer inquiry to test:
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CATEGORIZED_STARTERS.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onSelectStarterQuery(item.query)}
                  className="group flex flex-col justify-between border border-border bg-card p-3.5 text-start transition-all hover:border-primary hover:bg-muted/30 rounded-none shadow-xs"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] text-primary font-semibold uppercase tracking-wider mb-2">
                    <span>{item.category}</span>
                    <ArrowUpRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p
                    className="text-xs text-foreground font-sans leading-relaxed line-clamp-2"
                    dir="auto"
                  >
                    {item.query}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Customer & Assistant Conversation Thread ── */}
      {messages.map((msg) => {
        const isUser = msg.role === "user";
        const currentFeedback = feedbackState[msg.id];

        if (isUser) {
          return (
            <div key={msg.id} className="flex flex-col items-end">
              <div className="w-full max-w-2xl border border-border bg-muted/40 p-4 transition-colors">
                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2 font-mono text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <User className="size-3.5 text-primary" />
                    <span className="font-sans">Customer</span>
                  </div>
                  <span>{msg.createdAt}</span>
                </div>
                <p
                  className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed"
                  dir="auto"
                >
                  {msg.content}
                </p>
              </div>
            </div>
          );
        }

        // Assistant Response
        return (
          <div key={msg.id} className="flex flex-col items-start">
            <div className="w-full max-w-2xl border border-border bg-card p-5 shadow-xs transition-colors">
              {/* Message Header */}
              <div className="flex flex-wrap items-center justify-between border-b border-border pb-3 mb-4 gap-2 font-sans text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
                    <Bot className="size-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        Sanad Assistant
                      </span>
                      <span className="size-1.5 bg-emerald-500 inline-block" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                    <Clock className="size-3 text-muted-foreground" />
                    <span>
                      {msg.metrics?.latencyMs
                        ? `${msg.metrics.latencyMs}ms`
                        : "Instant"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="flex items-center gap-1 border border-border bg-background px-2 py-1 font-sans text-[11px] text-muted-foreground hover:text-foreground transition-colors rounded-none"
                    title="Copy response text"
                  >
                    {copiedMessageId === msg.id ? (
                      <>
                        <Check className="size-3 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Message Content with Markdown Formatting */}
              <div
                className="text-sm text-foreground leading-relaxed font-sans space-y-3"
                dir="auto"
              >
                {msg.content.split("\n\n").map((paragraph, idx) => {
                  if (
                    paragraph.startsWith("- ") ||
                    paragraph.startsWith("* ")
                  ) {
                    const items = paragraph.split("\n").filter(Boolean);
                    return (
                      <ul
                        key={idx}
                        className="list-disc ps-5 space-y-1 text-sm text-foreground"
                      >
                        {items.map((it, i) => (
                          <li key={i}>{it.replace(/^[-*]\s+/, "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (/^\d+\.\s/.test(paragraph)) {
                    const items = paragraph.split("\n").filter(Boolean);
                    return (
                      <ol
                        key={idx}
                        className="list-decimal ps-5 space-y-1 text-sm text-foreground"
                      >
                        {items.map((it, i) => (
                          <li key={i}>{it.replace(/^\d+\.\s+/, "")}</li>
                        ))}
                      </ol>
                    );
                  }
                  return (
                    <p key={idx} className="whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Grounded Source Footnotes */}
              {msg.retrievedChunks && msg.retrievedChunks.length > 0 && (
                <div className="mt-5 border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <FileText className="size-3.5 text-primary" />
                      <span>
                        Referenced Sources ({msg.retrievedChunks.length}):
                      </span>
                    </span>
                    <span className="text-[10px] font-sans text-muted-foreground">
                      Click to view in side panel
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {msg.retrievedChunks.map((chunk, idx) => {
                      const matchPct = Math.round(chunk.similarity * 100);

                      return (
                        <button
                          key={chunk.id || idx}
                          type="button"
                          onClick={() => onSelectChunkForInspection(chunk)}
                          className="group flex items-center gap-2 border border-border bg-background px-2.5 py-1.5 text-start hover:border-primary transition-colors rounded-none"
                        >
                          <BookOpen className="size-3 text-primary shrink-0" />
                          <span className="font-sans text-xs text-foreground truncate max-w-[190px]">
                            {chunk.documentName || "Document"}
                          </span>
                          <span className="font-mono text-[10px] border border-border bg-muted/60 px-1 py-0.2 text-muted-foreground">
                            {matchPct}%
                          </span>
                          <ChevronRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Support Manager Quality Evaluation Footer */}
              <div className="mt-4 flex flex-wrap items-center justify-between border-t border-border/60 pt-3 gap-2 font-sans text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Answer grounded in knowledge base</span>
                </div>

                {/* Accuracy Feedback Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    Accurate?
                  </span>
                  <button
                    type="button"
                    onClick={() => handleFeedback(msg.id, "positive")}
                    className={`flex items-center gap-1 border px-2 py-1 transition-colors rounded-none ${
                      currentFeedback === "positive"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                    title="Mark answer as accurate and helpful"
                  >
                    <ThumbsUp className="size-3" />
                    <span>Yes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFeedback(msg.id, "negative")}
                    className={`flex items-center gap-1 border px-2 py-1 transition-colors rounded-none ${
                      currentFeedback === "negative"
                        ? "border-destructive bg-destructive/10 text-destructive font-medium"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                    title="Mark answer as needing review"
                  >
                    <ThumbsDown className="size-3" />
                    <span>No</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Natural Thinking / Formulation State ── */}
      {isRunning && (
        <div className="flex flex-col items-start w-full max-w-2xl">
          <div className="w-full border border-primary/30 bg-card p-5 animate-pulse">
            <div className="flex items-center gap-2 font-sans text-xs text-primary font-semibold mb-3">
              <Sparkles className="size-4 animate-spin" />
              <span>SEARCHING DOCUMENTS & WRITING ANSWER...</span>
            </div>

            <div className="space-y-2 font-sans text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="size-2 bg-primary inline-block" />
                <span>
                  Reading verified policy documents from your knowledge base...
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 bg-primary/70 inline-block" />
                <span>Matching customer question to exact clauses...</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 bg-primary/40 inline-block" />
                <span>Formulating a clear, helpful response...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
