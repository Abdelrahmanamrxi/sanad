import { NextResponse } from "next/server";
import { z } from "zod";
import { handle } from "@/http/async-handler";
import AppError from "@/http/error";
import { verifyWidgetSession } from "@/features/embed/server/token";
import { supabaseAdminClient } from "@/lib/supabase/admin";

const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name cannot exceed 60 characters"),
  phone: z
    .string()
    .trim()
    .min(8, "Phone number must be at least 8 digits")
    .max(25, "Phone number is too long"),
  email: z
    .string()
    .trim()
    .email("Invalid email address format")
    .optional()
    .or(z.literal("")),
  originPage: z.string().optional(),
});

export const POST = handle(async (req: Request) => {
  // 1) Authenticate user with existing widget session token
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Unauthorized: Missing session token", 401);
  }

  const token = authHeader.slice(7).trim();
  const session = await verifyWidgetSession(token);

  if (!session) {
    throw new AppError("Invalid or expired session token. Please refresh the chat.", 401);
  }

  const { businessId, conversationId, visitorId } = session;

  // 2) Validate Payload
  const body = await req.json().catch(() => null);
  if (!body) {
    throw new AppError("Empty or malformed request payload", 400);
  }

  const parsedLead = leadSchema.safeParse(body);

  if (!parsedLead.success) {
    const errorMsg = parsedLead.error.issues[0]?.message || "Invalid lead data";
    throw new AppError(errorMsg, 400);
  }

  const { name, email, phone, originPage } = parsedLead.data;

  // 3) Insert and update lead record

  const { data:lead, error: leadError } = await supabaseAdminClient
    .from("leads")
    .insert({
      business_id: businessId,
      visitor_id:visitorId,
      name,
      phone,
      email: email || null,
      origin_page: originPage || null,
      status: "new",
    })
    .select("id")
    .single();

  if (leadError) {
    throw new AppError("Failed to Insert new Lead", 500);
  }

  //4) Update Vistor's Table and Link lead to active conversation

  await supabaseAdminClient.from("conversations").update({
    has_lead:true,
    lead_id:lead.id,
    status:'active'
  }).eq('id',conversationId)

  return NextResponse.json({
    success:true,
    leadId:lead.id,
    message:"Lead recorded successfully"
  });
});
