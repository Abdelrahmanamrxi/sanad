import {
  ChevronRight,
  MessageSquare,
  MessageSquareCode,
  ArrowRight,
  Bot,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { ConversationsType } from "../types";

export default function RecentConversations({
  conversations,
}: {
  conversations: ConversationsType[];
}) {
  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground font-heading">
            Recent Conversations
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground font-sans">
            Latest live customer interactions handled by the Sanad AI assistant
          </p>
        </div>
        <Link
          href="/dashboard/conversations"
          className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline font-sans"
        >
          View all
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      {conversations.length === 0 ? (
        <div className="py-10 px-4 text-center border border-border/50 bg-background/50 my-3 rounded-none">
          <div className="size-11 border border-primary/30 bg-primary/10 text-primary flex items-center justify-center rounded-none mx-auto mb-3">
            <MessageSquareCode className="size-5.5 stroke-[1.75]" />
          </div>

          <h3 className="font-heading font-semibold text-sm text-foreground mb-1">
            No live customer conversations yet
          </h3>
          <p className="font-sans text-xs text-muted-foreground max-w-md mx-auto leading-relaxed mb-5">
            Customer questions, price inquiries, and automated AI responses from
            your website widget will stream into this feed in real time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <Link
              href="/dashboard/widget"
              className="h-8.5 px-3.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-sans uppercase font-semibold tracking-wider inline-flex items-center gap-1.5 rounded-none transition-colors cursor-pointer"
            >
              <span>Configure & Embed Widget</span>
              <ArrowRight className="size-3" />
            </Link>
            <Link
              href="/dashboard/playground"
              className="h-8.5 px-3 border border-border bg-card hover:bg-muted/50 text-foreground text-xs font-sans uppercase font-semibold tracking-wider inline-flex items-center gap-1.5 rounded-none transition-colors cursor-pointer"
            >
              <Bot className="size-3.5" />
              <span>Test AI Assistant</span>
            </Link>
          </div>

          <div className="mt-5 pt-3 border-t border-border/40 inline-flex items-center gap-2 text-[10px] font-sans text-muted-foreground uppercase tracking-wider">
            <Sparkles className="size-3 text-primary" />
            <span>1-Minute Embed · Egyptian Arabic & English Supported</span>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="flex items-center justify-between py-3.5 transition-colors hover:bg-muted/30 px-1"
            >
              <div className="min-w-0 flex-1 pe-6">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs font-semibold text-foreground">
                    {conv.visitorId}
                  </span>
                  <span className="border border-border bg-muted px-1.5 py-px font-sans text-[10px] text-muted-foreground uppercase">
                    {conv.channel}
                  </span>
                  <span className="font-sans text-[10px] text-muted-foreground">
                    latency: {conv.latency}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground dir-rtl text-start">
                  {conv.message}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span
                  className={`border px-2 py-0.5 text-[10px] font-medium uppercase font-mono ${
                    conv.status === "resolved"
                      ? "border-success/30 bg-success/10 text-success"
                      : conv.status === "human_resolved"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : conv.status === "escalated"
                          ? "border-destructive/30 bg-destructive/10 text-destructive"
                          : conv.status === "contacted"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {conv.status === "escalated"
                    ? "Needs Attention"
                    : conv.status === "resolved"
                      ? "AI Resolved"
                      : conv.status === "human_resolved"
                        ? "Human Resolved"
                        : conv.status === "contacted"
                          ? "Contacted"
                          : "In Progress"}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground w-16 text-end">
                  {conv.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
