"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MessageSquare,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CircleAlert,
  ChevronRight,
  ArrowUpRight,
  MapPin,
  Mail,
  UserCheck,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Phone,
  Flame,
} from "lucide-react"

/* ── mock data ── */

const stats = [
  {
    label: "Conversations",
    value: "1,284",
    delta: "+12%",
    deltaType: "positive" as const,
    icon: MessageSquare,
  },
  {
    label: "Total Visitors",
    value: "842",
    delta: "+8%",
    deltaType: "positive" as const,
    icon: Users,
  },
  {
    label: "Resolution Rate",
    value: "87%",
    progress: 87,
    icon: CheckCircle2,
  },
  {
    label: "Avg Response",
    value: "310ms",
    delta: "-45ms",
    deltaType: "positive" as const,
    icon: Clock,
  },
]

const weeklyTraffic = [
  { day: "Sat", total: 142, resolved: 124 },
  { day: "Sun", total: 198, resolved: 172 },
  { day: "Mon", total: 245, resolved: 214 },
  { day: "Tue", total: 289, resolved: 251 },
  { day: "Wed", total: 264, resolved: 230 },
  { day: "Thu", total: 312, resolved: 271 },
  { day: "Fri", total: 184, resolved: 162 },
]

type AttentionSeverity = "urgent" | "warning" | "gap"

interface AttentionItem {
  id: string
  category: "escalation" | "accuracy" | "gap"
  severity: AttentionSeverity
  badge: string
  title: string
  description: string
  querySnippet?: string
  waitOrTime: string
  actionLabel: string
  href: string
}

const attentionItems: AttentionItem[] = [
  {
    id: "att-1",
    category: "escalation",
    severity: "urgent",
    badge: "Escalation",
    title: "Visitor #839 requested live agent",
    description: "Order #1042 delivery delay — user asked for human operator",
    querySnippet: "محتاج اتكلم مع حد ضروري، الاوردر متأخر بقاله يومين ومفيش تحديث",
    waitOrTime: "Waiting 14m",
    actionLabel: "Take Over",
    href: "/dashboard/conversations",
  },
  {
    id: "att-2",
    category: "accuracy",
    severity: "warning",
    badge: "Low Score (0.42)",
    title: "3 low-confidence queries (< 55%)",
    description: "AI retrieval similarity fell below threshold on return policy",
    querySnippet: "هل في مصاريف شحن للاسترجاع الدولي من السعودية؟",
    waitOrTime: "1h ago",
    actionLabel: "Review Answers",
    href: "/dashboard/conversations",
  },
  {
    id: "att-3",
    category: "gap",
    severity: "gap",
    badge: "Knowledge Gap",
    title: "Unanswered topic: Installment Plans",
    description: "5 visitors asked today with 0 relevant chunks matched",
    querySnippet: "هل متاح تقسيط بدون فوائد عن طريق فاليو أو تابي؟",
    waitOrTime: "3h ago",
    actionLabel: "Add to Docs",
    href: "/dashboard/knowledge-base",
  },
]

const conversations = [
  {
    id: "conv-1",
    visitor: "Visitor #842",
    channel: "widget",
    message: "عايز اعرف مصاريف الشحن لمدينة نصر؟",
    status: "Resolved" as const,
    latency: "280ms",
    time: "5m ago",
  },
  {
    id: "conv-2",
    visitor: "Visitor #841",
    channel: "widget",
    message: "هل متاح الدفع عند الاستلام؟",
    status: "Resolved" as const,
    latency: "310ms",
    time: "24m ago",
  },
  {
    id: "conv-3",
    visitor: "Visitor #839",
    channel: "widget",
    message: "محتاج اتابع الاوردر رقم 1042 مع خدمة العملاء",
    status: "Escalated" as const,
    latency: "190ms",
    time: "14m ago",
  },
  {
    id: "conv-4",
    visitor: "Visitor #835",
    channel: "test",
    message: "Testing return policy response flow",
    status: "Resolved" as const,
    latency: "245ms",
    time: "3h ago",
  },
]

/* ── visitor => leads funnel & captured leads ── */

const conversionFunnel = {
  totalVisitors: 842,
  engagedVisitors: 318, // 37.8% chat engagement
  capturedLeads: 34,    // 4.0% of total visitors, 10.7% of engaged
  overallRate: "4.0%",
  rateDelta: "+0.8%",
  chatToLeadRate: "10.7%",
  avgTimeToConvert: "2m 14s",
}

