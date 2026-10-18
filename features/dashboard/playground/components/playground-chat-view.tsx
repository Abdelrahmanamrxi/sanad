"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  FileText,
  ChevronRight,
  Zap,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Clock,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { PlaygroundMessage, PlaygroundChunk } from "../types";
import { CATEGORIZED_STARTERS, calibrateSimilarity } from "../constants";

interface PlaygroundChatViewProps {
  messages: PlaygroundMessage[];
  isRunning: boolean;
  activeKbPrompt: string | null;
  onRunKbPrompt: (prompt: string) => void;
  onDismissKbPrompt: () => void;
  onSelectStarterQuery: (query: string) => void;
  onSelectChunkForInspection: (chunk: PlaygroundChunk) => void;
  onFeedbackChange?: (messageId: string, feedback: "positive" | "negative") => void;
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
  const [feedbackState, setFeedbackState] = useState<Record<string, "positive" | "negative">>({});

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const prevMessagesLengthRef = useRef(messages.length);

  // Smooth scroll to bottom function
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
    });
  };

  // Smart auto-scroll: sticks to bottom during streaming, but pauses if user scrolls up
  useEffect(() => {
    const isNewMessage = messages.length > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = messages.length;

    // When a brand new message is sent, force scroll to bottom
    if (isNewMessage) {
      isAtBottomRef.current = true;
      scrollToBottom("smooth");
      return;
    }

    // While streaming tokens, only scroll if user is already at the bottom
    if (isAtBottomRef.current && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isRunning]);

  // Track if user has scrolled away from the bottom to allow free scrolling
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    isAtBottomRef.current = distanceToBottom <= 80;
  };

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
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="relative flex flex-1 flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] bg-background/85 scroll-smooth"
    >
      {/* ── Centered Container for Maximum Visual Clarity & Spaciousness ── */}
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* ── Active Knowledge Base Handoff Banner ── */}
        {activeKbPrompt && (
          <div className="relative border border-primary/40 bg-card p-4 shadow-xs border-s-3 border-s-primary transition-all">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center border border-primary/30 bg-primary/20 text-primary">
                  <Sparkles className="size-4" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
                    Question Selected From Knowledge Base
                  </span>
                  <p className="mt-1 font-sans text-sm font-medium text-foreground" dir="auto">
                    {activeKbPrompt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => onRunKbPrompt(activeKbPrompt)}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 border border-primary bg-primary px-3 py-1.5 font-sans text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 rounded-none shadow-2xs"
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

        {/* ── Clean & Architectural Empty State ── */}
        {messages.length === 0 && !isRunning && (
          <div className="relative my-auto flex flex-col items-center justify-center py-12 text-center">
            {/* Studio Badge */}
            <div className="flex items-center gap-2 border border-border bg-card px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-4 shadow-2xs">
              <span className="size-1.5 bg-emerald-500 inline-block animate-pulse" />
              <span>Sanad Grounded Studio // Evaluation Sandbox</span>
            </div>

            <div className="relative flex size-14 items-center justify-center border border-primary/40 bg-card shadow-xs text-primary mb-3">
              <Bot className="size-7" />
              <span className="absolute -top-1 -right-1 size-2 bg-emerald-500 ring-2 ring-card" />
            </div>

            <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground font-sans">
              Test Customer Inquiries in Real Time
            </h2>
            <p className="mt-2 max-w-lg text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
              Verify how Sanad answers questions using only your approved knowledge base documents,
              strictly citing source clauses and matching your desired tone.
            </p>

            {/* Quick Test Starter Pills (Clean & Non-cluttered) */}
            <div className="mt-8 w-full max-w-2xl text-start">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick Verification Inquiries:
                </span>
                <span className="text-[10px] font-sans text-muted-foreground hidden sm:inline">
                  Click to test instantly
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CATEGORIZED_STARTERS.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onSelectStarterQuery(item.query)}
                    className="group flex flex-col justify-between border border-border bg-card p-3.5 text-start hover:border-primary hover:bg-muted/30 transition-all rounded-none shadow-2xs"
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] text-primary font-semibold uppercase tracking-wider mb-1.5">
                      <span className="border-b border-primary/30 pb-0.5">{item.category}</span>
                      <ArrowUpRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-xs text-foreground font-sans leading-relaxed line-clamp-2" dir="auto">
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
                <div className="w-full max-w-2xl border border-border bg-card p-4 transition-all shadow-xs border-e-3 border-e-muted-foreground/60">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2 font-mono text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-2 font-semibold text-foreground">
                      <div className="flex size-5 items-center justify-center border border-border bg-muted font-mono text-[10px] text-muted-foreground">
                        <User className="size-3 text-muted-foreground" />
                      </div>
                      <span className="font-sans text-xs">Customer Inquiry</span>
                    </div>
                    <span>{msg.createdAt}</span>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed" dir="auto">
                    {msg.content}
                  </p>
                </div>
              </div>
            );
          }

          // Assistant Response
          return (
            <div key={msg.id} className="flex flex-col items-start">
              <div className="w-full max-w-3xl border border-border bg-card p-5 sm:p-6 shadow-xs border-s-3 border-s-primary transition-all">
                {/* Message Header Ribbon */}
                <div className="flex flex-wrap items-center justify-between border-b border-border pb-3 mb-4 gap-2 font-sans text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-7 items-center justify-center border border-primary/40 bg-primary/10 text-primary">
                      <Bot className="size-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">Sanad Assistant</span>
                        <span className="size-1.5 bg-emerald-500 inline-block" />
                        <span className="border border-border bg-background px-1.5 py-0.2 font-mono text-[9px] text-muted-foreground">
                          Verified Grounding
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                      <Clock className="size-3 text-muted-foreground" />
                      <span>{msg.metrics?.latencyMs ? `${msg.metrics.latencyMs}ms` : "Instant"}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 border border-border bg-background px-2 py-1 font-sans text-[11px] text-muted-foreground hover:text-foreground transition-colors rounded-none shadow-2xs cursor-pointer"
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

                {/* Structured Markdown Content with Tables, Bold & Headings */}
                <div className="text-sm text-foreground leading-relaxed font-sans" dir="auto">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="whitespace-pre-wrap leading-relaxed mb-3 last:mb-0">
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-foreground">
                          {children}
                        </strong>
                      ),
                      table: ({ children }) => (
                        <div className="my-3 w-full overflow-x-auto border border-border bg-card rounded-none shadow-2xs">
                          <table className="w-full border-collapse text-xs text-foreground font-sans">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="border-b border-border bg-muted/60 text-foreground font-semibold">
                          {children}
                        </thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody className="divide-y divide-border/60">
                          {children}
                        </tbody>
                      ),
                      tr: ({ children }) => (
                        <tr className="hover:bg-muted/30 transition-colors">
                          {children}
                        </tr>
                      ),
                      th: ({ children }) => (
                        <th className="border-e border-border last:border-e-0 px-3 py-2 text-start font-medium text-foreground">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border-e border-border last:border-e-0 px-3 py-2 text-start text-foreground/90 leading-relaxed align-top">
                          {children}
                        </td>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc ps-5 space-y-1.5 my-2.5">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal ps-5 space-y-1.5 my-2.5">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed">
                          {children}
                        </li>
                      ),
                      h1: ({ children }) => (
                        <h1 className="font-heading text-base font-bold text-foreground mt-3 mb-1.5">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="font-heading text-sm font-bold text-foreground mt-3 mb-1.5">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-primary mt-2.5 mb-1">
                          {children}
                        </h3>
                      ),
                      code: ({ children }) => (
                        <code className="border border-border bg-muted/60 px-1 py-0.5 font-mono text-xs rounded-none text-foreground">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Grounded Source Footnotes */}
                {msg.retrievedChunks && msg.retrievedChunks.length > 0 && (
                  <div className="mt-5 border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <FileText className="size-3.5 text-primary" />
                        <span>Referenced Sources ({msg.retrievedChunks.length}):</span>
                      </span>
                      <span className="text-[10px] font-sans text-muted-foreground">
                        Click to view clause in Settings & Sources panel
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {msg.retrievedChunks.map((chunk, idx) => {
                        const matchPct = calibrateSimilarity(chunk.similarity);

                        return (
                          <button
                            key={chunk.id || idx}
                            type="button"
                            onClick={() => onSelectChunkForInspection(chunk)}
                            className="group flex items-center gap-2 border border-border bg-background px-2.5 py-1.5 text-start hover:border-primary transition-all rounded-none shadow-2xs cursor-pointer"
                          >
                            <BookOpen className="size-3 text-primary shrink-0" />
                            <span className="font-sans text-xs text-foreground truncate max-w-[210px]">
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
                    <span>Answer grounded in verified documents</span>
                  </div>

                  {/* Accuracy Feedback Buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">Accurate?</span>
                    <button
                      type="button"
                      onClick={() => handleFeedback(msg.id, "positive")}
                      className={`flex items-center gap-1 border px-2 py-1 transition-colors rounded-none shadow-2xs cursor-pointer ${
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
                      className={`flex items-center gap-1 border px-2 py-1 transition-colors rounded-none shadow-2xs cursor-pointer ${
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
          <div className="flex flex-col items-start w-full max-w-3xl">
            <div className="w-full border border-primary/40 bg-card p-5 border-s-3 border-s-primary shadow-xs animate-pulse">
              <div className="flex items-center gap-2 font-sans text-xs text-primary font-semibold mb-3">
                <Sparkles className="size-4 animate-spin" />
                <span>SEARCHING DOCUMENTS & WRITING ANSWER...</span>
              </div>

              <div className="space-y-2 font-sans text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-primary inline-block" />
                  <span>Reading verified policy documents from your knowledge base...</span>
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

        {/* Bottom scroll anchor */}
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  );
}
