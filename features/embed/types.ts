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
  originPage:string;
}


export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  time?: string;
  isStreaming?: boolean;
  error?: boolean;
  retryText?: string;
}


