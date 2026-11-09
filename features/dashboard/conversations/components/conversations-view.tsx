"use client";

import React, { useState, useMemo } from "react";
import { ConversationItem, FilterTab } from "../types";
import { ConversationsList } from "./conversations-list";
import { ConversationHeader } from "./conversation-header";
import { ConversationThread } from "./conversation-thread";
import { ConversationsEmptyState } from "./conversations-empty-state";
import { MessageSquare, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/use-debounce";
import { getConversations } from "../actions";

export function ConversationsView() {
  const [selectedId, setSelectedId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const title = useDebounce(searchQuery, 400);

  const { data, error, isPending, isRefetching, refetch } = useQuery({
    queryKey: ["conversations", title],
    queryFn: () =>
      getConversations({
        filter: "all",
        title,
        cursor: null,
        limit: 50,
      }),
  });

  const conversations = (data?.conversations ?? []) as ConversationItem[];
  // Filtering conversations based on active tab and search query
  const filteredConversations = useMemo((): ConversationItem[] => {
    return conversations.filter((conv) => {
      // Tab filter
      if (activeTab === "leads" && !conv.hasLead) return false;
      if (activeTab === "needs_attention" && conv.status !== "needs_attention")
        return false;
      if (activeTab === "resolved" && conv.status !== "resolved") return false;
      if (activeTab === "human_resolved" && conv.status !== "human_resolved")
        return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = conv.title.toLowerCase().includes(q);

        const matchesLeadName =
          conv.lead?.name.toLowerCase().includes(q) || false;
        const matchesLeadEmail =
          conv.lead?.email.toLowerCase().includes(q) || false;

        return matchesTitle || matchesLeadName || matchesLeadEmail;
      }

      return true;
    });
  }, [conversations, activeTab, searchQuery]);

  // Ensure selected conversation exists or fallback to first
  const currentConversation = useMemo((): ConversationItem | null => {
    if (conversations.length === 0) return null;
    const found = conversations.find((c) => c.id === selectedId);
    if (found) return found;
    return filteredConversations[0] || conversations[0] || null;
  }, [conversations, filteredConversations, selectedId]);

  // 1. Initial Loading Skeleton
  if (isPending) {
    return (
      <div className="h-[calc(100vh-6.5rem)] min-h-[550px] border border-border bg-card flex flex-col md:flex-row overflow-hidden rounded-none shadow-xs">
        {/* Left Column Skeleton */}
        <div className="w-full md:w-[340px] lg:w-[380px] shrink-0 h-full border-r border-border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-6 w-32 bg-muted/60 rounded-none animate-pulse" />
            <div className="h-5 w-8 bg-muted/50 rounded-none animate-pulse" />
          </div>
          <div className="h-8 w-full bg-muted/40 rounded-none animate-pulse" />
          <div className="flex gap-2">
            <div className="h-6 w-12 bg-muted/50 rounded-none animate-pulse" />
            <div className="h-6 w-16 bg-muted/50 rounded-none animate-pulse" />
            <div className="h-6 w-20 bg-muted/50 rounded-none animate-pulse" />
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-3 border border-border/40 bg-muted/20 space-y-2 rounded-none animate-pulse"
              >
                <div className="flex justify-between">
                  <div className="h-3.5 w-28 bg-muted/60 rounded-none" />
                  <div className="h-3 w-12 bg-muted/40 rounded-none" />
                </div>
                <div className="h-3 w-44 bg-muted/40 rounded-none" />
                <div className="h-2.5 w-20 bg-muted/30 rounded-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="flex-1 min-w-0 flex flex-col h-full bg-background p-6 space-y-4 animate-pulse">
          <div className="h-10 w-1/3 bg-muted/60 rounded-none" />
          <div className="h-16 w-full bg-muted/30 border border-border/40 rounded-none" />
          <div className="space-y-4 pt-6 flex-1">
            <div className="h-12 w-2/5 ms-auto bg-muted/50 rounded-none" />
            <div className="h-20 w-3/5 me-auto bg-muted/40 rounded-none" />
            <div className="h-14 w-1/2 ms-auto bg-muted/50 rounded-none" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Query Error State
  if (error && conversations.length === 0) {
    return (
      <div className="h-[calc(100vh-6.5rem)] min-h-[550px] border border-border bg-card flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-none shadow-xs">
        <div className="size-12 bg-destructive/10 border border-destructive/30 flex items-center justify-center rounded-none text-destructive">
          <AlertCircle className="size-6" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="font-heading font-semibold text-base text-foreground">
            Failed to load conversations
          </h3>
          <p className="text-xs text-muted-foreground font-sans leading-relaxed">
            {(error as Error)?.message ||
              "An error occurred while loading your inbox. Please check your connection and try again."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="h-9 px-4 bg-primary text-primary-foreground text-xs font-mono uppercase font-semibold tracking-wider inline-flex items-center gap-2 hover:bg-primary/90 transition-colors rounded-none cursor-pointer"
        >
          <RefreshCw className="size-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // 3. Fallback Empty State: No Conversations in Workspace Yet
  if (conversations.length === 0) {
    return (
      <ConversationsEmptyState
      />
    );
  }

  return (
    <div className="h-[calc(100vh-6.5rem)] min-h-[550px] border border-border bg-card flex flex-col md:flex-row overflow-hidden rounded-none shadow-xs">
      {/* Left Column: Conversations and Leads Inbox */}
      <div className="w-full md:w-[340px] lg:w-[380px] shrink-0 h-full overflow-hidden">
        <ConversationsList
          conversations={filteredConversations}
          allConversations={conversations}
          selectedId={currentConversation?.id || ""}
          onSelect={(id) => setSelectedId(id)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoading={isPending}
          isError={Boolean(error)}
          onRetry={() => refetch()}
        />
      </div>

      {/* Right Column: Active Conversation Viewer */}
      <div className="flex-1 min-w-0 flex flex-col h-full bg-background overflow-hidden">
        {currentConversation ? (
          <>
            <ConversationHeader conversation={currentConversation} />
            <ConversationThread conversation={currentConversation} />
          </>
        ) : isPending ? (
          <div className="flex-1 flex flex-col h-full animate-pulse p-6 space-y-4">
            <div className="h-10 w-2/3 bg-muted/60 rounded-none" />
            <div className="h-20 w-full bg-muted/40 rounded-none border border-border/40" />
            <div className="space-y-3 pt-4">
              <div className="h-12 w-1/2 ms-auto bg-muted/50 rounded-none" />
              <div className="h-24 w-3/4 me-auto bg-muted/50 rounded-none" />
              <div className="h-12 w-2/5 ms-auto bg-muted/50 rounded-none" />
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="size-9 bg-destructive/10 border border-destructive/20 flex items-center justify-center rounded-none text-destructive">
              <AlertCircle className="size-4" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-medium text-sm text-foreground">
                Unable to load conversation
              </h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                {(error as Error)?.message ||
                  "A network or server error occurred while retrieving conversations."}
              </p>
            </div>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-muted/60 hover:bg-muted border border-border text-foreground transition-colors cursor-pointer rounded-none"
            >
              <RefreshCw className="size-3" />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <MessageSquare className="size-10 stroke-1 mb-2 text-muted-foreground/50" />
            <h3 className="font-heading font-medium text-sm text-foreground">
              No conversation selected
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs mt-1">
              Select a conversation from the left to view the complete customer
              transcript and lead details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
