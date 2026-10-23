// lib/plans.ts
export type PlanTier = "free" | "starter" | "pro" ;

export interface PlanConfig {
  id: PlanTier;
  name: string;
  monthlyMessages: number;
  maxDocuments: number;
  maxFileSizeMb: number;
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
    monthlyMessages: 100,
    maxDocuments: 3,
    maxFileSizeMb: 2,
    features: {
      customBranding: false,
      prioritySupport: false,
      analytics: false,
    },
  },
  starter: {
    id: "starter",
    name: "Starter",
    monthlyMessages: 1000,
    maxDocuments: 15,
    maxFileSizeMb: 5,
    features: {
      customBranding: true,
      prioritySupport: false,
      analytics: true,
    },
  },
  pro: {
    id: "pro",
    name: "Growth",
    monthlyMessages: 3000,
    maxDocuments: 30,
    maxFileSizeMb: 15,
    features: {
      customBranding: true,
      prioritySupport: true,
      analytics: true,
    },
  },

};
