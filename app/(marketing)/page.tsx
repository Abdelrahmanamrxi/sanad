import HeroSection from "@/features/marketing/components/HeroSection"
import Features from "@/features/marketing/components/Features"
import InteractiveDemo from "@/features/marketing/components/InteractiveDemo"
import Usecases from "@/features/marketing/components/Usecases"
import Pricing from "@/features/marketing/components/Pricing"
import FAQ from "@/features/marketing/components/FAQ"

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <Features />
      <InteractiveDemo />
      <Usecases />
      <Pricing />
      <FAQ />
    </div>
  )
}
