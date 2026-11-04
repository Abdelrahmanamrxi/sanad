"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getAuthContext } from "@/lib/auth";
import type { PlanTier } from "@/features/billing/plans";

const updateAssistantSettingsSchema = z.object({
  customInstructions: z.string().default(""),
  temperature: z.number().min(0.0).max(0.5).default(0.2),
});

export type UpdateAssistantSettingsInput = z.infer<typeof updateAssistantSettingsSchema>;

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: {
    customInstructions: string;
    temperature: number;
  };
}

/**
 * Server Action: Update store assistant instructions and temperature
 * Enforces tier-based rules:
 * - Free: Cannot customize instructions (locked).
 * - Starter: Max 1,000 characters for instructions.
 * - Pro: Max 3,000 characters for instructions, full precision temperature.
 */
export async function updateAssistantSettingsAction(
  input: UpdateAssistantSettingsInput
): Promise<ActionResult> {
  try {
    const authContext = await getAuthContext();
    const { businessId, planTier, supabase } = authContext;

    const validated = updateAssistantSettingsSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues[0]?.message || "Invalid settings input.",
      };
    }

    const { customInstructions, temperature } = validated.data;
    const trimmedInstructions = customInstructions.trim();

    // ── Tier Rule 1: Free Tier Gating ──
    if (planTier === "free") {
      if (trimmedInstructions.length > 0) {
        return {
          success: false,
          error:
            "Custom instructions are a Starter/Pro feature. Please upgrade your plan to customize assistant instructions.",
        };
      }
    }

    // ── Tier Rule 2: Starter Character Cap (1,000 chars) ──
    if (planTier === "starter") {
      if (trimmedInstructions.length > 1000) {
        return {
          success: false,
          error: `Starter plan allows up to 1,000 characters for custom instructions (current: ${trimmedInstructions.length}). Please shorten or upgrade to Pro.`,
        };
      }
    }

    // ── Tier Rule 3: Pro Character Cap (3,000 chars) ──
    if (planTier === "pro") {
      if (trimmedInstructions.length > 3000) {
        return {
          success: false,
          error: `Maximum 3,000 characters allowed for custom instructions (current: ${trimmedInstructions.length}).`,
        };
      }
    }

    // ── Tier Rule 4: Response Tone & Temperature is PRO Only ──
    if (planTier !== "pro" && Math.abs(temperature - 0.2) > 0.01) {
      return {
        success: false,
        error:
          "Customizing response tone and creativity (temperature) requires the Flagship Pro plan. Upgrade to Pro to customize AI temperature.",
      };
    }

    const effectiveTemperature = planTier === "pro" ? temperature : 0.2;

    // ── Update widget_settings in Supabase ──
    const { error: updateError } = await supabase
      .from("widget_settings")
      .update({
        custom_instructions: trimmedInstructions,
        temperature: effectiveTemperature,
        updated_at: new Date().toISOString(),
      })
      .eq("business_id", businessId);

    if (updateError) {
      console.error("[Action] Error saving assistant settings:", updateError);
      return {
        success: false,
        error: "Failed to update assistant settings in database.",
      };
    }

    // Revalidate relevant pages
    revalidatePath("/dashboard/playground");
    revalidatePath("/dashboard/widget");

    return {
      success: true,
      data: {
        customInstructions: trimmedInstructions,
        temperature,
      },
    };
  } catch (err: unknown) {
    console.error("[Action] Unexpected error:", err);
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while saving assistant settings.",
    };
  }
}
