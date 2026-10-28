"use client";

import React, { useState, useMemo } from "react";
import { ConversationItem, FilterTab } from "../types";
import { MOCK_CONVERSATIONS } from "../mock-data";
import { ConversationsList } from "./conversations-list";
import { ConversationHeader } from "./conversation-header";
import { ConversationThread } from "./conversation-thread";
import { MessageSquare } from "lucide-react";

export function ConversationsView() {
  const [conversations, setConversations] = useState<ConversationItem[]>(MOCK_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string>("conv-101");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filtering conversations based on active tab and search query
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      // Tab filter
      if (activeTab === "leads" && !conv.hasLead) return false;
      if (activeTab === "needs_attention" && conv.status !== "needs_attention") return false;
      if (activeTab === "resolved" && conv.status !== "resolved") return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = conv.title.toLowerCase().includes(q);
        const matchesVisitor = conv.visitorId.toLowerCase().includes(q);
        const matchesLeadName = conv.lead?.name.toLowerCase().includes(q) || false;
        const matchesLeadEmail = conv.lead?.email.toLowerCase().includes(q) || false;
        const matchesSnippet = conv.lastMessageSnippet.toLowerCase().includes(q);
        return matchesTitle || matchesVisitor || matchesLeadName || matchesLeadEmail || matchesSnippet;
      }

      return true;
    });
  }, [conversations, activeTab, searchQuery]);

  // Ensure selected conversation exists or fallback to first
  const currentConversation = useMemo(() => {
    const found = conversations.find((c) => c.id === selectedId);
    if (found) return found;
    return filteredConversations[0] || conversations[0];
  }, [conversations, filteredConversations, selectedId]);

  // Action handlers
  const handleToggleResolved = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === "resolved" ? "active" : "resolved";
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleToggleContacted = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === id && c.lead) {
          const nextStatus = c.lead.status === "contacted" ? "new" : "contacted";
          return {
            ...c,
            lead: { ...c.lead, status: nextStatus },
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] min-h-[550px] border border-border bg-card flex flex-col md:flex-row overflow-hidden rounded-none shadow-xs">
      {/* Left Column: Conversations and Leads Inbox */}
      <div className="w-full md:w-[340px] lg:w-[380px] shrink-0 h-full overflow-hidden">
        <ConversationsList
          conversations={filteredConversations}
          selectedId={currentConversation?.id || ""}
          onSelect={(id) => setSelectedId(id)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Right Column: Active Conversation Viewer */}
      <div className="flex-1 min-w-0 flex flex-col h-full bg-background overflow-hidden">
        {currentConversation ? (
          <>
            <ConversationHeader
              conversation={currentConversation}
              onToggleResolved={handleToggleResolved}
              onToggleContacted={handleToggleContacted}
            />
            <ConversationThread conversation={currentConversation} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <MessageSquare className="size-10 stroke-1 mb-2 text-muted-foreground/50" />
            <h3 className="font-heading font-medium text-sm text-foreground">
              No conversation selected
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs mt-1">
              Select a conversation from the left to view the complete customer transcript and lead details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
