"use server";

import { WidgetConfig, toWidgetSettingsDBRow } from "./types";
import { getAuthContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveWidgetSettings(widget: Partial<WidgetConfig>) {
  const { businessId, supabase } = await getAuthContext();

  // Validate allowedDomains: Must not be empty when saving widget settings
  if (widget.allowedDomains !== undefined) {
    const cleanDomains = (widget.allowedDomains || [])
      .map((d) =>
        d
          .trim()
          .toLowerCase()
          .replace(/^https?:\/\//i, "")
          .replace(/\/.*$/, "")
          .replace(/^\./, "")
          .split(":")[0]
      )
      .filter(Boolean);

    const uniqueDomains = Array.from(new Set(cleanDomains));

    if (uniqueDomains.length === 0) {
      throw new Error("At least one allowed domain is required (e.g. yourstore.com or store.salla.sa)");
    }

    widget.allowedDomains = uniqueDomains;
  }

  const dbUpdate = toWidgetSettingsDBRow(widget);

  const { data, error } = await supabase
    .from("widget_settings")
    .upsert(
      {
        business_id: businessId,
        ...dbUpdate,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "business_id" }
    )
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/widget");

  return { success: true, data };
}