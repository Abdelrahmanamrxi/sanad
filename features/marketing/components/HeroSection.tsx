'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate, type Variants } from 'motion/react'
import {
  Store,
  ArrowRight,
  Play,
  ShieldCheck,
  Zap,
  Sparkles,
  Check,
  Activity,
  FileCheck2,
  Languages,
  Code2,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)

  // Interactive mouse spotlight tracking
  const mouseX = useMotionValue(500)
  const mouseY = useMotionValue(300)
  const springX = useSpring(mouseX, { damping: 25, stiffness: 120 })
  const springY = useSpring(mouseY, { damping: 25, stiffness: 120 })

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  // Radial highlight mask following cursor
  const lightGlow = useMotionTemplate`radial-gradient(700px circle at ${springX}px ${springY}px, rgba(15, 92, 85, 0.08), transparent 80%)`
  const darkGlow = useMotionTemplate`radial-gradient(750px circle at ${springX}px ${springY}px, rgba(63, 179, 166, 0.12), transparent 80%)`

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative w-full overflow-hidden bg-background pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-border/40"
    >
      {/* Dynamic Interactive Mouse Glow Background */}
      <motion.div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 dark:hidden"
        style={{ background: lightGlow }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 hidden dark:block"
        style={{ background: darkGlow }}
      />

      {/* Architectural Blueprint Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top & Bottom Ambient Fade Masks */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-start gap-8 sm:gap-10"
        >
          {/* Top Status Badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider border border-primary/20 shadow-2xs">
              <span className="size-2 bg-success animate-pulse shrink-0" />
              <Store className="size-3.5 text-primary shrink-0" />
              <span>Built for clinics, restaurants &amp; shops in Egypt &amp; MENA</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] max-w-4xl"
          >
            Customer support{' '}
            <span className="relative inline-block text-primary">
              grounded in
              <span className="absolute bottom-1.5 start-0 w-full h-1 bg-primary/25 -z-10" />
            </span>{' '}
            verified business data, answering in{' '}
            <span className="text-foreground underline decoration-primary/40 underline-offset-8">
              Arabic &amp; English.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg lg:text-xl text-foreground/80 font-normal leading-relaxed max-w-3xl"
          >
            Upload your official price lists, treatment schedules, and branch menus. Sanad answers visitor questions on your website with 100% grounded facts &mdash; never hallucinating, handling Egyptian slang and Franco with native precision.
          </motion.p>

          {/* Call to Actions & Trust Guarantees */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-2"
          >
            <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <Link href="/signup" className="block w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 text-sm sm:text-base font-semibold group rounded-none shadow-xs border border-primary/40 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  Start Building Free
                  <ArrowRight className="size-4 ms-2 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <Link href="#demo" className="block w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto px-7 py-6 text-sm sm:text-base font-semibold group rounded-none border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
                >
                  <Play className="size-4 me-2 fill-current opacity-80" />
                  See Interactive Demo
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust Guarantees */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-foreground/80 pt-1"
          >
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 bg-primary shrink-0" />
              Zero setup code required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 bg-primary shrink-0" />
              2-minute script installation
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 bg-primary shrink-0" />
              100% grounded fact guarantee
            </span>
          </motion.div>

          {/* Operational Benchmarks & Architecture Strip */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full pt-8 sm:pt-10 border-t border-border/60"
          >
            {/* Metric 1 */}
            <div className="bg-card border border-border/80 p-5 shadow-2xs flex flex-col gap-2 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-bold text-primary font-mono">98.2%</span>
                <ShieldCheck className="size-5 text-primary/70 shrink-0" />
              </div>
              <span className="text-xs font-bold text-foreground">Operational Accuracy</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct quotation from your documents without hallucinating prices or policies.
              </p>
            </div>

            {/* Metric 2 */}
            <div className="bg-card border border-border/80 p-5 shadow-2xs flex flex-col gap-2 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-bold text-foreground font-mono">&lt; 280ms</span>
                <Zap className="size-5 text-highlight shrink-0" />
              </div>
              <span className="text-xs font-bold text-foreground">MENA Edge Latency</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Low-latency response nodes optimized for local Egyptian network traffic.
              </p>
            </div>

            {/* Metric 3 */}
            <div className="bg-card border border-border/80 p-5 shadow-2xs flex flex-col gap-2 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-bold text-foreground font-mono">100%</span>
                <Languages className="size-5 text-primary/70 shrink-0" />
              </div>
              <span className="text-xs font-bold text-foreground">Dialect &amp; Franco</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Understands Egyptian colloquialisms, phonetic typos, and Franco-Arabic.
              </p>
            </div>

            {/* Metric 4 */}
            <div className="bg-card border border-border/80 p-5 shadow-2xs flex flex-col gap-2 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-bold text-primary font-mono">2 Min</span>
                <Code2 className="size-5 text-primary/70 shrink-0" />
              </div>
              <span className="text-xs font-bold text-foreground">One-Line Script Embed</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Compatible with WordPress, Shopify, Wix, custom HTML &amp; modern web apps.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
