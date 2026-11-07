import "server-only";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { PLANS, PlanTier, isOverLimit } from "../plans";
import AppError from "@/http/error";
import { SubscriptionRow,SubscriptionDBRow } from "../types";

export interface QuotaCheckResult {
  allowed: boolean;
  tier: PlanTier;
  messagesUsed: number;
  messageLimit: number;
  periodEnd: string;
  subscription: SubscriptionRow;
}

export async function getActiveSubscription(businessId: string) {
   const { data: sub, error } = await supabaseAdminClient
    .rpc("get_or_renew_subscription", { target_business_id: businessId })
    .single();
  if (error || !sub) {
    console.error("[Usage] Failed to get or renew subscription atomically:", error);
    throw new AppError("Error while retrieving active subscription", 500);
  }
  return sub as SubscriptionDBRow;
}

/**
 * 2. Checks whether the business has messages remaining in their active cycle.
 */

export async function checkUsageLimit(
  businessId: string,
): Promise<QuotaCheckResult> {
  const sub = await getActiveSubscription(businessId);
  const tier = sub.plan_tier as PlanTier;
  const plan = PLANS[tier];

  // Fetch current cycle usage record (if none exists yet, 0 messages used so far)
  const { data: cycle, error: cycleError } = await supabaseAdminClient
    .from("usage_cycles")
    .select("messages_count")
    .eq("business_id", businessId)
    .eq("period_start", sub.current_period_start)
    .maybeSingle();

  if (cycleError) {
    console.error("[Usage] Error fetching cycle record:", cycleError);
  }

  const messagesUsed = cycle?.messages_count ?? 0;
  const overLimit = isOverLimit(tier, messagesUsed);

  return {
    allowed: !overLimit,
    tier,
    messagesUsed,
    messageLimit: plan.messages,
    periodEnd: sub.current_period_end,
    subscription: {
      currentPeriodStart: sub.current_period_start,
      currentPeriodEnd: sub.current_period_end,
      status: sub.status,
      businessId,
    },
  };
}

/**
 * 3. Atomically increments the cycle counter and token usage via your PL/pgSQL function.
 */

export async function recordMessageUsage(params: {
  businessId: string;
  tokensIn: number;
  tokensOut: number;
}) {
  const sub = await getActiveSubscription(params.businessId);
  const { error } = await supabaseAdminClient.rpc("increment_business_usage", {
    target_business_id: params.businessId,
    p_start: sub.current_period_start,
    p_end: sub.current_period_end,
    inc_tokens_in: params.tokensIn,
    inc_tokens_out: params.tokensOut,
  });
  if (error) {
    throw new AppError("Failed to increment usage cycle", 500);
  }
}
