import { Metadata } from "next";
import { LiveStudioOnboarding } from "@/features/onboarding/components/LiveStudioOnboarding";

export const metadata: Metadata = {
  title: "Workspace Setup & Studio ",
  description: "Configure your business identity, sector, location, and brand aesthetic.",
};

export default function OnBoardingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <LiveStudioOnboarding />
    </main>
  );
}
