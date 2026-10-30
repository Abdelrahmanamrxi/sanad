"use client";

import React, { useState } from "react";
import { ConversationItem } from "../types";
import {
  Mail,
  Phone,
  Building2,
  Check,
  Copy,
  ExternalLink,
  Globe,
  User,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConversationHeaderProps {
  conversation: ConversationItem;
}

export function ConversationHeader({
  conversation,
  
}: ConversationHeaderProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const isResolved = conversation.status === "resolved";
  const isLead = conversation.hasLead && conversation.lead;
  const isContacted = isLead && conversation.lead?.status === "contacted";

  return (
    <div className="border-b border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Customer / Visitor Identity */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Sharp avatar square */}
          <div className="size-10 bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-heading font-bold text-sm shrink-0 rounded-none">
            {isLead ? (
              conversation.lead?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            ) : (
              <User className="size-5 text-muted-foreground" />
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-bold text-sm sm:text-base text-foreground truncate">
                {isLead ? conversation.lead?.name : conversation.visitorId.replace("vis-", "Visitor #")}
              </h1>

              {isLead && (
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 border font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 rounded-none">
                  {isContacted ? "Contacted Lead" : "New Lead"}
                </span>
              )}

              {conversation.channel === "widget" && (
                <span className="text-[10px] font-mono text-muted-foreground border border-border px-1.5 py-0.5 bg-muted/40 rounded-none hidden sm:inline-block">
                  Widget Chat
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
              {conversation.originPage && (
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Globe className="size-3 text-muted-foreground/80" />
                  Origin: {conversation.originPage}
                </span>
              )}

              <span className="text-[11px] font-mono">
                Started {conversation.lastMessageAt}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isLead  && (
            <Button
              variant="outline"
              size="sm"
              
              className="text-xs rounded-none border-border"
            >
              <Check className={cn("size-3.5", isContacted && "text-emerald-600")} />
              {isContacted ? "Contacted" : "Mark as Contacted"}
            </Button>
          )}

          <Button
            variant={isResolved ? "outline" : "default"}
            size="sm"
          
            className="text-xs rounded-none"
          >
            {isResolved ? (
              <>
                <RotateCcw className="size-3.5" />
                Reopen
              </>
            ) : (
              <>
                <CheckCircle2 className="size-3.5" />
                Mark as Resolved
              </>
            )}
          </Button>
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
