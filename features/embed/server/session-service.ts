import "server-only";

import { supabaseAdminClient } from "@/lib/supabase/admin";
import AppError from "@/http/error";
import { getHostname } from "@/lib/utils";
import { getActiveSubscription } from "@/features/billing/services/usage";
import { PLANS, type PlanTier } from "@/features/billing/plans";

// In-process mutex map to serialize and deduplicate concurrent conversation resolution for the same visitor
const visitorConvoLocks = new Map<string, Promise<string>>();

export interface VerifiedWidget {
  widgetConfig: Record<string, any>;
  businessId: string;
}

export interface ConversationHistoryMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface BrandingInfo {
  planTier: string;
  showBranding: boolean;
}

function normalizeDomain(raw: string): string {
  if (!raw) return "";
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/^\./, "")
    .split(":")[0];
}

/**
 * Validates that the widget key is active and that the calling origin is permitted.
 */
export async function validateWidgetAccess(
  widgetKey: string,
  originOrReferer: string | null,
  candidateHost?: string | null
): Promise<VerifiedWidget> {
  // Query by either primary key (widget id) or business_id
  const { data: widgetConfig, error: widgetErr } = await supabaseAdminClient
    .from("widget_settings")
    .select(
      "id, business_id, is_active, allowed_domains, bot_name, subtitle, primary_color, secondary_color, background_color, border_radius, corner_radius, position, launcher_style, launcher_text, welcome_message, starter_questions, default_language"
    )
    .or(`id.eq.${widgetKey},business_id.eq.${widgetKey}`)
    .maybeSingle();

  if (widgetErr) {
    console.error("[Widget Service] Error querying widget settings:", widgetErr);
    throw new AppError("Failed to verify widget configuration", 500);
  }

  if (!widgetConfig || !widgetConfig.is_active) {
    throw new AppError("Widget is unavailable or inactive", 403);
  }

  const businessId = widgetConfig.business_id as string;
  const allowedDomains: string[] = widgetConfig.allowed_domains || [];

  // Determine calling domain from candidateHost (e.g. host parameter / document.referrer) or headers
  const rawCaller = candidateHost || getHostname(originOrReferer) || "";
  const callerDomain = normalizeDomain(rawCaller);

  // If merchant has configured specific allowed domains, enforce the whitelist
  if (allowedDomains.length > 0) {
    const isLocalhost =
      process.env.NODE_ENV !== "production" &&
      (callerDomain === "localhost" || callerDomain === "127.0.0.1" || !callerDomain);

    const isInternalApp =
      callerDomain === "sanad.app" || callerDomain.endsWith(".sanad.app");

    const isAllowed =
      isLocalhost ||
      isInternalApp ||
      (callerDomain.length > 0 &&
        allowedDomains.some((raw) => {
          const d = normalizeDomain(raw);
          if (!d) return false;
          return callerDomain === d || callerDomain.endsWith("." + d);
        }));

    if (!isAllowed) {
      throw new AppError(
        `Domain "${callerDomain || "unknown"}" is not authorized for this widget. Please add it to Allowed Domains in Widget Settings.`,
        403
      );
    }
  }

  return { widgetConfig, businessId };
}

/**
 * Atomically upserts the visitor row by (business_id, anon_id).
 * Guarantees race-condition safety on initial visits.
 */
export async function upsertVisitor(
  businessId: string,
  anonId: string
): Promise<string> {
  const { data: upsertedVisitor, error: upsertErr } = await supabaseAdminClient
    .from("visitors")
    .upsert(
      {
        business_id: businessId,
        anon_id: anonId,
        last_seen_at: new Date().toISOString(),
      },
      {
        onConflict: "business_id,anon_id",
      }
    )
    .select("id")
    .single();

  if (upsertErr || !upsertedVisitor) {
    // Conflict fallback: retrieve existing visitor record
    const { data: existingVisitor, error: fetchErr } = await supabaseAdminClient
      .from("visitors")
      .select("id")
      .eq("business_id", businessId)
      .eq("anon_id", anonId)
      .maybeSingle();

    if (!existingVisitor) {
      console.error("[Widget Service] Failed to upsert visitor:", upsertErr || fetchErr);
      throw new AppError(
        `Failed to register visitor: ${upsertErr?.message || fetchErr?.message}`,
        500
      );
    }
    return existingVisitor.id;
  }

  return upsertedVisitor.id;
}

/**
 * Atomically resolves or creates a single conversation for the visitor.
 * Combines an in-process mutex with database query fallback to eliminate duplicate conversations.
 */
export async function getOrCreateWidgetConversation(
  businessId: string,
  visitorId: string
): Promise<string> {
  const lockKey = `${businessId}:${visitorId}`;

  const existingLock = visitorConvoLocks.get(lockKey);
  if (existingLock) {
    return existingLock;
  }

  const promise = (async () => {
    try {
      // 1. Look for an existing conversation
      const { data: existingConvo } = await supabaseAdminClient
        .from("conversations")
        .select("id")
        .eq("business_id", businessId)
        .eq("visitor_id", visitorId)
        .eq("channel", "widget")
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingConvo) {
        return existingConvo.id;
      }

      // 2. Insert new conversation
      const { data: newConvo, error: newConvoError } = await supabaseAdminClient
        .from("conversations")
        .insert({
          business_id: businessId,
          visitor_id: visitorId,
          channel: "widget",
        })
        .select("id")
        .single();

      if (newConvoError || !newConvo) {
        // Fallback in case of concurrent insert race or unique constraint violation
        const { data: fallbackConvo } = await supabaseAdminClient
          .from("conversations")
          .select("id")
          .eq("business_id", businessId)
          .eq("visitor_id", visitorId)
          .eq("channel", "widget")
          .order("started_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!fallbackConvo) {
          console.error(
            "[Widget Service] Failed to create or retrieve conversation:",
            newConvoError
          );
          throw new AppError(
            `Failed to initialize conversation: ${newConvoError?.message}`,
            500
          );
        }
        return fallbackConvo.id;
      }

      return newConvo.id;
    } finally {
      visitorConvoLocks.delete(lockKey);
    }
  })();

  visitorConvoLocks.set(lockKey, promise);
  return promise;
}

/**
 * Fetches recent message history for a conversation.
 */
export async function fetchConversationHistory(
  conversationId: string
): Promise<ConversationHistoryMessage[]> {
  try {
    const { data: history, error } = await supabaseAdminClient
      .from("messages")
      .select("id, role, content, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[Widget Service] Error fetching message history:", error);
      return [];
    }

    return (history as ConversationHistoryMessage[]) || [];
  } catch (err) {
    console.error("[Widget Service] Unexpected error fetching message history:", err);
    return [];
  }
}

/**
 * Safely resolves subscription tier and branding display permissions.
 */
export async function resolveWidgetBranding(
  businessId: string
): Promise<BrandingInfo> {
  try {
    const sub = await getActiveSubscription(businessId);
    const planTier = (sub.plan_tier as PlanTier) || "free";
    const plan = PLANS[planTier] || PLANS.free;
    const showBranding = !plan.features.customBranding;

    return { planTier, showBranding };
  } catch (err) {
    console.error("[Widget Service] Error resolving subscription branding:", err);
    return { planTier: "free", showBranding: true };
  }
}
