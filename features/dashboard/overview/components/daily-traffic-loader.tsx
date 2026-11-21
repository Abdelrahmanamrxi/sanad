import DailyTraffic from "./daily-traffic";
import { getDailyTrafficData } from "../data";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DailyTrafficLocked } from "./daily-traffic-locked";

export async function DailyTrafficLoader({
  supabase,
  businessId,
  isPro,
}: {
  supabase: SupabaseClient;
  businessId: string;
  isPro: boolean;
}) {
  // If NOT Pro, render the locked preview instantly — ZERO DB QUERIES!
  if (!isPro) {
    return <DailyTrafficLocked />;
  }

  // Only Pro users execute this query
  const weeklyTraffic = await getDailyTrafficData(supabase, businessId);
  return <DailyTraffic weeklyTraffic={weeklyTraffic} />;
}

export function DailyTrafficSkeleton() {
  return (
    <div className="border border-border bg-card p-5 animate-pulse min-h-[300px] flex flex-col justify-between rounded-none">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-muted rounded-none" />
        <div className="h-3 w-56 bg-muted/60 rounded-none" />
      </div>
      <div className="h-44 bg-muted/40 my-4 rounded-none" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/50">
        <div className="h-10 bg-muted/30 rounded-none" />
        <div className="h-10 bg-muted/30 rounded-none" />
        <div className="h-10 bg-muted/30 rounded-none" />
        <div className="h-10 bg-muted/30 rounded-none" />
      </div>
    </div>
  );
}
