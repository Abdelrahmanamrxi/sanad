import type { PlanConfig, PlanTier } from "./plans";

export interface BillingViewData {
  businessId: string;
  businessName: string;
  planTier: PlanTier;
  planConfig: PlanConfig;
  starterConfig: PlanConfig;
  flagshipConfig: PlanConfig;
  messagesUsed: number;
  messageLimit: number;
  documentsCount: number;
  maxDocuments: number;
  domainsCount: number;
  maxDomains: number;
  periodStart: string;
  periodEnd: string;
}
export interface SubscriptionRow {
  currentPeriodStart:string,
  currentPeriodEnd:string,
  status:"active" | "past_due"| 'canceled'| 'trialing',
  businessId:string
}

export interface SubscriptionDBRow{
  current_period_start:string,
  current_period_end:string,
  status:"active" | "past_due"| 'canceled'| 'trialing',
  business_id:string,
  plan_tier:"free" | "starter" | "pro"
}
