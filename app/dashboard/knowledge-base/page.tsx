import type { Metadata } from "next"
import { KnowledgeBaseView } from "@/features/dashboard/knowledge-base/components"

export const metadata: Metadata = {
  title: "Knowledge Base | Sanad",
  description:
    "Manage vector embeddings, inspect chunk partitions, and purge obsolete documentation",
}

export default function KnowledgeBasePage() {
  return <KnowledgeBaseView />
}
