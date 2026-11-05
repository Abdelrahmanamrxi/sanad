import React from "react";
import { getAuthContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AccountView } from "@/features/dashboard/account/components/account-view";
import type { AccountData } from "@/features/dashboard/account/types";

export const revalidate = 0;

export default async function AccountPage() {
  let authContext;
  try {
    authContext = await getAuthContext();
  } catch {
    redirect("/signin");
  }

  const { supabase, user, businessId, businessName, planTier } = authContext;

  // 1. Fetch business row from public.business table
  const { data: business } = await supabase
    .from("business")
    .select("id, name, name_arabic, app_language, city, district, created_at")
    .eq("id", businessId)
    .maybeSingle();

  // 2. Fetch widget settings for language and assistant identity
  const { data: widget } = await supabase
    .from("widget_settings")
    .select("default_language, bot_name")
    .eq("business_id", businessId)
    .maybeSingle();

  const userFullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Operator";

  const userCreatedAtFormatted = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : undefined;

  const initialData: AccountData = {
    user: {
      id: user.id,
      email: user.email || "",
      fullName: userFullName,
      createdAt: userCreatedAtFormatted,
    },
    business: {
      id: business?.id || businessId,
      name: business?.name || businessName || "My Business",
      nameArabic: business?.name_arabic || "",
      appLanguage: (business?.app_language as "en" | "ar") || "en",
      city: business?.city || "Cairo",
      district: business?.district || "",
      createdAt: business?.created_at,
    },
    widget: {
      defaultLanguage: (widget?.default_language as "auto" | "ar" | "en") || "auto",
      botName: widget?.bot_name,
    },
    planTier,
  };

  return <AccountView initialData={initialData} />;
}
