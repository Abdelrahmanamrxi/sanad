import ResolutionRate from "./resolution-rate";
import { getResolutionFunnelData } from "../data";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ResolutionRateLocked } from "./resolution-rate-locked";

export async function ResolutionRateLoader({
  supabase,
  businessId,
  isStarterOrAbove,
}: {
  supabase: SupabaseClient;
  businessId: string;
  isStarterOrAbove: boolean;
}) {
  // If Free plan, render the locked preview instantly — ZERO DB QUERIES!
  if (!isStarterOrAbove) {
    return <ResolutionRateLocked />;
  }

  // Only Starter & Pro execute this query
  const { conversionFunnel, convertedLeads } = await getResolutionFunnelData(
    supabase,
    businessId
  );

  return (
    <ResolutionRate
      convertedLeads={convertedLeads}
      conversionFunnel={conversionFunnel}
    />
  );
}

export function ResolutionRateSkeleton() {
  return (
    <div className="border border-border bg-card p-5 animate-pulse min-h-[320px] space-y-4 rounded-none">
      <div className="flex justify-between items-center border-b border-border/60 pb-3">
        <div className="space-y-1.5">
          <div className="h-4 w-40 bg-muted rounded-none" />
          <div className="h-3 w-64 bg-muted/60 rounded-none" />
        </div>
        <div className="h-8 w-24 bg-muted/50 rounded-none" />
      </div>
      <div className="h-10 bg-muted/30 rounded-none" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="h-20 bg-muted/40 rounded-none" />
        <div className="h-20 bg-muted/40 rounded-none" />
        <div className="h-20 bg-muted/40 rounded-none" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-12 bg-muted/20 rounded-none" />
        <div className="h-12 bg-muted/20 rounded-none" />
      </div>
    </div>
  );
}
