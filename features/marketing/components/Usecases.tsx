'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'motion/react'
import {
  MessageSquareQuote,
  ShieldCheck,
  Palette,
  Lock,
  Check,
  Ban,
  Globe,
  ShieldAlert,
  Languages,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Terminal,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

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
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

interface DialectSample {
  id: string
  label: string
  type: string
  input: string
  dir: 'rtl' | 'ltr'
  detectedIntent: string
  resolution: string
  groundedOutput: string
}

const dialectSamples: DialectSample[] = [
  {
    id: 'slang',
    label: 'Egyptian Slang',
    type: 'Ammiya',
    input: 'هو أنتوا عندكم كشف مستعجل النهاردة بالليل؟',
    dir: 'rtl',
    detectedIntent: 'Emergency Appointment & Night Schedule',
    resolution: 'Resolved to Urgent Clinic Roster',
    groundedOutput: 'كشف الطوارئ متاح حتى 11:00 م بفرع الدقي مع طبيب النوباتجية.',
  },
  {
    id: 'franco',
    label: 'Franco-Arabic',
    type: 'Arabizi',
    input: 'Momken a3raf feen el fer3 bta3 zayed bzabt?',
    dir: 'ltr',
    detectedIntent: 'Branch Geolocation & Navigation Landmark',
    resolution: 'Normalized to Sheikh Zayed Branch',
    groundedOutput: 'فرع زايد: كابيتال بيزنس بارك، مبنى B3، الدور الثاني.',
  },
  {
    id: 'typo',
    label: 'Phonetic Typo',
    type: 'Spelling Resilience',
    input: 'اسعار تبيض الاسنان بكام لو سمحت',
    dir: 'rtl',
    detectedIntent: 'Dental Bleaching / Whitening Price Matrix',
    resolution: 'Autocorrected "تبيض" -> "تبييض الأسنان"',
    groundedOutput: 'جلسة التبييض بجهاز الزووم: 2,800 ج.م شامل التنظيف وإزالة الجير.',
  },
  {
    id: 'currency',
    label: 'Currency Jargon',
    type: 'Local Idioms',
    input: 'الكشف عامل كام باكو ولا بالمصري العادي؟',
    dir: 'rtl',
    detectedIntent: 'Price Query with Local Currency Slang',
    resolution: 'Normalized "باكو" -> 1,000 EGP units',
    groundedOutput: 'سعر الكشف الاستشاري 450 ج.م فقط (شامل كشف السكر والضغط).',
  },
]

export default function Usecases() {
  const [activeDialect, setActiveDialect] = useState<DialectSample>(dialectSamples[0])
  const [guardrailMode, setGuardrailMode] = useState<'sanad' | 'generic'>('sanad')
  const [brandColor, setBrandColor] = useState<'teal' | 'amber' | 'slate'>('teal')

  return (
    <section
      id="use-cases"
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
      <div className="pointer-events-none absolute top-10 end-10 size-80 bg-primary/5 rounded-none blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 start-10 size-80 bg-highlight/5 rounded-none blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header: Two Column Top Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="flex flex-col items-start text-left gap-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider border border-primary/20 shadow-2xs">
              <Languages className="size-3.5 text-primary" />
              <span>Regional Linguistic Mastery &bull; MENA Native</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
              Engineered for Egyptian Arabic, Franco-Arabic, and regional dialects.
            </h2>
          </div>

          <p className="text-sm sm:text-base text-foreground/75 max-w-md lg:text-left leading-relaxed">
            Standard natural language processing pipelines often fail on local idioms, regional currency terms, and transliterated Arabic. Sanad uses fine-tuned regional embeddings.
          </p>
        </div>

        {/* Bento Grid of Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Card 1: Interactive Dialect, Franco & Typo Playground (7 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-7 h-full">
            <Card className="h-full rounded-none bg-background dark:bg-[#132322] border border-border/80 hover:border-primary/50 shadow-xs transition-all flex flex-col justify-between p-6 sm:p-7 group">
              <CardHeader className="p-0 gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                    <MessageSquareQuote className="size-4" />
                    <span>Dialect &bull; Franco &bull; Typo Resilience</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    Interactive Tester
                  </span>
                </div>

                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  Egyptian Ammiya, Franco, and typos resolved automatically.
                </CardTitle>

                <CardDescription className="text-sm text-foreground/75 leading-relaxed font-normal">
                  Visitors don&apos;t use standard textbook Arabic when booking appointments. Click below to test how Sanad interprets local expressions accurately:
                </CardDescription>
              </CardHeader>

              {/* Interactive Tester Area */}
              <CardContent className="p-0 pt-5 flex flex-col gap-4">
                {/* Dialect Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dialectSamples.map((sample) => {
                    const isSelected = activeDialect.id === sample.id
                    return (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => setActiveDialect(sample)}
                        className={`p-2 text-center text-xs font-semibold transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-2xs'
                            : 'bg-muted/50 border-border/70 text-foreground/80 hover:bg-card hover:text-foreground'
                        }`}
                      >
                        {sample.label}
                      </button>
                    )
                  })}
                </div>

                {/* Live Resolution Panel */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDialect.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 bg-muted/40 dark:bg-muted/20 border border-border/80 flex flex-col gap-3 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between text-muted-foreground pb-2 border-b border-border/60">
                      <span className="text-[11px] uppercase tracking-wider">
                        Customer Input [{activeDialect.type}]
                      </span>
                      <span className="text-primary text-[11px] font-semibold">100% Intent Match</span>
                    </div>

                    <p
                      className={`text-sm font-semibold text-foreground ${
                        activeDialect.dir === 'rtl' ? 'text-right' : 'text-left'
                      }`}
                      dir={activeDialect.dir}
                    >
                      &ldquo;{activeDialect.input}&rdquo;
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/60 text-[11px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-muted-foreground">Intent Resolution:</span>
                        <span className="text-primary font-bold">{activeDialect.resolution}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-muted-foreground">Grounded Response:</span>
                        <span className="text-foreground font-medium truncate">{activeDialect.groundedOutput}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2: Interactive Hallucination Shield (5 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-5 h-full">
            <Card className="h-full rounded-none bg-background dark:bg-[#132322] border border-border/80 hover:border-primary/50 shadow-xs transition-all flex flex-col justify-between p-6 sm:p-7 group">
              <CardHeader className="p-0 gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                    <ShieldCheck className="size-4" />
                    <span>Strict Grounding Shield</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    Guardrail Demo
                  </span>
                </div>

                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  Zero made-up claims or prices.
                </CardTitle>

                <CardDescription className="text-sm text-foreground/75 leading-relaxed font-normal">
                  In healthcare, dining, and retail, a fabricated price or false allergen statement is disastrous. Toggle to see Sanad vs generic AI:
                </CardDescription>
              </CardHeader>

              {/* Interactive Guardrail Toggle */}
              <CardContent className="p-0 pt-5 flex flex-col gap-3">
                <div className="flex items-center p-1 bg-muted/60 border border-border/70 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setGuardrailMode('sanad')}
                    className={`flex-1 py-1.5 px-2 text-center transition-colors cursor-pointer ${
                      guardrailMode === 'sanad'
                        ? 'bg-card text-primary font-bold border border-border shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sanad 
                  </button>
                  <button
                    type="button"
                    onClick={() => setGuardrailMode('generic')}
                    className={`flex-1 py-1.5 px-2 text-center transition-colors cursor-pointer ${
                      guardrailMode === 'generic'
                        ? 'bg-card text-destructive font-bold border border-border shadow-2xs'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                     LLM
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {guardrailMode === 'sanad' ? (
                    <motion.div
                      key="sanad-mode"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="p-3.5 bg-secondary/30 dark:bg-secondary/15 border border-primary/30 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2 text-primary font-bold text-xs font-mono uppercase">
                        <CheckCircle2 className="size-3.5 text-primary" />
                        <span>Safety Boundary: Zero Speculation</span>
                      </div>
                      <p className="text-xs text-foreground/90 font-mono leading-relaxed">
                        &ldquo;Query: Do you offer laser hair removal under general anesthesia? &rarr; Not in uploaded clinic manual &rarr; Respectfully declines.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="generic-mode"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="p-3.5 bg-destructive/10 border border-destructive/30 flex flex-col gap-2"
                    >
                      <div className="flex items-center gap-2 text-destructive font-bold text-xs font-mono uppercase">
                        <AlertTriangle className="size-3.5 text-destructive" />
                        <span>High Risk: Invented Facts</span>
                      </div>
                      <p className="text-xs text-foreground/90 font-mono leading-relaxed">
                        &ldquo;Generic AI hallucinates: Yes, we offer that for 1,200 EGP, please arrive tomorrow! &rarr; Causes patient anger and legal liability.&rdquo;
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3: Interactive Storefront Customization (5 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-5 h-full">
            <Card className="h-full rounded-none bg-background dark:bg-[#132322] border border-border/80 hover:border-primary/50 shadow-xs transition-all flex flex-col justify-between p-6 sm:p-7 group">
              <CardHeader className="p-0 gap-3">
                <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                  <Palette className="size-4" />
                  <span>Merchant Branding</span>
                </div>

                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                  Looks native to your brand.
                </CardTitle>

                <CardDescription className="text-sm text-foreground/75 leading-relaxed font-normal">
                  Full control over widget position, launcher icon, custom welcome message, and brand color palette swatches:
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 pt-5 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>Test Widget Accent:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBrandColor('teal')}
                      className={`size-5 bg-[#0F5C55] cursor-pointer border ${
                        brandColor === 'teal' ? 'ring-2 ring-foreground' : 'border-border'
                      }`}
                      title="Teal Theme"
                    />
                    <button
                      type="button"
                      onClick={() => setBrandColor('amber')}
                      className={`size-5 bg-[#E8A33D] cursor-pointer border ${
                        brandColor === 'amber' ? 'ring-2 ring-foreground' : 'border-border'
                      }`}
                      title="Amber Theme"
                    />
                    <button
                      type="button"
                      onClick={() => setBrandColor('slate')}
                      className={`size-5 bg-[#4A5957] cursor-pointer border ${
                        brandColor === 'slate' ? 'ring-2 ring-foreground' : 'border-border'
                      }`}
                      title="Slate Theme"
                    />
                  </div>
                </div>

                <div className="p-3 bg-muted/40 border border-border/70 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`size-3 shrink-0 ${
                        brandColor === 'teal'
                          ? 'bg-[#0F5C55]'
                          : brandColor === 'amber'
                          ? 'bg-[#E8A33D]'
                          : 'bg-[#4A5957]'
                      }`}
                    />
                    <span className="font-semibold text-foreground">Live Widget Skin</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">dir=&quot;rtl&quot; &bull; Sharp Edges</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 4: Data Governance & Quota Protection (7 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-7 h-full">
            <Card className="h-full rounded-none bg-background dark:bg-[#132322] border border-border/80 hover:border-primary/50 shadow-xs transition-all flex flex-col justify-between p-6 sm:p-7 group">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left Details */}
                <div className="md:col-span-7 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-wider">
                    <Lock className="size-4" />
                    <span>Data Governance &amp; Origin Security</span>
                  </div>

                  <CardTitle className="text-xl sm:text-2xl font-bold text-foreground">
                    Whitelisted origins &amp; localized data residency.
                  </CardTitle>

                  <CardDescription className="text-sm text-foreground/75 leading-relaxed font-normal">
                    Your chatbot script is locked via CORS to your exact verified domain. Competitors cannot scrape your knowledge base or abuse your quota.
                  </CardDescription>
                </div>

                {/* Right Spec Table */}
                <div className="md:col-span-5 p-3.5 bg-muted/50 dark:bg-muted/30 border border-border/70 flex flex-col gap-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">Domain Lock:</span>
                    <span className="text-foreground font-bold">your-clinic.com</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">Origin Security:</span>
                    <span className="text-success font-bold">Strict HTTPS &bull; CORS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Storage Protocol:</span>
                    <span className="text-primary font-bold">Private Isolated Shard</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}