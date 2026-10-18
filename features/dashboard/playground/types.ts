export type PlaygroundRole = "user" | "assistant" | "system";

export interface PlaygroundChunk {
  id: string;
  documentId: string;
  documentName?: string;
  headingPath?: string | null;
  content: string;
  similarity: number;
  rank?: number;
  includedInContext: boolean;
}

export interface PlaygroundMetrics {
  latencyMs: number;
  retrievalMs?: number;
  generationMs?: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  model: string;
}

export interface PlaygroundMessage {
  id: string;
  role: PlaygroundRole;
  content: string;
  createdAt: string;
  retrievedChunks?: PlaygroundChunk[];
  metrics?: PlaygroundMetrics;
  rawPrompt?: string;
  feedback?: "positive" | "negative" | null;
}

export interface PlaygroundConfig {
  model: string;
  systemPrompt: string;
  temperature: number;
  strictGrounding: boolean;
}

export interface SystemPreset {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  systemPrompt: string;
  temperature: number;
  strictGrounding: boolean;
}

export type InspectorTab = "sources" | "settings";
