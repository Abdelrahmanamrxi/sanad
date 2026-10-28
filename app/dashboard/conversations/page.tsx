import type { Metadata } from "next";
import { ConversationsView } from "@/features/dashboard/conversations/components";

export const metadata: Metadata = {
  title: "Conversations & Leads",
  description:
    "Review visitor chat histories, customer inquiries, and captured leads from your Sanad AI assistant.",
};

export default function ConversationsPage() {
  return <ConversationsView />;
}
