import type { Metadata } from "next"
import { KnowledgeBaseView } from "@/features/dashboard/knowledge-base/components"

export const metadata: Metadata = {
  title: "Knowledge Base",
  description:
    "Manage documents, knowledge base for your AI",
}

export default function KnowledgeBasePage() {
  return <KnowledgeBaseView />
}
