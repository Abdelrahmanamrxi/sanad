import { notFound } from "next/navigation";
import { z } from "zod";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { toWidgetConfig, type WidgetSettingsDBRow } from "@/features/dashboard/widget/types";
import { getActiveSubscription } from "@/features/billing/services/usage";
import { PLANS, type PlanTier } from "@/features/billing/plans";
import { EmbedChatWidget } from "./embed-chat-widget";

const uuidSchema = z.string().uuid();

export const dynamic = "force-dynamic";

export default async function EmbedPage({
  params,
  searchParams,
}: {
  params: Promise<{ widgetKey: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { widgetKey: rawWidgetKey } = await params;
  const widgetKey = (rawWidgetKey || "").trim();
  const search = await searchParams;
  const hostParam = typeof search.host === "string" ? search.host : "";

  // 1. Validate widgetKey format (must be a valid UUID to avoid PostgreSQL syntax errors)
  const isValidUuid = uuidSchema.safeParse(widgetKey).success;
  if (!isValidUuid) {
    notFound();
  }

  // 2. Query widget_settings table by id (primary key) or business_id
  const { data: widgetRow, error } = await supabaseAdminClient
    .from("widget_settings")
    .select("*")
    .or(`id.eq.${widgetKey},business_id.eq.${widgetKey}`)
    .maybeSingle<WidgetSettingsDBRow>();

  // 3. Check if widget exists and is active. If not, do not render (trigger 404 / notFound)
  if (error || !widgetRow || !widgetRow.is_active) {
    notFound();
  }

  // 4. Query subscription to determine branding permissions (free vs paid customBranding)
  let showBranding = true;
  let planTier: PlanTier = "free";

  try {
    const sub = await getActiveSubscription(widgetRow.business_id);
    planTier = (sub.plan_tier as PlanTier) || "free";
    const plan = PLANS[planTier] || PLANS.free;
    showBranding = !plan.features.customBranding;
  } catch (subErr) {
    console.error("[Embed Page] Error fetching subscription tier for branding:", subErr);
    showBranding = true;
  }

  const config = toWidgetConfig(widgetRow);
  const initialOpen = search.open === "1" || search.open === "true";

  return (
    <main className="w-full h-full bg-transparent overflow-hidden">
      <EmbedChatWidget
        widgetKey={widgetRow.id}
        businessId={widgetRow.business_id}
        config={config}
        initialOpen={initialOpen}
        showBranding={showBranding}
        planTier={planTier}
        hostDomain={hostParam}
      />
    </main>
  );
}
