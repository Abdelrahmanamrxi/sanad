"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquareCode,
  SlidersHorizontal,
  Code2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Bot,
} from "lucide-react";



export function ConversationsEmptyState() {
  const [copied, setCopied] = useState(false);

  const appOrigin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://sanad.app";


  return (
    <div className="h-[calc(100vh-6.5rem)] min-h-[580px] border border-border bg-card flex flex-col justify-center items-center p-6 sm:p-10 text-center rounded-none shadow-xs relative overflow-y-auto">
      {/* Background Decorative Tech Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Top Icon Badge */}
        <div className="size-14 border border-primary/30 bg-primary/10 text-primary flex items-center justify-center rounded-none mb-5">
          <MessageSquareCode className="size-7 stroke-[1.75]" />
        </div>

        {/* Header Text */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-border bg-muted/40 text-[10px] font-mono uppercase tracking-wider text-muted-foreground rounded-none mb-1">
            <span className="size-1.5 bg-primary rounded-none inline-block" />
            <span>Live Inbox Ready</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
            No visitor conversations yet
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg font-sans leading-relaxed">
            Your AI assistant is configured and ready. Embed the widget on your
            website or storefront to start engaging visitors, answering questions in
            Egyptian Arabic & English, and capturing leads in real time.
          </p>
        </div>

        {/* 3 Step Action Blueprint */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-start mb-6">
          <div className="border border-border bg-background/60 p-4 rounded-none space-y-2 hover:border-foreground/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="size-7 border border-border bg-muted/30 flex items-center justify-center text-muted-foreground rounded-none">
                <SlidersHorizontal className="size-3.5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                STEP 01
              </span>
            </div>
            <h3 className="font-heading font-semibold text-xs text-foreground">
              Style Your Widget
            </h3>
            <p className="text-[11px] text-muted-foreground leading-normal font-sans">
              Choose brand colors, assistant persona, and greeting messages in Widget Studio.
            </p>
          </div>

          <div className="border border-border bg-background/60 p-4 rounded-none space-y-2 hover:border-foreground/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="size-7 border border-border bg-muted/30 flex items-center justify-center text-muted-foreground rounded-none">
                <Code2 className="size-3.5" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                STEP 02
              </span>
            </div>
            <h3 className="font-heading font-semibold text-xs text-foreground">
              Embed on Website
            </h3>
            <p className="text-[11px] text-muted-foreground leading-normal font-sans">
              Paste the 1-line script tag into your Salla, Shopify, WordPress, or custom site.
            </p>
          </div>

          <div className="border border-border bg-background/60 p-4 rounded-none space-y-2 hover:border-foreground/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="size-7 border border-border bg-muted/30 flex items-center justify-center text-muted-foreground rounded-none">
                <Sparkles className="size-3.5 text-primary" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                STEP 03
              </span>
            </div>
            <h3 className="font-heading font-semibold text-xs text-foreground">
              See Live Chats & Leads
            </h3>
            <p className="text-[11px] text-muted-foreground leading-normal font-sans">
              Visitor questions, AI answers, and customer phone numbers stream directly here.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard/widget"
            className="h-10 px-5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-sans  font-semibold tracking-wider inline-flex items-center gap-2 transition-colors rounded-none cursor-pointer"
          >
            <SlidersHorizontal className="size-3.5" />
            <span>Configure & Embed Widget</span>
            <ArrowRight className="size-3.5" />
          </Link>

          <Link
            href="/dashboard/playground"
            className="h-10 px-4 border border-border bg-background hover:bg-muted/50 text-foreground text-xs font-sans  font-semibold tracking-wider inline-flex items-center gap-2 transition-colors rounded-none cursor-pointer"
          >
            <Bot className="size-3.5" />
            <span>Test in Playground</span>
            <ExternalLink className="size-3" />
          </Link>

        </div>
      </div>
    </div>
  );
}

