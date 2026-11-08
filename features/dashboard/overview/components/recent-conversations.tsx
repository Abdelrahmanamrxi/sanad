import { ChevronRight, MessageSquare } from "lucide-react";
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
          <h2 className="text-sm font-semibold text-foreground">
            Recent Conversations
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Latest live customer interactions handled by the Sanad AI assistant
          </p>
        </div>
        <Link
          href="/dashboard/conversations"
          className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
        >
          View all
          <ChevronRight className="size-3.5" />
        </Link>
      </div>

      {conversations.length === 0 ? (
        <div className="py-8 text-center border border-border/40 bg-muted/20 my-2">
          <MessageSquare className="size-6 text-muted-foreground/50 mx-auto mb-2" />
          <p className="font-mono text-xs text-muted-foreground">
            No conversations recorded yet.
          </p>
          <p className="font-sans text-[11px] text-muted-foreground/80 mt-0.5">
            Live customer chats from your website widget will appear here.
          </p>
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
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {conv.visitorId}
                  </span>
                  <span className="border border-border bg-muted px-1.5 py-px font-mono text-[10px] text-muted-foreground uppercase">
                    {conv.channel}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
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
