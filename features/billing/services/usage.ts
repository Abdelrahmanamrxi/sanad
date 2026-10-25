import 'server-only'
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { PLANS, PlanTier, isOverLimit } from "@/features/billing/plans";
import AppError from '@/http/error';

export interface QuotaCheckResult {
  allowed: boolean;
  tier: PlanTier;
  messagesUsed: number;
  messageLimit: number;
  periodEnd: string;
}

export async function getActiveSubscription(businessId: string) {
  let { data: sub } = await supabaseAdminClient
    .from("subscriptions")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle();

  // If no subscription row exists yet, auto-provision default free tier
  if (!sub) {
    const { data: newSub, error: insertError } = await supabaseAdminClient
      .from("subscriptions")
      .insert({
        business_id: businessId,
        plan_tier: "free",
      })
      .select("*")
      .single();

    if (insertError || !newSub) {
      console.error("[Usage] Failed to provision default subscription:", insertError);
      throw new AppError("Error while retrieving active subscription", 500);
    }
    sub = newSub;
  }

  // Auto Advance the 30 day billing if billing's expired
  const now = new Date();
  if (new Date(sub.current_period_end) < now) {
    const newStart = now.toISOString();
    const newEnd = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const { data: refreshedSub, error: updateError } = await supabaseAdminClient
      .from("subscriptions")
      .update({
        current_period_start: newStart,
        current_period_end: newEnd,
      })
      .eq("id", sub.id)
      .select()
      .single();

    if (!updateError && refreshedSub) {
      sub = refreshedSub;
    }
  }
  return sub;
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
    throw new AppError("Failed to increment usage cycle",500)
  }
}
