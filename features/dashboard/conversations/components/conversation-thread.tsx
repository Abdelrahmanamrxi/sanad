"use client";

import React, { useState, useEffect } from "react";
import { ConversationItem, ConversationMessage } from "../types";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  FileText,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  ShieldCheck,
  UserPlus,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  FilePlusCorner,
  BookPlus,
  X,
  Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../actions";
import { formatMessageTime, calculatePerceivedMatch } from "../utils";
import { Input } from "@/components/ui/input";

interface ConversationThreadProps {
  conversation: ConversationItem;
  knowledgeState:boolean,
  setKnowledgeState:React.Dispatch<React.SetStateAction<boolean>>
}

export function ConversationThread({ conversation,knowledgeState,setKnowledgeState }: ConversationThreadProps) {
  const { data, error, isPending, refetch } = useQuery({
    queryFn: () =>
      getMessages({ conversationId: conversation.id, cursor: null, limit: 50 }),
    queryKey: ["messages", conversation.id],
    enabled: !!conversation.id ,
  });
  const [knowledgeQuestion, setKnowledgeQuestion] = useState<string>("");
  const [knowledgeAnswer, setKnowledgeAnswer] = useState<string>("");
  const [knowledgeCategory, setKnowledgeCategory] =
    useState<string>("Services");
  const [isSavingKnowledge, setIsSavingKnowledge] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && knowledgeState) {
        setKnowledgeState(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [knowledgeState]);

  const messages = data?.messages ?? [];
  // State for expanded source snippets
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);

  const toggleSource = (msgId: string) => {
    setExpandedSourceId((prev) => (prev === msgId ? null : msgId));
  };

  return (
    <div className="relative flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* ── Add to Knowledge Base Modal ── */}
      {knowledgeState && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setKnowledgeState(false);
            }
          }}
        >
          <div className="w-full max-w-lg border border-border bg-card p-5 sm:p-6 shadow-xl rounded-none space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-border pb-3.5">
              <div className="flex items-start gap-3">
                <div className="size-8 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 rounded-none mt-0.5">
                  <BookPlus className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading text-sm font-bold tracking-tight text-foreground">
                      Teach Sanad AI
                    </h3>
                    <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 border border-primary/30 bg-primary/10 text-primary font-semibold rounded-none">
                      Grounding Memory
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans mt-0.5">
                    Save official facts for this inquiry so Sanad answers future
                    visitors autonomously.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setKnowledgeState(false)}
                className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent hover:border-border transition-colors rounded-none shrink-0 cursor-pointer"
                aria-label="Close"
              >
                <X className="size-3.5" />
              </button>
            </div>

            {/* Context Telemetry Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground bg-muted/40 border border-border px-3 py-1.5 rounded-none flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-primary font-semibold">Ref:</span>
                <span>#{conversation.id.slice(0, 8)}</span>
              </div>
              {conversation.originPage && (
                <span className="truncate max-w-[220px]">
                  Origin: {conversation.originPage}
                </span>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              {/* Question / Trigger Topic */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Customer Inquiry / Question</span>
                  <span className="text-[10px] font-sans font-normal text-muted-foreground/80">
                    What visitor asked
                  </span>
                </label>
                <input
                  disabled={true}
                  type="text"
                  value={knowledgeQuestion}
                  onChange={(e) => setKnowledgeQuestion(e.target.value)}
                  className="w-full bg-muted/40 font-mono border border-border px-3 py-2 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none rounded-none transition-colors"
                />
              </div>

              {/* Verified Official Answer */}
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  <span>Official Verified Answer</span>
                  <span className="text-[10px] font-sans font-normal text-muted-foreground/80">
                    Grounded facts
                  </span>
                </label>
                <textarea
                  rows={4}
                  value={knowledgeAnswer}
                  onChange={(e) => setKnowledgeAnswer(e.target.value)}
                  placeholder="Enter the exact, verified facts or procedure details. Sanad will strictly cite this official answer without hallucinating."
                  className="w-full bg-background border border-border p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none rounded-none resize-none leading-relaxed transition-colors font-sans"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  Knowledge Domain / Category
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    "General",
                    "Pricing",
                    "Services",
                    "Schedule",
                    "Policies",
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setKnowledgeCategory(cat)}
                      className={cn(
                        "px-2.5 py-1 text-[11px] font-mono border transition-colors cursor-pointer rounded-none",
                        knowledgeCategory === cat
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Guardrail Note */}
            <div className="flex items-start gap-2.5 p-2.5 bg-primary/5 border border-primary/20 rounded-none text-[11px] text-muted-foreground">
              <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-foreground font-semibold">
                  Strict Guardrails:
                </strong>{" "}
                Sanad will index this entry into your verified knowledge base
                with 100% citation grounding.
              </p>
            </div>

            {/* Success alert if saved */}
            {saveSuccess && (
              <div className="flex items-center gap-2 p-2.5 bg-success/10 border border-success/30 text-success text-xs font-mono rounded-none">
                <Check className="size-3.5" />
                <span>
                  Knowledge indexed successfully! Assistant memory updated.
                </span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setKnowledgeState(false)}
                className="rounded-none cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!knowledgeAnswer.trim() || isSavingKnowledge}
                onClick={async () => {
                  setIsSavingKnowledge(true);
                  // Simulate or handle saving
                  await new Promise((res) => setTimeout(res, 600));
                  setIsSavingKnowledge(false);
                  setSaveSuccess(true);
                  setTimeout(() => {
                    setKnowledgeState(false);
                    setSaveSuccess(false);
                  }, 1200);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-none cursor-pointer text-xs flex items-center gap-1.5"
              >
                {isSavingKnowledge ? (
                  <>
                    <RefreshCw className="size-3.5 animate-spin" />
                    <span>Syncing Knowledge...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check className="size-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    <span>Save & Teach AI</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {conversation.summary && (
          <div className="border border-border/80 bg-card/80 p-3.5 flex items-start gap-3 rounded-none shadow-xs">
            <div className="size-6 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 rounded-none mt-0.5">
              <Sparkles className="size-3.5" />
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary">
                  AI Summary
                </span>
                {conversation.originPage && (
                  <span className="text-[10px] font-mono text-muted-foreground border border-border px-1 py-0.2 bg-muted/40">
                    Started on: {conversation.originPage}
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                {conversation.summary}
              </p>
            </div>
          </div>
        )}

        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <span className="relative bg-background px-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Chat Transcript
          </span>
        </div>

        <div className="space-y-4">
          {error ? (
            <div className="py-14 px-4 flex flex-col items-center justify-center text-center space-y-3">
              <div className="size-8 bg-destructive/10 border border-destructive/20 flex items-center justify-center rounded-none text-destructive">
                <AlertCircle className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">
                  Failed to load conversation transcript
                </p>
                <p className="text-[11px] text-muted-foreground max-w-xs">
                  {(error as Error)?.message ||
                    "An error occurred while fetching the messages for this conversation."}
                </p>
              </div>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-muted/60 hover:bg-muted border border-border text-foreground transition-colors cursor-pointer rounded-none mt-1"
              >
                <RefreshCw className="size-3" />
                <span>Retry</span>
              </button>
            </div>
          ) : isPending ? (
            <div className="space-y-4 pt-2">
              {/* AI bubble skeleton */}
              <div className="flex flex-col gap-1.5 max-w-[80%] me-auto animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="size-3.5 bg-muted rounded-none" />
                  <div className="h-3 w-20 bg-muted/70 rounded-none" />
                  <div className="h-2.5 w-12 bg-muted/40 rounded-none" />
                </div>
                <div className="p-3.5 bg-primary/5 border border-primary/20 space-y-2 rounded-none w-full">
                  <div className="h-3 w-full bg-muted/60 rounded-none" />
                  <div className="h-3 w-5/6 bg-muted/50 rounded-none" />
                  <div className="h-3 w-2/3 bg-muted/40 rounded-none" />
                </div>
              </div>

              {/* Visitor bubble skeleton */}
              <div className="flex flex-col gap-1.5 max-w-[65%] ms-auto animate-pulse items-end">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-12 bg-muted/40 rounded-none" />
                  <div className="h-3 w-16 bg-muted/70 rounded-none" />
                </div>
                <div className="p-3.5 bg-card border border-border space-y-2 rounded-none w-full">
                  <div className="h-3 w-full bg-muted/60 rounded-none" />
                  <div className="h-3 w-3/4 bg-muted/40 rounded-none" />
                </div>
              </div>

              {/* AI bubble skeleton with source pill */}
              <div className="flex flex-col gap-1.5 max-w-[85%] me-auto animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="size-3.5 bg-muted rounded-none" />
                  <div className="h-3 w-20 bg-muted/70 rounded-none" />
                  <div className="h-2.5 w-12 bg-muted/40 rounded-none" />
                </div>
                <div className="p-3.5 bg-primary/5 border border-primary/20 space-y-2 rounded-none w-full">
                  <div className="h-3 w-full bg-muted/60 rounded-none" />
                  <div className="h-3 w-4/5 bg-muted/50 rounded-none" />
                </div>
                <div className="h-6 w-48 bg-muted/50 border border-border rounded-none mt-1" />
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center text-muted-foreground space-y-2">
              <MessageSquare className="size-8 stroke-1 text-muted-foreground/30" />
              <p className="text-xs font-mono text-muted-foreground">
                No messages recorded in this conversation yet.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.role === "user";
              const isSourceOpen = expandedSourceId === msg.id;

              const hasLeadForm =
                msg.hasLeadFormTrigger ||
                Boolean(
                  msg.content &&
                  /\[\[\s*show[_\s-]?lead[_\s-]?form\s*\]\]/i.test(msg.content),
                );

              const cleanContent = (msg.content || "")
                .replace(/\[\[\s*show[_\s-]?lead[_\s-]?form\s*\]\]/gi, "")
                .trim();

              const matchPercent = msg.source
                ? calculatePerceivedMatch(msg.source.similarity)
                : 0;

              return (
                <React.Fragment key={msg.id}>
                  {msg.isLeadCaptureEvent && (
                    <div className="my-3 flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-mono rounded-none">
                        <CheckCheck className="size-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Contact info verified & lead captured</span>
                        {msg.capturedData?.email && (
                          <span className="font-semibold text-foreground">
                            ({msg.capturedData.email})
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    className={cn(
                      "flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]",
                      isUser ? "ms-auto items-end" : "me-auto items-start",
                    )}
                  >
                    <div className="flex items-center gap-2 px-1 text-[11px] text-muted-foreground font-mono">
                      {isUser ? (
                        <>
                          <span>{conversation.lead?.name || "Visitor"}</span>
                          <span>•</span>
                          <span>{formatMessageTime(msg.createdAt)}</span>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1 font-semibold text-primary">
                            <Bot className="size-3" />
                            <span>Sanad AI</span>
                          </div>
                          <span>•</span>
                          <span>{formatMessageTime(msg.createdAt)}</span>
                        </>
                      )}
                    </div>

                    {cleanContent && (
                      <div
                        className={cn(
                          "p-3.5 text-xs sm:text-sm leading-relaxed border rounded-none whitespace-pre-wrap select-text",
                          isUser
                            ? "bg-card border-border text-foreground shadow-2xs"
                            : "bg-primary/5 border-primary/20 text-foreground",
                        )}
                        dir="auto"
                      >
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="whitespace-pre-wrap leading-relaxed mb-3 last:mb-0 ">
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
                              <li className="leading-relaxed">{children}</li>
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
                    )}

                    {hasLeadForm && (
                      <div className="flex flex-col gap-2">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-mono rounded-none self-start mt-0.5">
                          <UserPlus className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>AI requested lead capture form</span>
                        </div>
                        <Button
                          onClick={() => {
                            const currIdx = messages.findIndex(
                              (m) => m.id === msg.id,
                            );
                            const prevUser = messages
                              .slice(0, currIdx)
                              .reverse()
                              .find((m) => m.role === "user");

                            setKnowledgeQuestion(prevUser?.content || "");
                            setKnowledgeAnswer("");
                            setSaveSuccess(false);
                            setKnowledgeState(true);
                          }}
                          variant={"outline"}
                          className={
                            "flex mt-2 flex-row gap-2 items-center rounded-none cursor-pointer text-xs"
                          }
                        >
                          Add to AI&apos;s Knowledge Base{" "}
                          <FilePlusCorner className="size-3.5" />
                        </Button>
                      </div>
                    )}

                    {/* Only show citation when the AI actually answered from the document, not when it escalated / couldn't find the answer */}
                    {msg.source && !hasLeadForm && (
                      <div className="flex flex-col gap-1.5 w-full mt-1">
                        <button
                          onClick={() => toggleSource(msg.id)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground bg-muted/50 border border-border px-2 py-1 transition-colors self-start cursor-pointer rounded-none"
                        >
                          <FileText className="size-3 text-primary" />
                          <span className="truncate max-w-[200px] sm:max-w-[300px]">
                            {msg.source.documentName}
                          </span>
                          <span className="text-primary font-bold">
                            {matchPercent}% match
                          </span>
                          {isSourceOpen ? (
                            <ChevronUp className="size-3 ms-1" />
                          ) : (
                            <ChevronDown className="size-3 ms-1" />
                          )}
                        </button>

                        {isSourceOpen && msg.source.chunkSnippet && (
                          <div className="p-2.5 bg-muted/40 border border-border text-[11px] text-muted-foreground font-sans leading-normal rounded-none space-y-1">
                            <div className="text-[10px] font-mono uppercase text-primary font-semibold">
                              Retrieved Document Excerpt:
                            </div>
                            <p className="italic">
                              &quot;{msg.source.chunkSnippet}&quot;
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>

      <div className="border-t border-border bg-card/60 px-4 py-2.5 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <ShieldCheck className="size-3.5 text-primary" />
          <span>Read-only transcript • Recorded from Sanad Website Widget</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/80 hidden sm:inline-block">
          {messages.length} messages exchanged
        </span>
      </div>
    </div>
  );
}
