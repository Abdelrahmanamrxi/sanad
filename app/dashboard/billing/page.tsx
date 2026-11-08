import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth";
import AppError from "@/lib/http/error";
import {
  getActiveSubscription,
  checkUsageLimit,
} from "@/features/billing/services/usage";
import { PLANS, type PlanTier } from "@/features/billing/plans";
import { BillingView } from "@/features/billing";

export const metadata: Metadata = {
  title: "Billing & Quotas",
  description:
    "Manage your Sanad AI subscription tier, monitor monthly inquiry quotas, and knowledge base capacity.",
};

export const revalidate = 0;

export default async function BillingPage() {
  let authContext;
  try {
    authContext = await getAuthContext();
  } catch (error) {
    if (error instanceof AppError) {
      if (error.status === 401) {
        redirect("/signin");
      }
      if (error.status === 404) {
        redirect("/onboarding");
      }
    }
    throw error;
  }

  const { businessId, businessName, supabase } = authContext;

  // 1. Fetch Subscription & Quota Usage
  const usage = await checkUsageLimit(businessId);
  const tier: PlanTier = (usage.tier as PlanTier) || "free";
  const planConfig = PLANS[tier] || PLANS.free;
  const starterConfig = PLANS.starter;
  const flagshipConfig = PLANS.pro;

  // 2. Fetch Actual Knowledge Base Document Count
  const { count: docsCount } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("business_id", businessId);

  // 3. Fetch Actual Authorized Domains Count from Widget Settings
  const { data: widgetData } = await supabase
    .from("widget_settings")
    .select("allowed_domains")
    .eq("business_id", businessId)
    .maybeSingle();

  const domainsCount = Array.isArray(widgetData?.allowed_domains)
    ? widgetData.allowed_domains.length
    : 0;

  return (
    <BillingView
      data={{
        businessId,
        businessName,
        planTier: tier,
        planConfig,
        starterConfig,
        flagshipConfig,
        messagesUsed: usage.messagesUsed,
        messageLimit: usage.messageLimit,
        documentsCount: docsCount || 0,
        maxDocuments: planConfig.maxDocuments,
        domainsCount,
        maxDomains: planConfig.maxDomains,
        periodStart: usage.subscription.currentPeriodStart || "",
        periodEnd: usage.subscription.currentPeriodEnd || "",
      }}
    />
  );
}
