"use client";

import React from "react";
import { ConversationItem, FilterTab } from "../types";
import {
  Search,
  User,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatChatTimestamp } from "../utils";

interface ConversationsListProps {
  conversations: ConversationItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function ConversationsList({
  conversations,
  selectedId,
  onSelect,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  isLoading = false,
  isError = false,
  onRetry,
}: ConversationsListProps) {
  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: conversations.length },
    { key: "leads", label: "Leads", count: conversations.filter((c) => c.hasLead).length },
    {
      key: "needs_attention",
      label: "Needs Review",
      count: conversations.filter((c) => c.status === "needs_attention").length,
    },
    { key: "resolved", label: "Resolved", count: conversations.filter((c) => c.status === "resolved").length },
  ];

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Top Header & Search */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-base text-foreground tracking-tight">
              Conversations
            </h2>
            <span className="text-xs font-mono font-medium px-1.5 py-0.5 bg-muted text-muted-foreground border border-border">
              {isLoading ? "..." : conversations.length}
            </span>
          </div>
        </div>

        {/* Search input with sharp edges */}
        <div className="relative">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search topic, visitor, or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-background border border-border ps-9 pe-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary rounded-none"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 border-b border-border/60 pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium tracking-tight transition-colors flex items-center gap-1.5 border-b-2 -mb-[5px] rounded-none cursor-pointer",
                  isActive
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "text-[10px] font-mono px-1 py-0.2",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/40">
        {isError ? (
          <div className="p-6 text-center flex flex-col items-center justify-center space-y-3">
            <div className="size-8 bg-destructive/10 border border-destructive/20 flex items-center justify-center rounded-none text-destructive">
              <AlertCircle className="size-4" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">
                Failed to load conversations
              </p>
              <p className="text-[11px] text-muted-foreground">
                An error occurred while loading your conversation inbox.
              </p>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-muted/60 hover:bg-muted border border-border text-foreground transition-colors cursor-pointer rounded-none"
              >
                <RefreshCw className="size-3" />
                <span>Retry</span>
              </button>
            )}
          </div>
        ) : isLoading ? (
          <div className="p-3 space-y-2.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="p-3 border border-border/60 bg-muted/15 flex flex-col gap-2 rounded-none animate-pulse"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="h-3 w-28 bg-muted/70 rounded-none" />
                  <div className="h-2.5 w-12 bg-muted/50 rounded-none" />
                </div>
                <div className="h-3.5 w-4/5 bg-muted/80 rounded-none" />
                <div className="h-2.5 w-1/2 bg-muted/50 rounded-none" />
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="h-3 w-16 bg-muted/60 rounded-none" />
                  <div className="h-3 w-24 bg-muted/40 rounded-none" />
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs">
            No conversations match your filter criteria.
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = conv.id === selectedId;

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "w-full text-start p-3.5 transition-all flex flex-col gap-2 rounded-none cursor-pointer border-s-4",
                  isSelected
                    ? "bg-primary/5 border-s-primary shadow-xs"
                    : "bg-transparent border-s-transparent hover:bg-muted/40"
                )}
              >
                {/* Header line: Lead badge or visitor id + Timestamp */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    {conv.hasLead ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/40 rounded-none shrink-0">
                        <Sparkles className="size-3" />
                        NEW LEAD
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                        <User className="size-3" />
                        Visitor # {conv.visitorId.slice(0,13)}
                      </span>
                    )}

                    {conv.lead && (
                      <span className="font-semibold text-xs text-foreground truncate">
                        {conv.lead.name}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                    {formatChatTimestamp(conv.lastMessageAt)}
                  </span>
                </div>

                {/* Topic / Title */}
                <div className="font-heading font-medium text-xs text-foreground line-clamp-1">
                  {conv.title}
                </div>

                {/* Email / Lead context or message snippet */}
                <div className="text-[11px] text-muted-foreground line-clamp-1">
                  {conv.hasLead && conv.lead && (
                    <span className="font-mono text-[11px] text-primary dark:text-primary">
                      {conv.lead.email}
                    </span>
                  )}
                </div>

                {/* Status & Origin Page chips */}
                <div className="flex items-center gap-2 pt-1">
                  {conv.status === "needs_attention" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 border border-amber-500/20 rounded-none">
                      <AlertTriangle className="size-2.5" />
                      Needs Review
                    </span>
                  )}
                  {conv.status === "contacted" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20 rounded-none">
                      <Check className="size-2.5" />
                      Contacted
                    </span>
                  )}
                  {conv.status === "resolved" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/20 rounded-none">
                      <CheckCircle2 className="size-2.5" />
                      Resolved
                    </span>
                  )}
                  {conv.status === "active" && !conv.hasLead && (
                    <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 border border-border rounded-none">
                      Active
                    </span>
                  )}

                  {conv.originPage && (
                    <span className="text-[10px] font-mono text-muted-foreground truncate max-w-[130px]">
                      Page: {conv.originPage}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
