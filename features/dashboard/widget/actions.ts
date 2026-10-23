"use server";

import { WidgetConfig, toWidgetSettingsDBRow } from "./types";
import { getAuthContext } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveWidgetSettings(widget: Partial<WidgetConfig>) {
  const { businessId, supabase } = await getAuthContext();

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