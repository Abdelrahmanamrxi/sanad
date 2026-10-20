import type { Metadata } from "next";
import { WidgetStudioView } from "@/features/dashboard/widget/components";
import { getAuthContext } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Widget Studio | Sanad",
  description:
    "Customize and deploy your embeddable AI customer assistant for Salla, Zid, Shopify, and WordPress",
};

export default async function WidgetPage() {
  let businessId = "workspace-live";
  try {
    const auth = await getAuthContext();
    businessId = auth.businessId;
  } catch {
    // Fallback if session is in development or testing mode
  }

  return <WidgetStudioView businessId={businessId} />;
}
