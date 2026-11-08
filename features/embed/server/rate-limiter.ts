import "server-only";
import { supabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Checks public IP-based rate limiting via Postgres RPC
 */
export async function checkWidgetRateLimit(
  businessId: string,
  rawIp: string | null
): Promise<boolean> {
  const ip = !rawIp || rawIp === "::1" ? "127.0.0.1" : rawIp;
  const key = `rate:${businessId}:${ip}`;

  const { data: isAllowed, error } = await supabaseAdminClient.rpc(
    "check_widget_rate_limit",
    {
      p_key: key,
      p_max_requests: 10, // Max 10 messages per minute per IP
    }
  );

  if (error) {
    console.error("[RateLimit] Error checking widget rate limit:", error);
    return true; // Fail-open: allow request if limiter table has an issue
  }

  return isAllowed !== false;
}