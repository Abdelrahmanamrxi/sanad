import { NextResponse } from "next/server";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { signWidgetSession } from "@/features/dashboard/widget/server/token";
import { handle } from "@/http/async-handler";
import {z} from 'zod'
import AppError from "@/http/error";
import { getHostname } from "@/lib/utils";

const sessionSchema=z.object({
    widgetKey:z.uuid(),
    anonId:z.uuid()
})



export const POST = handle(async (req) => {
  const parsedSession = sessionSchema.safeParse(await req.json()); 

  if(!parsedSession.success){
    throw new AppError("Invalid request",403)
  }
  
  const{widgetKey,anonId}=parsedSession.data

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
    .select("id, business_id, is_active, allowed_domains")
    .eq("id", widgetKey)
    .maybeSingle();

  if (widgetErr || !widgetConfig || !widgetConfig.is_active) {
    throw new AppError("Widget is unavailable or inactive", 403);
  }

  const businessId = widgetConfig.business_id as string;

  // 2) Check Allowed Domains
  const allowedDomains: string[] = widgetConfig.allowed_domains || [];

  if (allowedDomains.length > 0) {
    const callerDomain =
      getHostname(req.headers.get("origin")) ||
      getHostname(req.headers.get("referer"));

    const isLocalhost =
      process.env.NODE_ENV !== "production" &&
      (callerDomain === "localhost" || callerDomain === "127.0.0.1");

    const isAllowed =
      isLocalhost ||
      (callerDomain &&
        allowedDomains.some((raw) => {
          const d = raw.trim().toLowerCase();
          const host = callerDomain.toLowerCase();
          return host === d || host.endsWith("." + d);
        }));
    if (!isAllowed) {
      throw new AppError("Unauthorized domain for this widget", 403);
    }
  }

  // 3) Upsert Visitor in visitors table
  let visitorId: string;

  const { data: existingVisitor } = await supabaseAdminClient
    .from("visitors")
    .select("id")
    .eq("business_id", businessId)
    .eq("anon_id", anonId)
    .maybeSingle();

  if (existingVisitor) {
    visitorId = existingVisitor.id;
    await supabaseAdminClient
      .from("visitors")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", existingVisitor.id);
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

  const { business_id, allowed_domains, ...publicConfig } = widgetConfig;

  return NextResponse.json({
    sessionToken,
    config: publicConfig,
    conversationId,
    history: history ?? [],
  });
});
