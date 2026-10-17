import type { Metadata } from "next";
import { PlaygroundView } from "@/features/dashboard/playground/components";

export const metadata: Metadata = {
  title: "RAG Playground | Sanad",
  description:
    "Interactive evaluation sandbox for hybrid retrieval, prompt engineering, and grounded response generation",
};

interface PlaygroundPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function PlaygroundPage({
  searchParams,
}: PlaygroundPageProps) {
  const { q } = await searchParams;

  return <PlaygroundView initialQuery={q} />;
}
