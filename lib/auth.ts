import createClient from "./supabase/server";
import AppError from "../http/error";
import type { PlanTier } from "@/features/billing/plans";
export async function getAuthContext() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    throw new AppError("Unauthorized Access", 401);
  }
  const { data: business, error: dbError } = await supabase
    .from("business")
    .select("id, name, name_arabic, subscriptions(plan_tier)")
    .eq("owner_id", user.id)
    .single();

  if (!business?.id || dbError) {
    throw new AppError("No business workspace has been found", 404);
  }

   const planTier = (
    Array.isArray(business.subscriptions)
      ? business.subscriptions[0]?.plan_tier
      : (business.subscriptions as { plan_tier?: string } | null)?.plan_tier
  ) as PlanTier || "free";


  return {
    supabase,
    user,
    businessId: business.id as string,
    businessName: (business.name || business.name_arabic || "My Business") as string,
    planTier
  };
}
