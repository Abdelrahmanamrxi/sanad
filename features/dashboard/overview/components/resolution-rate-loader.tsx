import ResolutionRate from "./resolution-rate";
import { getResolutionFunnelData } from "../data";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SupabaseClient } from "@supabase/supabase-js";

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
    return (
      <div className="border border-dashed border-border bg-card/60 p-8 flex flex-col items-center justify-center text-center min-h-[280px]">
        <div className="size-10 border border-border bg-background flex items-center justify-center mb-3">
          <Lock className="size-4 text-highlight" />
        </div>
        <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          Visitor → Lead Conversion Funnel
        </h3>
        <p className="font-sans text-xs text-muted-foreground max-w-sm mt-1 mb-4">
          Track acquisition drop-offs, engagement rate, and verified lead capture from your website widget. Available on Starter & Pro.
        </p>
        <Button
          variant="outline"
          size="sm"
          render={<Link href="/dashboard/billing" />}
          nativeButton={false}
          className="font-sans text-xs font-semibold"
        >
          <Sparkles className="size-3.5 text-highlight" />
          <span>Unlock with Starter</span>
        </Button>
      </div>
    );
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
    <div className="border border-border bg-card p-5 animate-pulse min-h-[320px] space-y-4">
      <div className="flex justify-between items-center border-b border-border/60 pb-3">
        <div className="space-y-1.5">
          <div className="h-4 w-40 bg-muted" />
          <div className="h-3 w-64 bg-muted/60" />
        </div>
        <div className="h-8 w-24 bg-muted/50" />
      </div>
      <div className="h-10 bg-muted/30" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="h-20 bg-muted/40" />
        <div className="h-20 bg-muted/40" />
        <div className="h-20 bg-muted/40" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-12 bg-muted/20" />
        <div className="h-12 bg-muted/20" />
      </div>
    </div>
  );
}
