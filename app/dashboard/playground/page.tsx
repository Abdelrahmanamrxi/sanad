import type { Metadata } from "next";
import { PlaygroundView } from "@/features/dashboard/playground/components";
import { checkUsageLimit, getActiveSubscription } from "@/features/billing/services/usage";
import { getAuthContext } from "@/lib/auth";
import AppError from "@/http/error";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Playground",
  description:
    "Interactive evaluation sandbox for hybrid retrieval, prompt engineering, and grounded response generation",
};

interface PlaygroundPageProps {
  searchParams: Promise<{ q?: string }>;
}


export default async function PlaygroundPage({
  searchParams,
}: PlaygroundPageProps) {
  const { q } = await searchParams;
  let authContext;
  try{
    authContext=await getAuthContext()
  }
  catch(err){
    if(err instanceof AppError){
      if(err.status===401){
        redirect("/signin")
      }
      if(err.status===404){
        redirect("/onboarding")
      }
    }
    throw err
  }
  const { businessId, planTier, supabase } = authContext;

  const [usage, { data: widgetData }] = await Promise.all([
    checkUsageLimit(businessId),
    supabase
      .from("widget_settings")
      .select("custom_instructions, temperature")
      .eq("business_id", businessId)
      .maybeSingle(),
  ]);

  const isLimitReached = !usage.allowed;
  const initialInstructions = widgetData?.custom_instructions || "";
  const initialTemperature =
    typeof widgetData?.temperature === "number" ? Number(widgetData.temperature) : 0.2;

  return (
    <PlaygroundView
      businessId={businessId}
      planTier={planTier}
      initialQuery={q}
      isLimitReached={isLimitReached}
      remainingMessages={Math.max(0, usage.messageLimit - usage.messagesUsed)}
      initialCustomInstructions={initialInstructions}
      initialTemperature={initialTemperature}
    />
  );
}
