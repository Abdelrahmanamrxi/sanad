import HeroSection from "@/features/marketing/components/hero-section"
import Features from "@/features/marketing/components/features"
import InteractiveDemo from "@/features/marketing/components/interactive-demo"
import Usecases from "@/features/marketing/components/usecases"
import Pricing from "@/features/marketing/components/pricing"
import FAQ from "@/features/marketing/components/faq"

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
