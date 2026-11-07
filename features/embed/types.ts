import { WidgetConfig } from "../dashboard/widget/types";

export interface SessionResponseData {
  sessionToken: string;
  config: Record<string, unknown>;
  conversationId: string;
  history: Array<{ id: string; role: "user" | "assistant"; content: string; created_at: string }>;
  planTier?: string;
  showBranding?: boolean;
}

export interface EmbedChatWidgetProps {
  widgetKey: string;
  businessId: string;
  config: WidgetConfig;
  initialOpen?: boolean;
  showBranding?: boolean;
  planTier?: string;
  hostDomain?: string;
  originPage: string;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  time?: string;
  isStreaming?: boolean;
  error?: boolean;
  retryText?: string;
  citation?: {
    documentTitle: string;
    page?: number | string;
    highlightedExcerpt: string;
  };
}

export interface PersistChatExchangeParams {
  conversationId: string;
  businessId: string;
  userMessage: string;
  assistantText: string;
  chunkIds: string[];
  highestSimilarity: number | null;
  usage?: { inputTokens?: number; outputTokens?: number };
  latencyMs: number;
  priorMessagesCount: number;
}


export interface StatusResolutionParams {
  highestSimilarity: number | null;
  hasChunks: boolean;
  requestedEscalation: boolean;
  isSmallTalk: boolean;
  currentStatus?: string | null;
  hasLead?: boolean | null;
  similarityThreshold?: number;
}

export interface BotConfig {
  assistantName: string;
  customInstructions: string;
  effectiveTemperature: number;
}


export interface RetrievedContext {
  context: string;
  chunkIds: string[];
  highestSimilarity: number | null;
  citationPayload: {
    documentTitle: string;
    page?: string;
    highlightedExcerpt?: string;
  } | null;
}