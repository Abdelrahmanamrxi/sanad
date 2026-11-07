import { SupabaseClient } from "@supabase/supabase-js";
import type {
  StatProps,
  WeeklyTrafficProps,
  ConversionFunnelType,
  ConvertedLead,
  ConversationsType,
} from "./types";

/**
 * ── 1. FAST: Stat Cards Data (All Tiers) ──
 * All numbers are computed strictly from real rows in `conversations`, `visitors`, and `messages`.
 * If historical baseline data is absent, delta is omitted (never faked).
 */
export async function getStatCardsData(
  supabase: SupabaseClient,
  businessId: string
): Promise<StatProps> {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [
    totalConvRes,
    aiResolvedConvRes,
    humanResolvedConvRes,
    totalVisitorsRes,
    convThisWeekRes,
    convLastWeekRes,
    visitorsThisWeekRes,
    visitorsLastWeekRes,
    latencyRes,
  ] = await Promise.all([
    // Total conversations
    supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId),

    // AI-resolved conversations (status = 'resolved' means AI resolved it autonomously)
    supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId)
      .eq("status", "resolved"),

    // Human-resolved conversations (status = 'human_resolved' means human operator resolved it)
    supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId)
      .eq("status", "human_resolved"),

    // Total visitors
    supabase
      .from("visitors")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId),

    // Conversations: last 7 days
    supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId)
      .gte("started_at", sevenDaysAgo.toISOString()),

    // Conversations: previous 7-14 days (for real delta comparison)
    supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId)
      .gte("started_at", fourteenDaysAgo.toISOString())
      .lt("started_at", sevenDaysAgo.toISOString()),

    // Visitors: last 7 days
    supabase
      .from("visitors")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId)
      .gte("first_seen_at", sevenDaysAgo.toISOString()),

    // Visitors: previous 7-14 days (for real delta comparison)
    supabase
      .from("visitors")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId)
      .gte("first_seen_at", fourteenDaysAgo.toISOString())
      .lt("first_seen_at", sevenDaysAgo.toISOString()),

    // Real assistant latency samples
    supabase
      .from("messages")
      .select("latency_ms")
      .eq("business_id", businessId)
      .eq("role", "assistant")
      .not("latency_ms", "is", null)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const totalConv = totalConvRes.count ?? 0;
  const aiResolvedConv = aiResolvedConvRes.count ?? 0;
  const totalVisitors = totalVisitorsRes.count ?? 0;

  // Real AI Auto-Resolution Rate (status = 'active' means AI resolved it)
  const aiResolutionPct =
    totalConv > 0 ? Math.round((aiResolvedConv / totalConv) * 100) : 0;

  // Real delta calculations (only if baseline data exists)
  const convThisWeek = convThisWeekRes.count ?? 0;
  const convLastWeek = convLastWeekRes.count ?? 0;
  let convDelta: string | undefined = undefined;
  let convDeltaType: "positive" | "negative" = "positive";

  if (convLastWeek > 0) {
    const diff = Math.round(((convThisWeek - convLastWeek) / convLastWeek) * 100);
    convDelta = `${diff >= 0 ? "+" : ""}${diff}%`;
    convDeltaType = diff >= 0 ? "positive" : "negative";
  }

  const visThisWeek = visitorsThisWeekRes.count ?? 0;
  const visLastWeek = visitorsLastWeekRes.count ?? 0;
  let visDelta: string | undefined = undefined;
  let visDeltaType: "positive" | "negative" = "positive";

  if (visLastWeek > 0) {
    const diff = Math.round(((visThisWeek - visLastWeek) / visLastWeek) * 100);
    visDelta = `${diff >= 0 ? "+" : ""}${diff}%`;
    visDeltaType = diff >= 0 ? "positive" : "negative";
  }

  // Real Latency Calculation
  const latencies = (latencyRes.data || [])
    .map((m) => m.latency_ms as number)
    .filter((n) => typeof n === "number" && !isNaN(n));

  const avgLatency =
    latencies.length > 0
      ? `${Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)}ms`
      : "—";

  return {
    conversations: {
      label: "Total Conversations",
      description: "Total customer conversations logged",
      value: totalConv.toLocaleString(),
      delta: convDelta,
      deltaType: convDeltaType,
    },
    visitors: {
      label: "Total Visitors",
      description: "Unique widget visitors captured",
      value: totalVisitors.toLocaleString(),
      delta: visDelta,
      deltaType: visDeltaType,
    },
    resolutionRate: {
      label: "AI Auto-Resolution",
      description: "Resolved autonomously by AI (without escalation)",
      value: totalConv > 0 ? `${aiResolutionPct}%` : "—",
      progress: aiResolutionPct,
    },
    avgResponse: {
      label: "Avg AI Latency",
      description: "Mean response speed across conversations",
      value: avgLatency,
    },
  };
}