interface ConvertedLead {
  id: string
  name: string
  email: string
  phone: string
  location: string
  intent: "high" | "medium"
  intentLabel: string
  topic: string
  chats: number
  convertedAt: string
  status: "New Lead" | "Contacted" | "Qualified"
}

const convertedLeads: ConvertedLead[] = [
  {
    id: "lead-1",
    name: "Ahmed Hassan",
    email: "ahmed.hassan@outlook.com",
    phone: "+20 100 ••• 5892",
    location: "Cairo",
    intent: "high",
    intentLabel: "Enterprise Pricing",
    topic: "Inquired about dedicated API rate limits & SLA",
    chats: 4,
    convertedAt: "12m ago",
    status: "New Lead",
  },
  {
    id: "lead-2",
    name: "Nour El-Din",
    email: "nour.eldin@techsol.io",
    phone: "+20 112 ••• 8140",
    location: "Alexandria",
    intent: "high",
    intentLabel: "Booked Demo",
    topic: "Requested live onboarding session for 12 agents",
    chats: 8,
    convertedAt: "1h ago",
    status: "Contacted",
  },
  {
    id: "lead-3",
    name: "Mariam Youssef",
    email: "mariam.y@brandstudio.eg",
    phone: "+20 120 ••• 1923",
    location: "Giza",
    intent: "medium",
    intentLabel: "Pricing Sheet",
    topic: "Provided email to download e-commerce pricing table",
    chats: 2,
    convertedAt: "3h ago",
    status: "New Lead",
  },
  {
    id: "lead-4",
    name: "Omar Khaled",
    email: "omar.khaled@logistics.net",
    phone: "+20 109 ••• 3317",
    location: "Mansoura",
    intent: "high",
    intentLabel: "Contract Review",
    topic: "Requested standard vendor security agreement",
    chats: 5,
    convertedAt: "5h ago",
    status: "Qualified",
  },
]

/* ── component ── */

