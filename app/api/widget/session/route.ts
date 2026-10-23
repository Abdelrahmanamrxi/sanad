import { NextResponse } from "next/server";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { signWidgetSession } from "@/lib/widget-token";
import { handle } from "@/lib/async-handler";
import AppError from "@/lib/error";

export const POST = handle(async (req) => {
  const { widgetKey, anonId } = await req.json();

  if (!widgetKey || !anonId) {
    throw new AppError("Missing Widget Key or Anon Id", 400);
  }

  /**
   *  -- 1 VERIFY WIDGET
   *  1) Verify widget key is active
   *  2) Widget key is the unique ID relevant to the widget
   */
  const { data: widgetConfig, error: widgetErr } = await supabaseAdminClient
    .from("widget_settings")
    .select("*")
    .eq("id", widgetKey)
    .single();

  const businessId = widgetConfig.businessId as string;

  if (widgetErr || !widgetConfig || !widgetConfig.is_active) {
    throw new AppError("Widget is unavailable or inactive", 403);
  }

  // 2) Check Allowed Domains
  const origin = req.headers.get("origin") || req.headers.get("referer");

  if (
    widgetConfig.allowed_domains &&
    widgetConfig.allowed_domains.length > 0 &&
    origin
  ) {
    const url = new URL(origin);
    const isAllowed = widgetConfig.allowed_domains.some((domain: string) =>
      url.hostname.endsWith(domain),
    );

    if (!isAllowed) {
      throw new AppError("Unauthorized access to widget", 403);
    }
  }

  // Upsert Visitor in my visitors table

  let visitorId: string;

  const { data: existingVisitor } = await supabaseAdminClient
    .from("visitors")
    .select("id")
    .eq("business_id", businessId)
    .eq("anon_id", anonId)
    .single();

  if (existingVisitor) {
    visitorId = existingVisitor.id;
    await supabaseAdminClient
      .from("visitors")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", existingVisitor);
  } else {
    const { data: newVisitor, error: newVError } = await supabaseAdminClient
      .from("visitors")
      .insert({
        business_id: businessId,
        anon_id: anonId,
      })
      .select("id")
      .single();

    if (newVError) {
      throw new AppError("Failed to insert new visitor", 500);
    }
    visitorId = newVisitor.id;
  }

  // 4 Find the latest active converastion relative to the visitor or create a new one.

  let conversationId: string;

  const { data: latestConvo } = await supabaseAdminClient
    .from("conversations")
    .select("id")
    .eq("business_id", businessId)
    .eq("visitor_id", visitorId)
    .eq("channel", "widget")
    .order("last_message_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestConvo) {
    conversationId = latestConvo.id;
  } else {
    const { data: newConvo, error: newConvoError } = await supabaseAdminClient
      .from("conversations")
      .insert({
        business_id: businessId,
        visitor_id: visitorId,
        channel: "widget",
      })
      .select("id")
      .single();

    if (newConvoError)
      throw new AppError("Failed to create conversation.", 500);

    conversationId = newConvo.id;
  }
  // 5) Fetch previous messages for this conversation

  const { data: history } = await supabaseAdminClient
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  // Sign widget token for the user
  const sessionToken = await signWidgetSession({
    businessId,
    visitorId,
    conversationId,
  });

  return NextResponse.json({
    sessionToken,
    config: widgetConfig,
    conversationId,
    history: history ?? [],
  });
});
