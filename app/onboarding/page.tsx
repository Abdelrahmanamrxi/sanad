import { Metadata } from "next";
import { LiveStudioOnboarding } from "@/features/onboarding/components/LiveStudioOnboarding";
import createClient from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Workspace Setup & Studio ",
  description:
    "Configure your business identity, sector, location, and brand aesthetic.",
};

export default async function OnBoardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data: business } = await supabase
    .from("business")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if(business){
      redirect("/dashboard")
    }
   

  return (
    <main className="min-h-screen bg-background text-foreground">
      <LiveStudioOnboarding />
    </main>
  );
}
