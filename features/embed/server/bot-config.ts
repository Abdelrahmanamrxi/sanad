import "server-only";
import { type BotConfig } from "../types";
import { supabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Retrieves custom bot persona, instructions, and temperature from merchant settings
 */
export async function getWidgetBotConfig(
  businessId: string,
  planTier: string
): Promise<BotConfig> {
  const { data: widgetSettings } = await supabaseAdminClient
    .from("widget_settings")
    .select("bot_name, custom_instructions, temperature")
    .eq("business_id", businessId)
    .maybeSingle();

  const isFreePlan = planTier === "free";
  const assistantName = isFreePlan
    ? "AI Assistant"
    : widgetSettings?.bot_name?.trim() || "AI Assistant";

  const maxInstructionChars =
    planTier === "starter" ? 1000 : planTier === "pro" ? 3000 : 0;
  const customInstructions =
    maxInstructionChars > 0 && widgetSettings?.custom_instructions?.trim()
      ? widgetSettings.custom_instructions.trim().slice(0, maxInstructionChars)
      : "";

  const effectiveTemperature =
    planTier === "pro" && typeof widgetSettings?.temperature === "number"
      ? Number(widgetSettings.temperature)
      : 0.2;

  return {
    assistantName,
    customInstructions,
    effectiveTemperature,
  };
}
