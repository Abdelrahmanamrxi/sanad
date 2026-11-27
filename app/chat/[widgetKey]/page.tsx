import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import {
  toWidgetConfig,
  type WidgetSettingsDBRow,
} from "@/features/dashboard/widget/types";
import { getActiveSubscription } from "@/features/billing/services/usage";
import { PLANS, type PlanTier } from "@/features/billing/plans";
import { DirectChatView } from "@/features/embed/components/direct-chat-view";

const uuidSchema = z.string().uuid();

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ widgetKey: string }>;
}): Promise<Metadata> {
  const { widgetKey: rawWidgetKey } = await params;
  const widgetKey = (rawWidgetKey || "").trim();

  if (!uuidSchema.safeParse(widgetKey).success) {
    return {
      title: "Assistant Not Found | Sanad",
      robots: { index: false, follow: false },
    };
  }

  const { data: widgetRow } = await supabaseAdminClient
    .from("widget_settings")
    .select("bot_name, is_active")
    .or(`id.eq.${widgetKey},business_id.eq.${widgetKey}`)
    .maybeSingle<Pick<WidgetSettingsDBRow, "bot_name" | "is_active">>();

  const title =
    widgetRow?.is_active && widgetRow.bot_name?.trim()
      ? `${widgetRow.bot_name.trim()}`
      : "Sanad Assistant";

  return {
    title,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function DirectChatPage({
  params,
}: {
  params: Promise<{ widgetKey: string }>;
}) {
  const { widgetKey: rawWidgetKey } = await params;
  const widgetKey = (rawWidgetKey || "").trim();

  // 1. Validate UUID format before querying PostgreSQL
  if (!uuidSchema.safeParse(widgetKey).success) {
    notFound();
  }

  // 2. Query widget_settings by primary key (id) or business_id
  const { data: widgetRow, error } = await supabaseAdminClient
    .from("widget_settings")
    .select("*")
    .or(`id.eq.${widgetKey},business_id.eq.${widgetKey}`)
    .maybeSingle<WidgetSettingsDBRow>();

  // 3. Trigger 404 if missing or inactive
  if (error || !widgetRow || !widgetRow.is_active) {
    notFound();
  }

  // 4. Resolve subscription tier and branding permissions
  let showBranding = true;
  let planTier: PlanTier = "free";

  try {
    const sub = await getActiveSubscription(widgetRow.business_id);
    planTier = (sub.plan_tier as PlanTier) || "free";
    const plan = PLANS[planTier] || PLANS.free;
    showBranding = !plan.features.customBranding;
  } catch (subErr) {
    console.error(
      "[Direct Chat Page] Error fetching subscription tier:",
      subErr,
    );
    showBranding = true;
  }

  const config = toWidgetConfig(widgetRow);

  return (
    <DirectChatView
      widgetKey={widgetRow.id}
      businessId={widgetRow.business_id}
      config={config}
      showBranding={showBranding}
      planTier={planTier}
      originPage={`/chat/${widgetKey}`}
    />
  );
}
