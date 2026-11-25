'use client'

import React, { useState } from 'react'
import { motion, type Variants } from 'motion/react'
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Sparkles,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function Pricing() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const [estimatedInquiries, setEstimatedInquiries] = useState<number>(2500)

  // Calculations for interactive ROI
  const hoursSavedPerMonth = Math.round((estimatedInquiries * 3.5) / 60)

  return (
    <section
      id="pricing"
      className="relative scroll-mt-24 w-full bg-card/60 dark:bg-[#0c1817] border-y border-border/80 py-16 sm:py-24 overflow-hidden"
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25] dark:opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient Gradient Highlights */}
      <div className="pointer-events-none absolute -top-40 end-1/3 size-96 bg-primary/5 rounded-none blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 start-1/3 size-96 bg-highlight/5 rounded-none blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-10 sm:mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider border border-primary/20 shadow-2xs">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>{t('pricing.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            {t('pricing.title')}
          </h2>

          <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Real Plans 3-Card Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
        >
          {/* Card 1: Free Tier */}
          <motion.div variants={cardVariants} className="h-full">
            <Card className="h-full rounded-none bg-background dark:bg-[#132322] border border-border/80 hover:border-primary/50 shadow-xs transition-all flex flex-col justify-between p-6 group">
              <div>
                <CardHeader className="p-0 gap-2 mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono text-start">
                    {t('pricing.freeTier.tag')}
                  </span>
                  <CardTitle className="text-2xl font-bold text-foreground text-start">
                    {t('pricing.freeTier.name')}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-foreground/75 leading-relaxed font-normal text-start">
                    {t('pricing.freeTier.desc')}
                  </CardDescription>
                </CardHeader>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pb-6 border-b border-border/60">
                  <span className="text-4xl sm:text-5xl font-extrabold text-foreground font-mono">
                    {t('pricing.freeTier.price')}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground font-mono">
                    {t('pricing.perMonth')}
                  </span>
                </div>

                {/* Features List */}
                <CardContent className="p-0 pt-6">
                  <ul className="flex flex-col gap-3 text-xs sm:text-sm text-foreground/85">
                    {((t('pricing.freeTier.features', { returnObjects: true }) as string[]) || []).map(
                      (feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-start">
                          <Check className="size-4 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </div>

              {/* Card Footer CTA */}
              <CardFooter className="p-0 pt-8">
                <Link href="/signup" className="w-full">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full rounded-none font-semibold group cursor-pointer border-border hover:bg-muted/60"
                  >
                    {t('pricing.freeTier.cta')}
                    <ArrowRight className="size-4 ms-2 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Card 2: Starter (490 EGP) */}
          <motion.div variants={cardVariants} className="h-full">
            <Card className="h-full rounded-none bg-background dark:bg-[#132322] border border-border/80 hover:border-primary/50 shadow-xs transition-all flex flex-col justify-between p-6 group">
              <div>
                <CardHeader className="p-0 gap-2 mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono text-start">
                    {t('pricing.starterTier.tag')}
                  </span>
                  <CardTitle className="text-2xl font-bold text-foreground text-start">
                    {t('pricing.starterTier.name')}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-foreground/75 leading-relaxed font-normal text-start">
                    {t('pricing.starterTier.desc')}
                  </CardDescription>
                </CardHeader>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pb-6 border-b border-border/60">
                  <span className="text-4xl sm:text-5xl font-extrabold text-foreground font-mono">
                    {t('pricing.starterTier.price')}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground font-mono">
                    {t('pricing.perMonth')}
                  </span>
                </div>

                {/* Features List */}
                <CardContent className="p-0 pt-6">
                  <ul className="flex flex-col gap-3 text-xs sm:text-sm text-foreground/85">
                    {((t('pricing.starterTier.features', { returnObjects: true }) as string[]) || []).map(
                      (feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-start">
                          <Check className="size-4 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </div>

              {/* Card Footer CTA */}
              <CardFooter className="p-0 pt-8">
                <Link href="/signup" className="w-full">
                  <Button
                    size="lg"
                    className="w-full rounded-none font-semibold group cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {t('pricing.starterTier.cta')}
                    <ArrowRight className="size-4 ms-2 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Card 3: Growth / Pro Tier (990 EGP - Featured) */}
          <motion.div variants={cardVariants} className="h-full">
            <Card className="h-full rounded-none bg-background dark:bg-[#132322] border-2 border-highlight shadow-md relative flex flex-col justify-between p-6 group">
              {/* Popular Badge */}
              <div className="absolute -top-3.5 end-6 bg-highlight text-highlight-foreground text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 shadow-2xs font-mono">
                {t('pricing.growthTier.popular')}
              </div>

              <div>
                <CardHeader className="p-0 gap-2 mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-highlight font-mono text-start">
                    {t('pricing.growthTier.tag')}
                  </span>
                  <CardTitle className="text-2xl font-bold text-foreground text-start">
                    {t('pricing.growthTier.name')}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-foreground/75 leading-relaxed font-normal text-start">
                    {t('pricing.growthTier.desc')}
                  </CardDescription>
                </CardHeader>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pb-6 border-b border-border/60">
                  <span className="text-4xl sm:text-5xl font-extrabold text-highlight font-mono">
                    {t('pricing.growthTier.price')}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground font-mono">
                    {t('pricing.perMonth')}
                  </span>
                </div>

                {/* Features List */}
                <CardContent className="p-0 pt-6">
                  <ul className="flex flex-col gap-3 text-xs sm:text-sm text-foreground/85">
                    {((t('pricing.growthTier.features', { returnObjects: true }) as string[]) || []).map(
                      (feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-start">
                          <Check className="size-4 text-highlight shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
              </div>

              {/* Card Footer CTA */}
              <CardFooter className="p-0 pt-8">
                <Link href="/signup" className="w-full">
                  <Button
                    size="lg"
                    className="w-full rounded-none font-semibold group cursor-pointer bg-highlight text-highlight-foreground hover:bg-highlight/90"
                  >
                    {t('pricing.growthTier.cta')}
                    <ArrowRight className="size-4 ms-2 transition-transform duration-200 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>

        {/* Interactive ROI & Time Saved Calculator */}
       
      </div>
    </section>
  )
}
