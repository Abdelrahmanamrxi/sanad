import type { Metadata } from "next";
import { WidgetStudioView } from "@/features/dashboard/widget/components";
import { getAuthContext } from "@/lib/auth";
import { redirect } from "next/navigation";
import AppError from "@/http/error";
import {
  toWidgetConfig,
  WidgetConfig,
  WidgetSettingsDBRow,
} from "@/features/dashboard/widget/types";
import { DEFAULT_WIDGET_CONFIG } from "@/features/dashboard/widget/constants";

export const metadata: Metadata = {
  title: "Widget Studio | Sanad",
  description:
    "Customize and deploy your embeddable AI customer assistant for Salla, Zid, Shopify, and WordPress",
};

export default async function WidgetPage() {
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

  const { businessId, supabase } = authContext;

  const { data } = await supabase
    .from("widget_settings")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle<WidgetSettingsDBRow>();

  const widgetSettings = data ? toWidgetConfig(data) : DEFAULT_WIDGET_CONFIG;

  return (
    <WidgetStudioView businessId={businessId} initialConfig={widgetSettings} />
  );
}
