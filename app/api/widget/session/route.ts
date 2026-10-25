import { NextResponse } from "next/server";
import { z } from "zod";
import { handle } from "@/http/async-handler";
import AppError from "@/http/error";
import { signWidgetSession } from "@/features/embed/server/token";
import {
  validateWidgetAccess,
  upsertVisitor,
  getOrCreateWidgetConversation,
  fetchConversationHistory,
  resolveWidgetBranding,
} from "@/features/embed/server/session-service";

const widgetSessionSchema = z.object({
  widgetKey: z.string().uuid({ message: "Invalid widget key format" }),
  anonId: z.string().uuid({ message: "Invalid anonymous visitor ID format" }),
});

export const POST = handle(async (req) => {
  // 1. Validate request body
  const rawBody = await req.json().catch(() => null);
  if (!rawBody) {
    throw new AppError("Malformed or empty request payload", 400);
  }

  const parseResult = widgetSessionSchema.safeParse(rawBody);
  if (!parseResult.success) {
    throw new AppError(
      parseResult.error.issues[0]?.message || "Invalid session request payload",
      400,
    );
  }

  const { widgetKey, anonId } = parseResult.data;

  // 2. Verify widget existence, status, and domain authorization
  const originOrReferer =
    req.headers.get("origin") || req.headers.get("referer");

  const { widgetConfig, businessId } = await validateWidgetAccess(
    widgetKey,
    originOrReferer,
  );

  // 3. Atomically register or update the visitor
  const visitorId = await upsertVisitor(businessId, anonId);

  // 4. Atomically resolve or create the single conversation for this visitor
  const conversationId = await getOrCreateWidgetConversation(
    businessId,
    visitorId,
  );

  // 5. Fetch previous message history and subscription branding in parallel
  const [history, branding] = await Promise.all([
    fetchConversationHistory(conversationId),
    resolveWidgetBranding(businessId),
  ]);

  // 6. Sign secure HMAC-SHA256 session token
  const sessionToken = await signWidgetSession({
    businessId,
    visitorId,
    conversationId,
  });

  const { business_id, allowed_domains, ...publicConfig } = widgetConfig;

  return NextResponse.json({
    sessionToken,
    config: publicConfig,
    conversationId,
    history,
    planTier: branding.planTier,
    showBranding: branding.showBranding,
  });
});
