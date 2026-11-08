import { Suspense } from "react";
import { getAuthContext } from "@/lib/auth";
import DashboardStatCards from "@/features/dashboard/overview/components/stat-cards";
import RecentConversations from "@/features/dashboard/overview/components/recent-conversations";
import {
  DailyTrafficLoader,
  DailyTrafficSkeleton,
} from "@/features/dashboard/overview/components/daily-traffic-loader";
import {
  ResolutionRateLoader,
  ResolutionRateSkeleton,
} from "@/features/dashboard/overview/components/resolution-rate-loader";
import {
  getStatCardsData,
  getRecentConversationsData,
} from "@/features/dashboard/overview/data";

export const revalidate = 0;

export default async function DashboardPage() {
  const { businessId, supabase, planTier } = await getAuthContext();

  const isStarterOrAbove = planTier === "starter" || planTier === "pro";
  const isPro = planTier === "pro";

  // Fast core data loads concurrently in ~20ms
  const [stats, conversations] = await Promise.all([
    getStatCardsData(supabase, businessId),
    getRecentConversationsData(supabase, businessId),
  ]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-full min-w-0">
      {/* ── Row 1: Core Stat Cards (Instant Paint) ── */}
      <DashboardStatCards stats={stats} />

      {/* ── Row 2: Daily Traffic (Pro Only — Streams independently or locks instantly) ── */}
      <Suspense fallback={<DailyTrafficSkeleton />}>
        <DailyTrafficLoader
          supabase={supabase}
          businessId={businessId}
          isPro={isPro}
        />
      </Suspense>

      {/* ── Row 3: Conversion Funnel (Starter & Pro — Streams independently or locks instantly) ── */}
      <Suspense fallback={<ResolutionRateSkeleton />}>
        <ResolutionRateLoader
          supabase={supabase}
          businessId={businessId}
          isStarterOrAbove={isStarterOrAbove}
        />
      </Suspense>

      {/* ── Row 4: Recent Live Customer Conversations (Instant Paint) ── */}
      <RecentConversations conversations={conversations} />
    </div>
  );
}
