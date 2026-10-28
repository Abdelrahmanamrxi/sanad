export type ConversationStatus = "active" | "needs_attention" | "resolved";
export type LeadStatus = "new" | "contacted" | "closed";
export type FilterTab = "all" | "leads" | "needs_attention" | "resolved";

export interface ConversationLead {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
}

export interface ConversationSource {
  documentName: string;
  similarity: number; // 0.0 to 1.0 (e.g. 0.94)
  chunkSnippet?: string;
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  source?: ConversationSource;
  isLeadCaptureEvent?: boolean;
  capturedData?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface ConversationItem {
  id: string;
  visitorId: string;
  title: string;
  channel: "widget" | "test";
  status: ConversationStatus;
  hasLead: boolean;
  lead?: ConversationLead;
  originPage?: string;
  summary?: string;
  lastMessageSnippet: string;
  lastMessageAt: string;
  messagesCount: number;
  messages: ConversationMessage[];
}