/**
 * ── 2. FAST: Recent Conversations (All Tiers) ──
 * Direct select of latest conversations with real anon_id and latest message.
 */
export async function getRecentConversationsData(
  supabase: SupabaseClient,
  businessId: string
): Promise<ConversationsType[]> {
  const { data: convs } = await supabase
    .from("conversations")
    .select(`
      id,
      visitor_id,
      channel,
      status,
      summary,
      last_message_at,
      visitors (anon_id)
    `)
    .eq("business_id", businessId)
    .order("last_message_at", { ascending: false })
    .limit(5);

  if (!convs || convs.length === 0) {
    return [];
  }

  // Fetch the latest message for each conversation to display actual inquiry content
  const convIds = convs.map((c) => c.id);
  const { data: messages } = await supabase
    .from("messages")
    .select("conversation_id, content, latency_ms, created_at")
    .in("conversation_id", convIds)
    .order("created_at", { ascending: false });

  const msgMap = new Map<string, { content: string; latency_ms?: number | null }>();
  (messages || []).forEach((m) => {
    if (!msgMap.has(m.conversation_id)) {
      msgMap.set(m.conversation_id, {
        content: m.content,
        latency_ms: m.latency_ms,
      });
    }
  });

  return convs.map((conv) => {
    const anonId = (conv.visitors as unknown as { anon_id?: string })?.anon_id;
    const latestMsg = msgMap.get(conv.id);

    const statusMapped: "resolved" | "active" | "escalated" | "contacted" | "human_resolved" =
      conv.status === "needs_attention"
        ? "escalated"
        : conv.status === "human_resolved"
          ? "human_resolved"
          : conv.status === "contacted"
            ? "contacted"
            : conv.status === "resolved"
              ? "resolved"
              : "active";

    const latencyFormatted =
      latestMsg?.latency_ms !== null && latestMsg?.latency_ms !== undefined
        ? `${latestMsg.latency_ms}ms`
        : "—";

    const formattedTime = conv.last_message_at
      ? new Date(conv.last_message_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

    return {
      id: conv.id,
      visitorId: anonId
        ? `Visitor #${anonId.slice(0, 6)}`
        : `Visitor #${conv.id.slice(0, 6)}`,
      channel: (conv.channel as "widget" | "test") || "widget",
      message: conv.summary || latestMsg?.content || "Conversation started",
      status: statusMapped,
      latency: latencyFormatted,
      time: formattedTime,
    };
  });
}

/**
 * ── 3. STARTER & PRO: Resolution & Lead Funnel ──
 * Real calculations:
 * - Total visitors: count(visitors)
 * - Engaged visitors: count(distinct visitor_id from conversations)
 * - Captured leads: count(leads)
 */
export async function getResolutionFunnelData(
  supabase: SupabaseClient,
  businessId: string
) {
  const [visitorCountRes, engagedVisitorsRes, leadsRes] = await Promise.all([
    // Total visitors count
    supabase
      .from("visitors")
      .select("*", { count: "exact", head: true })
      .eq("business_id", businessId),

    // Real distinct engaged visitors who initiated conversations
    supabase
      .from("conversations")
      .select("visitor_id")
      .eq("business_id", businessId)
      .not("visitor_id", "is", null),

    // Latest converted leads with real details
    supabase
      .from("leads")
      .select("id, name, email, phone, company, status, notes, origin_page, created_at, visitor_id")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const totalVisitors = visitorCountRes.count ?? 0;
  
  // Real distinct count of engaged visitors
  const uniqueEngagedSet = new Set(
    (engagedVisitorsRes.data || [])
      .map((r) => r.visitor_id)
      .filter(Boolean)
  );
  const engagedVisitors = uniqueEngagedSet.size;

  const rawLeads = leadsRes.data || [];
  const capturedLeads = rawLeads.length;

  const overallRate =
    totalVisitors > 0
      ? `${((capturedLeads / totalVisitors) * 100).toFixed(1)}%`
      : "0.0%";

  const chatToLeadRate =
    engagedVisitors > 0
      ? `${((capturedLeads / engagedVisitors) * 100).toFixed(1)}%`
      : "0.0%";

  const conversionFunnel: ConversionFunnelType = {
    totalVisitors,
    engagedVisitors,
    capturedLeads,
    overallRate,
    chatToLeadRate,
  };

  const convertedLeads: ConvertedLead[] = rawLeads.map((lead) => {
    const statusFormatted: "New Lead" | "Contacted" | "Qualified" =
      lead.status === "qualified"
        ? "Qualified"
        : lead.status === "contacted"
          ? "Contacted"
          : "New Lead";

    return {
      id: lead.id,
      name: lead.name || "Anonymous Lead",
      email: lead.email || "No email provided",
      phone: lead.phone || "—",
      intent: lead.status === "qualified" ? "high" : "medium",
      intentLabel: lead.status === "qualified" ? "High Intent" : "Engaged",
      topic: lead.origin_page || lead.notes || "Website Widget Inquiry",
      chats: 1,
      convertedAt: lead.created_at
        ? new Date(lead.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "—",
      status: statusFormatted,
    };
  });

  return { conversionFunnel, convertedLeads };
}

/**
 * ── 4. PRO ONLY: 7-Day Traffic Aggregation ──
 * Pure aggregation of real conversations grouped by day of the week.
 */
export async function getDailyTrafficData(
  supabase: SupabaseClient,
  businessId: string
): Promise<WeeklyTrafficProps[]> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data } = await supabase
    .from("conversations")
    .select("started_at, status")
    .eq("business_id", businessId)
    .gte("started_at", sevenDaysAgo.toISOString());

  // Week structure in standard order
  const dayOrder = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  const daysMap: Record<
    string,
    { total: number; aiAnswered: number; needsReview: number }
  > = {
    Sat: { total: 0, aiAnswered: 0, needsReview: 0 },
    Sun: { total: 0, aiAnswered: 0, needsReview: 0 },
    Mon: { total: 0, aiAnswered: 0, needsReview: 0 },
    Tue: { total: 0, aiAnswered: 0, needsReview: 0 },
    Wed: { total: 0, aiAnswered: 0, needsReview: 0 },
    Thu: { total: 0, aiAnswered: 0, needsReview: 0 },
    Fri: { total: 0, aiAnswered: 0, needsReview: 0 },
  };

  const dayMapIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  (data || []).forEach((row) => {
    if (row.started_at) {
      const dayName = dayMapIndex[new Date(row.started_at).getDay()];
      if (daysMap[dayName]) {
        daysMap[dayName].total += 1;
        if (row.status === "needs_attention") {
          daysMap[dayName].needsReview += 1;
        } else {
          // AI Answered: includes 'active', 'resolved', and any non-escalated chats
          daysMap[dayName].aiAnswered += 1;
        }
      }
    }
  });

  return dayOrder.map((day) => ({
    day,
    total: daysMap[day].total,
    aiAnswered: daysMap[day].aiAnswered,
    needsReview: daysMap[day].needsReview,
  }));
}

