"use client";

import React, { useState } from "react";
import { ConversationItem, ConversationStatus } from "../types";
import {
  Mail,
  Phone,
  Building2,
  Check,
  Copy,
  Globe,
  User,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { markResolved } from "../actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { formatChatTimestamp } from "../utils";

interface ConversationHeaderProps {
  conversation: ConversationItem;
  onBack?: () => void;
}

export function ConversationHeader({
  conversation,
  onBack,
}: ConversationHeaderProps) {
  const { t } = useTranslation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    mutate: updateStatus,
    isPending: isUpdating,
    variables: pendingStatus,
  } = useMutation({
    mutationFn: async (newStatus: ConversationStatus) => {
      return markResolved(conversation.id, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (err: unknown) => {
      console.error("[ConversationHeader] Failed to update status:", err);
    },
  });

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const isAIResolved = conversation.status === "resolved";
  const isHumanResolved = conversation.status === "human_resolved";
  const isNeedsAttention = conversation.status === "needs_attention";
  const isLead = Boolean(conversation.hasLead && conversation.lead);
  const isContacted =
    conversation.status === "contacted" ||
    Boolean(isLead && conversation.lead?.status === "contacted");

  return (
    <div className="border-b border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Customer / Visitor Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="md:hidden size-8 flex items-center justify-center border border-border bg-muted/40 hover:bg-muted text-foreground transition-colors shrink-0 rounded-none cursor-pointer"
              aria-label={t("dashboard.conversations.header.back", "Back to conversations")}
            >
              <ChevronLeft className="size-4 rtl:rotate-180" />
            </button>
          )}

          {/* Sharp avatar square */}
          <div className="size-9 sm:size-10 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-heading font-bold text-xs sm:text-sm shrink-0 rounded-none">
            {isLead ? (
              conversation.lead?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            ) : (
              <User className="size-4 sm:size-5 text-muted-foreground" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="font-heading font-bold text-xs sm:text-base text-foreground truncate max-w-[160px] sm:max-w-none">
                {isLead
                  ? conversation.lead?.name
                  : t("dashboard.conversations.header.visitor", {
                      id: conversation.visitorId.replace("vis-", ""),
                      defaultValue: `Visitor #${conversation.visitorId.replace("vis-", "")}`,
                    })}
              </h1>

              {isLead && (
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 border font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 rounded-none">
                  {isContacted
                    ? t("dashboard.conversations.status.contactedLead", "Contacted Lead")
                    : t("dashboard.conversations.status.newLead", "New Lead")}
                </span>
              )}

              {conversation.channel === "widget" && (
                <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5 bg-muted/40 rounded-none hidden sm:inline-block">
                  {t("dashboard.conversations.status.widgetChat", "Widget Chat")}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              {conversation.originPage && (
                <span className="flex items-center gap-1 font-mono text-[10px] sm:text-[11px]">
                  <Globe className="size-3 text-muted-foreground/80 shrink-0" />
                  {t("dashboard.conversations.header.origin", {
                    page: conversation.originPage,
                    defaultValue: `Origin: ${conversation.originPage}`,
                  })}
                </span>
              )}

              <span className="text-[10px] sm:text-[11px] font-mono">
                {t("dashboard.conversations.header.started", {
                  time: formatChatTimestamp(conversation.lastMessageAt),
                  defaultValue: `Started ${formatChatTimestamp(conversation.lastMessageAt)}`,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons & Status Indicators */}
        <div className="flex items-center gap-2 shrink-0 ms-auto sm:ms-0">
          {/* 1. Leads: Only show "Mark as Contacted" (NO "Mark as Resolved" button) */}
          {isLead && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateStatus(isContacted ? "human_resolved" : "contacted")}
              disabled={isUpdating}
              className="text-xs rounded-none border-border cursor-pointer h-8 px-2.5 sm:px-3"
            >
              {isUpdating && pendingStatus === "contacted" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Check
                  className={cn("size-3.5 me-1", isContacted && "text-emerald-600")}
                />
              )}
              {isContacted
                ? t("dashboard.conversations.status.contacted", "Contacted")
                : t("dashboard.conversations.status.markContacted", "Mark as Contacted")}
            </Button>
          )}

          {/* 2. Needs Attention (Needs Review): Button to Mark as Human Resolved */}
          {!isLead && isNeedsAttention && (
            <Button
              variant="default"
              size="sm"
              onClick={() => updateStatus("human_resolved")}
              disabled={isUpdating}
              className="text-xs rounded-none bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer h-8 px-2.5 sm:px-3"
            >
              {isUpdating && pendingStatus === "human_resolved" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="size-3.5 me-1.5" />
                  <span>{t("dashboard.conversations.status.markHumanResolved", "Mark as Human Resolved")}</span>
                </>
              )}
            </Button>
          )}

          {/* 3. Human Resolved: Displayed when manually resolved by human */}
          {!isLead && isHumanResolved && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium border border-primary/30 bg-primary/10 text-primary rounded-none">
              <CheckCircle2 className="size-3.5" />
              <span>{t("dashboard.conversations.status.human_resolved", "Human Resolved")}</span>
            </span>
          )}

          {/* 4. AI Resolved: Zero action buttons shown (AI already resolved it) */}
          {!isLead && isAIResolved && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium border border-success/30 bg-success/10 text-success rounded-none">
              <CheckCircle2 className="size-3.5" />
              <span>{t("dashboard.conversations.status.resolved", "AI Resolved")}</span>
            </span>
          )}
        </div>
      </div>

      {/* Pinned Lead Contact Details Bar (Only if Lead) */}
      {isLead && conversation.lead && (
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/50 text-xs text-muted-foreground">
          {conversation.lead.email && (
            <div className="flex items-center gap-1.5 font-mono text-[11px] bg-background border border-border px-2 py-1 rounded-none">
              <Mail className="size-3 text-primary" />
              <span className="text-foreground">{conversation.lead.email}</span>
              <button
                onClick={() => copyToClipboard(conversation.lead!.email, "email")}
                title="Copy Email"
                className="ms-1 hover:text-foreground text-muted-foreground cursor-pointer transition-colors"
              >
                {copiedField === "email" ? (
                  <Check className="size-3 text-emerald-600" />
                ) : (
                  <Copy className="size-3" />
                )}
              </button>
            </div>
          )}

          {conversation.lead.phone && (
            <div className="flex items-center gap-1.5 font-mono text-[11px] bg-background border border-border px-2 py-1 rounded-none">
              <Phone className="size-3 text-primary" />
              <span className="text-foreground">{conversation.lead.phone}</span>
              <button
                onClick={() => copyToClipboard(conversation.lead!.phone!, "phone")}
                title="Copy Phone"
                className="ms-1 hover:text-foreground text-muted-foreground cursor-pointer transition-colors"
              >
                {copiedField === "phone" ? (
                  <Check className="size-3 text-emerald-600" />
                ) : (
                  <Copy className="size-3" />
                )}
              </button>
            </div>
          )}

          {conversation.lead.company && (
            <div className="flex items-center gap-1.5 text-[11px] bg-background border border-border px-2 py-1 rounded-none">
              <Building2 className="size-3 text-muted-foreground" />
              <span>{conversation.lead.company}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
