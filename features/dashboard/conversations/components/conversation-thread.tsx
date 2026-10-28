"use client";

import React, { useState } from "react";
import { ConversationItem, ConversationMessage } from "../types";
import {
  Sparkles,
  FileText,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Bot,
  User,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationThreadProps {
  conversation: ConversationItem;
}

export function ConversationThread({ conversation }: ConversationThreadProps) {
  // State for expanded source snippets
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);

  const toggleSource = (msgId: string) => {
    setExpandedSourceId((prev) => (prev === msgId ? null : msgId));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* Scrollable messages container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {/* 1-Sentence AI Executive Summary Card */}
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

        {/* Date divider */}
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/50" />
          </div>
          <span className="relative bg-background px-3 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            Chat Transcript
          </span>
        </div>

        {/* Message Feed */}
        <div className="space-y-4">
          {conversation.messages.map((msg) => {
            const isUser = msg.role === "user";
            const isSourceOpen = expandedSourceId === msg.id;

            return (
              <React.Fragment key={msg.id}>
                {/* Lead Captured Inline Event Marker */}
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

                {/* Message Bubble Item */}
                <div
                  className={cn(
                    "flex flex-col gap-1 max-w-[85%] sm:max-w-[75%]",
                    isUser ? "ms-auto items-end" : "me-auto items-start"
                  )}
                >
                  {/* Sender Label & Timestamp */}
                  <div className="flex items-center gap-2 px-1 text-[11px] text-muted-foreground font-mono">
                    {isUser ? (
                      <>
                        <span>{conversation.lead?.name || "Visitor"}</span>
                        <span>•</span>
                        <span>{msg.createdAt}</span>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1 font-semibold text-primary">
                          <Bot className="size-3" />
                          <span>Sanad AI</span>
                        </div>
                        <span>•</span>
                        <span>{msg.createdAt}</span>
                      </>
                    )}
                  </div>

                  {/* Message Content Bubble (Strictly Sharp) */}
                  <div
                    className={cn(
                      "p-3.5 text-xs sm:text-sm leading-relaxed border rounded-none whitespace-pre-wrap select-text",
                      isUser
                        ? "bg-card border-border text-foreground shadow-2xs"
                        : "bg-primary/5 border-primary/20 text-foreground"
                    )}
                    dir="auto"
                  >
                    {msg.content}
                  </div>

                  {/* Source Citation Chip (For Assistant Answers) */}
                  {msg.source && (
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
                          {Math.round(msg.source.similarity * 100)}% match
                        </span>
                        {isSourceOpen ? (
                          <ChevronUp className="size-3 ms-1" />
                        ) : (
                          <ChevronDown className="size-3 ms-1" />
                        )}
                      </button>

                      {/* Expandable Chunk Snippet Preview */}
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
          })}
        </div>
      </div>

      {/* Read-Only Informational Footer (No Input Bar) */}
      <div className="border-t border-border bg-card/60 px-4 py-2.5 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <ShieldCheck className="size-3.5 text-primary" />
          <span>Read-only transcript • Recorded from Sanad Website Widget</span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground/80 hidden sm:inline-block">
          {conversation.messages.length} messages exchanged
        </span>
      </div>
    </div>
  );
}
