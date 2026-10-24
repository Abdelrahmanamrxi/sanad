// lib/plans.ts
export type PlanTier = "free" | "starter" | "pro"; // DB stores only this value

export interface PlanConfig {
  id: PlanTier;
  name: string; // display name, can change freely
  messages: number; // 1 message = 1 user question
  messagePeriod: "lifetime" | "monthly"; // free = lifetime, paid = monthly
  maxDocuments: number;
  maxFileSizeMb: number;
  maxTotalPages: number; // drives embedding and storage cost
  maxOutputTokens: number; // caps cost per answer
  maxUserMessageChars: number; // caps cost per question
  features: {
    customBranding: boolean; // remove "Powered by Sanad"
    prioritySupport: boolean;
    analytics: boolean;
  };
}

export const PLANS: Record<PlanTier, PlanConfig> = {
  free: {
    id: "free",
    name: "Free Trial",
    messages: 75,
    messagePeriod: "lifetime",
    maxDocuments: 1,
    maxFileSizeMb: 2,
    maxTotalPages: 12,
    maxOutputTokens: 400,
    maxUserMessageChars: 400,
    features: { customBranding: false, prioritySupport: false, analytics: false },
  },
  starter: {
    id: "starter",
    name: "Starter",
    messages: 1000,
    messagePeriod: "monthly",
    maxDocuments: 15,
    maxFileSizeMb: 10,
    maxTotalPages: 150,
    maxOutputTokens: 500,
    maxUserMessageChars: 1000,
    features: { customBranding: true, prioritySupport: false, analytics: true },
  },
  pro: {
    id: "pro",
    name: "Growth",
    messages: 3000,
    messagePeriod: "monthly",
    maxDocuments: 30,
    maxFileSizeMb: 25,
    maxTotalPages: 500,
    maxOutputTokens: 600,
    maxUserMessageChars: 1000,
    features: { customBranding: true, prioritySupport: true, analytics: true },
  },
};

export const getPlan = (tier: PlanTier) => PLANS[tier];

export const usagePercent = (tier: PlanTier, used: number) =>
  Math.round((used / PLANS[tier].messages) * 100);

export const isOverLimit = (tier: PlanTier, used: number) =>
  used >= PLANS[tier].messages;