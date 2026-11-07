import { type LucideIcon } from "lucide-react";

export interface StatItem {
  label: string;
  value: string | number;
  description?: string;
  delta?: string;
  deltaType?: "positive" | "negative";
  progress?: number;
}

export interface StatProps {
  conversations: StatItem;
  visitors: StatItem;
  resolutionRate: StatItem;
  avgResponse: StatItem;
}

export interface SingleCardProps {
  item: StatItem;
  icon: LucideIcon;
}

export interface WeeklyTrafficProps {
  day: string;
  total: number;
  aiAnswered: number;
  needsReview: number;
}

export interface ConvertedLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  intent: "high" | "medium";
  intentLabel: string;
  topic: string;
  chats: number;
  convertedAt: string;
  status: "New Lead" | "Contacted" | "Qualified";
}

export interface ConversionFunnelType {
  totalVisitors: number;
  engagedVisitors: number;
  capturedLeads: number;
  overallRate: string;
  rateDelta?: string;
  chatToLeadRate: string;
  avgTimeToConvert?: string;
}

export interface ConversationsType {
  id: string;
  visitorId: string;
  channel: "widget" | "test";
  message: string;
  status: "resolved" | "active" | "escalated" | "contacted" | "human_resolved";
  latency: string;
  time: string;
}
