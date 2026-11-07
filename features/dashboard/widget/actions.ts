"use server";

import { WidgetConfig, toWidgetSettingsDBRow } from "./types";
import { getAuthContext } from "@/lib/auth";
import { getActiveSubscription } from "@/features/billing/services/usage";
import { revalidatePath } from "next/cache";

export async function saveWidgetSettings(widget: Partial<WidgetConfig>) {
  const { businessId, supabase } = await getAuthContext();

  // Validate allowedDomains: Must not be empty when saving widget settings
  if (widget.allowedDomains !== undefined) {
    const cleanDomains = (widget.allowedDomains || [])
      .map(
        (d) =>
          d
            .trim()
            .toLowerCase()
            .replace(/^https?:\/\//i, "")
            .replace(/\/.*$/, "")
            .replace(/^\./, "")
            .split(":")[0],
      )
      .filter(Boolean);

    const uniqueDomains = Array.from(new Set(cleanDomains));

    if (uniqueDomains.length === 0) {
      throw new Error(
        "At least one allowed domain is required (e.g. yourstore.com or store.salla.sa)",
      );
    }

    widget.allowedDomains = uniqueDomains;
  }

  const dbUpdate = toWidgetSettingsDBRow(widget);

  // Subscription Plan Gating
  const sub = await getActiveSubscription(businessId);
  const currentTier = sub?.plan_tier || "free";

  // 1. Authorized Domain Count Limits (Free: 1, Starter: 5, Pro: 10)
  if (widget.allowedDomains && widget.allowedDomains.length > 0) {
    const domainCount = widget.allowedDomains.length;
    if (currentTier === "free" && domainCount > 1) {
      throw new Error(
        "Free plan allows 1 authorized domain. Upgrade to Starter (up to 5 domains) or Pro (up to 10 domains).",
      );
    }
    if (currentTier === "starter" && domainCount > 5) {
      throw new Error(
        "Starter plan allows up to 5 authorized domains. Upgrade to Pro for up to 10 domains.",
      );
    }
    if (currentTier === "pro" && domainCount > 10) {
      throw new Error("Pro plan allows a maximum of 10 authorized domains.");
    }
  }

  // 2. Custom Assistant Name (Free tier always defaults to AI Assistant without blocking saves)
  if (currentTier === "free") {
    dbUpdate.bot_name = "AI Assistant";
  }

  // 3. Document Highlight Card Gating (Requires Pro plan)
  if (currentTier !== "pro" && widget.citationStyle === "document-snippet") {
    // Gracefully fallback to standard citation for non-pro plans instead of failing save
    dbUpdate.citation_style = "none";
  }

  // 4. Custom Instructions Gating
  if (widget.customInstructions !== undefined) {
    const trimmed = widget.customInstructions.trim();
    if (currentTier === "free") {
      dbUpdate.custom_instructions = "";
    } else if (currentTier === "starter") {
      dbUpdate.custom_instructions = trimmed.slice(0, 1000);
    } else if (currentTier === "pro") {
      dbUpdate.custom_instructions = trimmed.slice(0, 3000);
    }
  }

  // 5. Temperature Gating (Pro only)
  if (widget.temperature !== undefined) {
    if (currentTier !== "pro") {
      // Gracefully enforce default temperature (0.2) for non-pro tiers instead of blocking appearance saves
      dbUpdate.temperature = 0.2;
    }
  }

  const { data, error } = await supabase
    .from("widget_settings")
    .upsert(
      {
        business_id: businessId,
        ...dbUpdate,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "business_id" },
    )
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/widget");

  return { success: true, data };
}
