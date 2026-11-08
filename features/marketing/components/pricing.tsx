'use client'

import React, { useState } from 'react'
import { motion, type Variants } from 'motion/react'
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly')
  const [estimatedInquiries, setEstimatedInquiries] = useState<number>(2500)

  // Calculations for interactive ROI
  const hoursSavedPerMonth = Math.round((estimatedInquiries * 3.5) / 60)
  const proPrice = 990

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

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-10 sm:mb-14 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider border border-primary/20 shadow-2xs">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>Transparent Ledger &bull; Billed In Egyptian Pounds</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            Simple, predictable pricing in Egyptian Pounds.
          </h2>

          <p className="text-sm sm:text-base text-foreground/75 leading-relaxed">
            No unpredictable US-dollar API shocks or confusing per-token multipliers. Transparent tiers with native Egyptian dialect grounding.
          </p>

        
         
        </div>

        {/* Pricing Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
        >
          {/* Card 1: Starter / Solo Practices */}
          <motion.div variants={cardVariants} className="h-full">
            <Card className="h-full rounded-none bg-background dark:bg-[#132322] border border-border/80 hover:border-primary/50 shadow-xs transition-all flex flex-col justify-between p-6 sm:p-8 group">
              <div>
                <CardHeader className="p-0 gap-2 mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">
                    Starter Tier
                  </span>
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
                    Solo Practices
                  </CardTitle>
                  <CardDescription className="text-sm text-foreground/75 leading-relaxed font-normal">
                    Ideal for individual medical practitioners, boutique shops, or pop-up menus.
                  </CardDescription>
                </CardHeader>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pb-6 border-b border-border/60">
                  <span className="text-4xl sm:text-5xl font-extrabold text-foreground font-mono">
                    0
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground font-mono">
                    EGP / month
                  </span>
                </div>

                {/* Features List */}
                <CardContent className="p-0 pt-6">
                  <ul className="flex flex-col gap-3.5 text-sm text-foreground/85">
                    <li className="flex items-center gap-3">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>
                        <strong className="font-semibold text-foreground">1 Source Document</strong> (PDF / Word)
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>
                        <strong className="font-semibold text-foreground">150</strong> customer inquiries / mo
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Standard Egyptian Dialect RAG</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>1 Lightweight website script embed</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Unanswered Inquiry Email Alerts</span>
                    </li>
                  </ul>
                </CardContent>
              </div>

              {/* Card Footer CTA */}
              <CardFooter className="p-0 pt-8">
                <Link href="/signup" className="w-full">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full rounded-none font-semibold border border-border cursor-pointer hover:bg-secondary/80"
                  >
                    Start Free Forever
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Card 2: Pro Clinic & Commerce */}
          <motion.div variants={cardVariants} className="h-full relative">
            {/* Top Most Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
              <span className="px-3.5 py-1 bg-primary text-primary-foreground font-bold text-[11px] tracking-wider uppercase shadow-xs rounded-none font-mono">
                Most Popular For Clinics
              </span>
            </div>

            <Card className="h-full rounded-none bg-background dark:bg-[#132322] border-2 border-primary/50 shadow-md hover:border-primary transition-all flex flex-col justify-between p-6 sm:p-8 pt-9 group">
              <div>
                <CardHeader className="p-0 gap-2 mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono">
                    Pro Clinic &amp; Commerce
                  </span>
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
                    Growing Centers
                  </CardTitle>
                  <CardDescription className="text-sm text-foreground/75 leading-relaxed font-normal">
                    For multi-doctor clinics, specialty restaurants, and high-volume commerce.
                  </CardDescription>
                </CardHeader>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 pb-6 border-b border-border/60">
                  <span className="text-4xl sm:text-5xl font-extrabold text-primary font-mono">
                    {proPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground font-mono">
                    EGP / month {billingCycle === 'annual' && '(billed annually)'}
                  </span>
                </div>

                {/* Features List */}
                <CardContent className="p-0 pt-6">
                  <ul className="flex flex-col gap-3.5 text-sm text-foreground/85">
                    <li className="flex items-center gap-3">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>
                        <strong className="font-semibold text-foreground">50 Source Documents</strong> (PDF, Excel, Sheets)
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>
                        <strong className="font-semibold text-foreground">15,000</strong> customer inquiries / mo
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Live website URL crawler &amp; auto-sync</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Full Custom Brand Colors &amp; Avatar Styling</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Egyptian Dialect, Franco &amp; Typo Resilience</span>
                    </li>
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
                    Start 14-Day Free Pro Trial
                    <ArrowRight className="size-4 ms-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>

        {/* Interactive ROI & Time Saved Calculator */}
        <div className="mt-12 p-6 sm:p-7 bg-background dark:bg-[#132322] border border-border/80 shadow-xs flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
            <div className="flex items-center gap-2.5">
              <Calculator className="size-5 text-primary shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Interactive Receptionist Efficiency Calculator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Estimate hours freed up for front-desk receptionists each month
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span>Estimated Volume:</span>
              <span className="text-primary font-bold text-sm">
                {estimatedInquiries.toLocaleString()} inquiries/mo
              </span>
            </div>
          </div>

          {/* Slider Control */}
          <div className="flex flex-col gap-2">
            <input
              type="range"
              min="500"
              max="10000"
              step="500"
              value={estimatedInquiries}
              onChange={(e) => setEstimatedInquiries(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer h-2 bg-muted rounded-none"
            />
            <div className="flex justify-between text-[11px] font-mono text-muted-foreground">
              <span>500 inquiries</span>
              <span>5,000 inquiries</span>
              <span>10,000 inquiries</span>
            </div>
          </div>

          {/* Calculator Output Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-muted/40 border border-border/60 text-center">
              <span className="text-xl font-bold font-mono text-primary leading-tight">
                ~{hoursSavedPerMonth} Hours
              </span>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
                Staff Hours Saved / Mo
              </p>
            </div>

            <div className="p-3 bg-muted/40 border border-border/60 text-center">
              <span className="text-xl font-bold font-mono text-foreground leading-tight">
                &lt; 0.3s
              </span>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
                Instant Resolution Speed
              </p>
            </div>

            <div className="p-3 bg-muted/40 border border-border/60 text-center">
              <span className="text-xl font-bold font-mono text-success leading-tight">
                24 / 7
              </span>
              <p className="text-[11px] text-muted-foreground uppercase font-semibold mt-0.5">
                After-Hours Inquiries Covered
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}