export default function DashboardPage() {
  const [attentionFilter, setAttentionFilter] = useState<"all" | "escalation" | "accuracy" | "gap">("all")
  const maxTraffic = Math.max(...weeklyTraffic.map((d) => d.total))

  const filteredAttention = attentionItems.filter((item) => {
    if (attentionFilter === "all") return true
    return item.category === attentionFilter
  })

  // Funnel percentages for display
  const engagedPct = ((conversionFunnel.engagedVisitors / conversionFunnel.totalVisitors) * 100).toFixed(1)
  const leadPct = ((conversionFunnel.capturedLeads / conversionFunnel.totalVisitors) * 100).toFixed(1)

  return (
    <div className="flex flex-col gap-6">
      {/* ── Row 1: Stat Cards ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </span>
                <Icon className="size-4 text-muted-foreground" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
                {stat.delta && (
                  <span
                    className={
                      stat.deltaType === "positive"
                        ? "font-mono text-xs text-success"
                        : "font-mono text-xs text-destructive"
                    }
                  >
                    {stat.delta}
                  </span>
                )}
              </div>
              {stat.progress !== undefined && (
                <div className="mt-2 h-1 w-full bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Row 2: Daily Traffic (lg:col-span-3) + Needs Attention (lg:col-span-2) ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Daily Traffic */}
        <div className="border border-border bg-card p-5 lg:col-span-3 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Daily Traffic
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Weekly conversation volume and AI auto-resolution
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2 bg-primary" />
                Total Volume
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-2 bg-success" />
                AI Resolved
              </span>
            </div>
          </div>

          {/* Dynamic Full-Height Bar Chart with Y-Axis Gridlines */}
          <div className="relative my-4 flex-1 min-h-[220px] flex flex-col justify-between">
            {/* Horizontal reference gridlines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7">
              <div className="flex items-center border-b border-border/40 border-dashed">
                <span className="w-7 font-mono text-[9px] text-muted-foreground/60">300</span>
              </div>
              <div className="flex items-center border-b border-border/40 border-dashed">
                <span className="w-7 font-mono text-[9px] text-muted-foreground/60">200</span>
              </div>
              <div className="flex items-center border-b border-border/40 border-dashed">
                <span className="w-7 font-mono text-[9px] text-muted-foreground/60">100</span>
              </div>
              <div className="flex items-center border-b border-border/70">
                <span className="w-7 font-mono text-[9px] text-muted-foreground/60">0</span>
              </div>
            </div>

            {/* Bars container */}
            <div className="relative z-10 flex h-full items-end gap-2 ps-8 pe-2 pb-1">
              {weeklyTraffic.map((day) => {
                const totalH = (day.total / maxTraffic) * 100
                const resolvedH = (day.resolved / maxTraffic) * 100
                return (
                  <div
                    key={day.day}
                    className="flex flex-1 flex-col items-center h-full justify-end"
                  >
                    <div className="flex w-full items-end justify-center gap-1.5 h-full">
                      <div
                        className="w-2/5 bg-primary/30 border border-primary/50 transition-all hover:bg-primary/50"
                        style={{ height: `${totalH}%` }}
                        title={`Total: ${day.total}`}
                      />
                      <div
                        className="w-2/5 bg-success transition-all hover:opacity-85"
                        style={{ height: `${resolvedH}%` }}
                        title={`Resolved: ${day.resolved}`}
                      />
                    </div>
                    <div className="mt-2 flex flex-col items-center leading-none">
                      <span className="font-mono text-[11px] font-medium text-foreground">
                        {day.day}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground mt-0.5">
                        {day.total}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Structured desktop breakdown metrics */}
          <div className="grid grid-cols-2 gap-2.5 border-t border-border pt-4 sm:grid-cols-4">
            <div className="border border-border bg-background p-2.5">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                Weekly Chats
              </span>
              <span className="font-mono text-sm font-bold text-foreground">
                1,634
              </span>
            </div>
            <div className="border border-border bg-background p-2.5">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                AI Resolved
              </span>
              <span className="font-mono text-sm font-bold text-success">
                1,418 <span className="text-[10px] font-normal text-muted-foreground">(86.8%)</span>
              </span>
            </div>
            <div className="border border-border bg-background p-2.5">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                Escalated
              </span>
              <span className="font-mono text-sm font-bold text-highlight">
                216 <span className="text-[10px] font-normal text-muted-foreground">(13.2%)</span>
              </span>
            </div>
            <div className="border border-border bg-background p-2.5">
              <span className="block font-mono text-[10px] uppercase text-muted-foreground">
                Busiest Day
              </span>
              <span className="font-mono text-sm font-bold text-foreground">
                Thu <span className="text-[10px] font-normal text-muted-foreground">(312)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Needs Attention */}
        <div className="border border-border bg-card p-5 lg:col-span-2 flex flex-col justify-between">
          <div>
            {/* Header with counter & filters */}
            <div className="border-b border-border pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block size-2 bg-destructive animate-pulse" />
                  <h2 className="text-sm font-semibold text-foreground">
                    Needs Attention
                  </h2>
                </div>
                <span className="border border-destructive/30 bg-destructive/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase text-destructive">
                  3 Actions Required
                </span>
              </div>

              {/* Filter Tabs */}
              <div className="mt-3 flex items-center gap-1 border-t border-border/50 pt-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setAttentionFilter("all")}
                  className={`px-2 py-0.5 font-mono transition-colors ${
                    attentionFilter === "all"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  All (3)
                </button>
                <button
                  type="button"
                  onClick={() => setAttentionFilter("escalation")}
                  className={`px-2 py-0.5 font-mono transition-colors ${
                    attentionFilter === "escalation"
                      ? "bg-destructive text-destructive-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Escalation (1)
                </button>
                <button
                  type="button"
                  onClick={() => setAttentionFilter("accuracy")}
                  className={`px-2 py-0.5 font-mono transition-colors ${
                    attentionFilter === "accuracy"
                      ? "bg-highlight text-highlight-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Low Score (1)
                </button>
                <button
                  type="button"
                  onClick={() => setAttentionFilter("gap")}
                  className={`px-2 py-0.5 font-mono transition-colors ${
                    attentionFilter === "gap"
                      ? "bg-secondary text-secondary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Doc Gap (1)
                </button>
              </div>
            </div>

            {/* List of Actionable Attention Items */}
            <div className="mt-3 flex flex-col gap-2.5">
              {filteredAttention.map((item) => {
                const isUrgent = item.severity === "urgent"
                const isWarning = item.severity === "warning"

                return (
                  <div
                    key={item.id}
                    className={`border p-2.5 transition-colors ${
                      isUrgent
                        ? "border-destructive/40 bg-destructive/5 border-s-4 border-s-destructive"
                        : isWarning
                        ? "border-highlight/40 bg-highlight/5 border-s-4 border-s-highlight"
                        : "border-primary/40 bg-primary/5 border-s-4 border-s-primary"
                    }`}
                  >
                    {/* Top line: Badge + Time + Action Button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isUrgent ? (
                          <CircleAlert className="size-3.5 text-destructive" />
                        ) : isWarning ? (
                          <AlertTriangle className="size-3.5 text-highlight" />
                        ) : (
                          <BookOpen className="size-3.5 text-primary" />
                        )}
                        <span
                          className={`font-mono text-[9px] font-semibold uppercase px-1 py-px border ${
                            isUrgent
                              ? "border-destructive/30 bg-destructive/10 text-destructive"
                              : isWarning
                              ? "border-highlight/30 bg-highlight/10 text-highlight"
                              : "border-primary/30 bg-primary/10 text-primary"
                          }`}
                        >
                          {item.badge}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground ms-1">
                          {item.waitOrTime}
                        </span>
                      </div>

                      <Link
                        href={item.href}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium transition-colors ${
                          isUrgent
                            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            : "border border-border bg-background hover:bg-muted text-foreground"
                        }`}
                      >
                        {item.actionLabel}
                        <ArrowRight className="size-2.5" />
                      </Link>
                    </div>

                    {/* Middle: Title & Description */}
                    <h3 className="mt-1.5 text-xs font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {item.description}
                    </p>

                    {/* Bottom: Arabic quote isolated with dir="rtl" */}
                    {item.querySnippet && (
                      <div className="mt-1.5 border border-border/80 bg-background/60 px-2.5 py-1">
                        <p dir="rtl" className="text-[11px] text-muted-foreground font-sans line-clamp-1 text-start">
                          &ldquo;{item.querySnippet}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Sync status footer */}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CheckCircle2 className="size-3.5 text-success" />
              <span>KB sync healthy (48 chunks indexed)</span>
            </div>
            <Link
              href="/dashboard/knowledge-base"
              className="font-mono text-[11px] text-primary hover:underline flex items-center gap-1"
            >
              <RefreshCw className="size-3" />
              Sync Now
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 3: Dedicated Visitor => Leads Conversion Section (Full Width) ── */}
      <div className="border border-border bg-card p-5">
        {/* Header: Title + KPIs */}
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Visitor → Lead Conversion
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Complete pipeline tracking anonymous widget visitors turned into identified, high-intent leads
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 border border-success/30 bg-success/10 px-2.5 py-1">
              <ArrowUpRight className="size-3.5 text-success" />
              <span className="font-mono text-xs font-bold text-success">
                {conversionFunnel.overallRate}
              </span>
              <span className="font-mono text-[10px] text-success/80">
                {conversionFunnel.rateDelta}
              </span>
            </div>
            <div className="border border-border bg-background px-2.5 py-1 text-xs">
              <span className="text-muted-foreground me-1 text-[11px]">Chat-to-Lead:</span>
              <span className="font-mono font-semibold text-foreground">{conversionFunnel.chatToLeadRate}</span>
            </div>
            <div className="border border-border bg-background px-2.5 py-1 text-xs">
              <span className="text-muted-foreground me-1 text-[11px]">Avg Time:</span>
              <span className="font-mono font-semibold text-foreground">{conversionFunnel.avgTimeToConvert}</span>
            </div>
          </div>
        </div>

        {/* Funnel Pipeline Visualizer */}
        <div className="mt-4 border border-border bg-background p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              Acquisition Funnel
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              1 in 25 visitors converted ({conversionFunnel.capturedLeads} qualified leads)
            </span>
          </div>

          {/* Tiered Visual Funnel Bar across full width */}
          <div className="mt-3 flex h-3 w-full border border-border/80 bg-muted overflow-hidden">
            <div
              className="bg-primary/40 border-e border-border transition-all"
              style={{ width: "100%" }}
              title={`Total Visitors: ${conversionFunnel.totalVisitors}`}
            />
            <div
              className="bg-primary border-e border-border transition-all"
              style={{ width: `${engagedPct}%` }}
              title={`Engaged Visitors: ${conversionFunnel.engagedVisitors}`}
            />
            <div
              className="bg-success transition-all"
              style={{ width: `${leadPct}%` }}
              title={`Captured Leads: ${conversionFunnel.capturedLeads}`}
            />
          </div>

          {/* 3 Funnel Stages Grid */}
          <div className="mt-3 grid grid-cols-1 gap-3 border-t border-border/60 pt-3 sm:grid-cols-3">
            <div className="border border-border/60 bg-card p-3">
              <span className="block text-[10px] text-muted-foreground uppercase font-mono">
                1. Total Visitors
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-xl font-bold text-foreground">
                  {conversionFunnel.totalVisitors}
                </span>
                <span className="font-mono text-xs text-muted-foreground">100%</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                All unique visitors who loaded the site & widget
              </p>
            </div>

            <div className="border border-border/60 bg-card p-3">
              <span className="block text-[10px] text-muted-foreground uppercase font-mono">
                2. Engaged in Chat
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-xl font-bold text-primary">
                  {conversionFunnel.engagedVisitors}
                </span>
                <span className="font-mono text-xs text-primary font-semibold">{engagedPct}%</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Opened widget and sent at least one inquiry
              </p>
            </div>

            <div className="border border-border/60 bg-card p-3">
              <span className="block text-[10px] text-muted-foreground uppercase font-mono">
                3. Captured Leads
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-xl font-bold text-success">
                  {conversionFunnel.capturedLeads}
                </span>
                <span className="font-mono text-xs text-success font-semibold">{conversionFunnel.overallRate}</span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Provided verified contact details or booked demo
              </p>
            </div>
          </div>
        </div>

        {/* Full-width Converted Leads Table */}
        <div className="mt-5">
          <div className="flex items-center justify-between border-b border-border pb-2 text-xs">
            <span className="font-semibold text-foreground">
              Recent Converted Leads ({conversionFunnel.capturedLeads} total)
            </span>
            <Link
              href="/dashboard/conversations"
              className="flex items-center gap-1 font-mono text-[11px] text-primary hover:underline"
            >
              <span>View all leads</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {convertedLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex flex-col gap-2 py-3 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between px-1"
              >
                {/* Lead Profile */}
                <div className="flex items-center gap-3 min-w-0 sm:w-1/3">
                  <div className="flex size-8 shrink-0 items-center justify-center border border-border bg-muted text-xs font-semibold text-foreground">
                    {lead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-foreground">
                      {lead.name}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                      <span>{lead.email}</span>
                      <span className="text-border">|</span>
                      <span>{lead.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Intent Topic & Details */}
                <div className="min-w-0 sm:w-1/3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`border px-1.5 py-px text-[9px] font-mono uppercase ${
                        lead.intent === "high"
                          ? "border-highlight/40 bg-highlight/10 text-highlight"
                          : "border-border bg-muted text-muted-foreground"
                      }`}
                    >
                      {lead.intentLabel}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                      <MapPin className="size-3" />
                      {lead.location}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {lead.topic}
                  </p>
                </div>

                {/* Status & Time */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 sm:w-1/4">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {lead.chats} chats
                  </span>
                  <span
                    className={`border px-2 py-0.5 text-[10px] font-medium uppercase font-mono ${
                      lead.status === "New Lead"
                        ? "border-success/30 bg-success/10 text-success"
                        : lead.status === "Qualified"
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground"
                    }`}
                  >
                    {lead.status}
                  </span>
                  <span className="font-mono text-[11px] text-muted-foreground w-16 text-end">
                    {lead.convertedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 4: Recent Conversations (Full Width) ── */}
      <div className="border border-border bg-card p-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Recent Conversations
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Latest live customer interactions handled by the Sanad AI assistant
            </p>
          </div>
          <Link
            href="/dashboard/conversations"
            className="flex items-center gap-0.5 text-xs font-medium text-primary hover:underline"
          >
            View all
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-border">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="flex items-center justify-between py-3.5 transition-colors hover:bg-muted/30 px-1"
            >
              <div className="min-w-0 flex-1 pe-6">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {conv.visitor}
                  </span>
                  <span className="border border-border bg-muted px-1.5 py-px font-mono text-[10px] text-muted-foreground uppercase">
                    {conv.channel}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    latency: {conv.latency}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground dir-rtl text-start">
                  {conv.message}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span
                  className={`border px-2 py-0.5 text-[10px] font-medium uppercase font-mono ${
                    conv.status === "Resolved"
                      ? "border-success/30 bg-success/10 text-success"
                      : "border-destructive/30 bg-destructive/10 text-destructive"
                  }`}
                >
                  {conv.status}
                </span>
                <span className="font-mono text-[11px] text-muted-foreground w-16 text-end">
                  {conv.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}