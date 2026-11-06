import DailyTraffic from "./daily-traffic";
import { getDailyTrafficData } from "../data";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SupabaseClient } from "@supabase/supabase-js";

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
    return (
      <div className="border border-dashed border-border bg-card/60 p-8 flex flex-col items-center justify-center text-center min-h-[280px]">
        <div className="size-10 border border-border bg-background flex items-center justify-center mb-3">
          <Lock className="size-4 text-highlight" />
        </div>
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          Daily Traffic & Resolution Analytics
        </h3>
        <p className="font-sans text-xs text-muted-foreground max-w-sm mt-1 mb-4">
          Detailed 7-day conversation distribution, auto-resolution rates, and peak hour trends. Available on Flagship Pro.
        </p>
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/dashboard/billing" />}
          nativeButton={false}
          className="font-sans text-xs font-semibold"
        >
          <Sparkles className="size-3.5 text-highlight" />
          <span>Upgrade to Pro</span>
        </Button>
      </div>
    );
  }

  // Only Pro users execute this query
  const weeklyTraffic = await getDailyTrafficData(supabase, businessId);
  return <DailyTraffic weeklyTraffic={weeklyTraffic} />;
}

export function DailyTrafficSkeleton() {
  return (
    <div className="border border-border bg-card p-5 animate-pulse min-h-[300px] flex flex-col justify-between">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-muted" />
        <div className="h-3 w-56 bg-muted/60" />
      </div>
      <div className="h-44 bg-muted/40 my-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/50">
        <div className="h-10 bg-muted/30" />
        <div className="h-10 bg-muted/30" />
        <div className="h-10 bg-muted/30" />
        <div className="h-10 bg-muted/30" />
      </div>
    </div>
  );
}
