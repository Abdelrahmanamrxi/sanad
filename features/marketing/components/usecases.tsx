'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'motion/react'
import {
  Languages,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Palette,
  MessageSquareQuote,
  Check,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

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

const dialectSamplesAr: DialectSample[] = [
  {
    id: 'slang',
    label: 'العامية المصرية',
    type: 'اللهجة الدارجة',
    input: 'هو أنتوا عندكم كشف اسنان النهاردة بالليل؟',
    dir: 'rtl',
    detectedIntent: 'حجز موعد طبيب اسنان',
    resolution: 'مطابقة جدول أطباء الاسنان المعتمد',
    groundedOutput: 'كشف اسنان متاح حتى 11:00 م بفرع الدقي مع طبيب اسنان.',
  },
  {
    id: 'franco',
    label: 'الفرانكو (Franco)',
    type: 'عربيزي',
    input: 'Momken a3raf feen el fer3 bta3 zayed bzabt?',
    dir: 'ltr',
    detectedIntent: 'الاستعلام عن موقع الفرع والعنوان التفصيلي',
    resolution: 'مطابقة عنوان فرع الشيخ زايد',
    groundedOutput: 'فرع زايد: كابيتال بيزنس بارك، مبنى B3، الدور الثاني.',
  },
  {
    id: 'typo',
    label: 'الأخطاء الإملائية',
    type: 'تصحيح تلقائي للصوتيات',
    input: 'اسعار تبفيثض الاسنان بكام لو سمحت',
    dir: 'rtl',
    detectedIntent: 'الاستعلام عن أسعار تبييض الأسنان بجهاز زووم',
    resolution: 'تصحيح فوري: تبفيثض -> تبيض الأسنان',
    groundedOutput: 'جلسة التبييض بجهاز الزووم: 2,800 ج.م شامل التنظيف وإزالة الجير.',
  },
]

const dialectSamplesEn: DialectSample[] = [
  {
    id: 'slang',
    label: 'Egyptian Slang',
    type: 'Ammiya',
    input: 'هو أنتوا عندكم كشف اسنان النهاردة بالليل؟',
    dir: 'ltr',
    detectedIntent: 'Dentist Appointment',
    resolution: 'Resolved to Clinic Dashboard',
    groundedOutput: 'Dentistry consultation is available until 11:00 PM at the Dokki branch.',
  },
  {
    id: 'franco',
    label: 'Franco-Arabic',
    type: 'Arabizi',
    input: 'Momken a3raf feen el fer3 bta3 zayed bzabt?',
    dir: 'ltr',
    detectedIntent: 'Branch Geolocation & Navigation Landmark',
    resolution: 'Normalized to Sheikh Zayed Branch',
    groundedOutput: 'Zayed Branch: Capital Business Park, Building B3, 2nd Floor.',
  },
  {
    id: 'typo',
    label: 'Wrong Typo',
    type: 'Spelling Resilience',
    input: 'what is the prce of teath whitning pls',
    dir: 'ltr',
    detectedIntent: 'Dental Bleaching / Whitening Price Matrix',
    resolution: 'Autocorrected "teath whitning" -> "Teeth Whitening"',
    groundedOutput: 'Zoom Whitening is 2,800 EGP including deep scaling and tartar removal.',
  },
]

export default function Usecases() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const dialectSamples = isArabic ? dialectSamplesAr : dialectSamplesEn

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
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="flex flex-col items-start text-start gap-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider border border-primary/20 shadow-2xs">
              <Languages className="size-3.5 text-primary" />
              <span>{t('usecases.badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
              {t('usecases.title')}
            </h2>
          </div>

          <p className="text-sm sm:text-base text-foreground/75 max-w-md text-start leading-relaxed">
            {t('usecases.subtitle')}
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
                    <span>
                      {isArabic ? 'محرك اللهجات • الفرانكو • تصحيح الأخطاء' : 'Dialect • Franco • Typo Resilience'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    {isArabic ? 'محاكي تفاعلي' : 'Interactive Tester'}
                  </span>
                </div>

                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground text-start">
                  {isArabic
                    ? 'فهم فوري للعامية والفرانكو والأخطاء الشائعة.'
                    : 'Egyptian Ammiya, Franco, and typos resolved automatically.'}
                </CardTitle>

                <CardDescription className="text-sm text-foreground/75 leading-relaxed font-normal text-start">
                  {isArabic
                    ? 'لا يكتب عملاؤك بالفصحى المنمقة عند السؤال عن الأسعار أو الحجز. انقر لاختبار استجابة سند:'
                    : 'Visitors do not speak textbook Arabic when inquiring about prices or appointments. Click below to test:'}
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
                    className="p-4 bg-muted/40 dark:bg-muted/20 border border-border/80 flex flex-col gap-3 font-mono text-xs text-start"
                  >
                    <div className="flex items-center justify-between text-muted-foreground pb-2 border-b border-border/60">
                      <span className="text-[11px] uppercase tracking-wider">
                        {isArabic ? `مدخلات العميل [${activeDialect.type}]` : `Customer Input [${activeDialect.type}]`}
                      </span>
                      <span className="text-primary text-[11px] font-semibold">
                        {isArabic ? 'تطابق القصد 100%' : '100% Intent Match'}
                      </span>
                    </div>

                    <p
                      className="text-sm font-semibold text-foreground text-start"
                      dir={activeDialect.dir}
                    >
                      &ldquo;{activeDialect.input}&rdquo;
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-border/60 text-[11px]">
                      <div className="flex flex-col gap-0.5 text-start">
                        <span className="text-muted-foreground">{t('usecases.resolvedAs')}</span>
                        <span className="text-primary font-bold">{activeDialect.resolution}</span>
                      </div>
                      <div className="flex flex-col gap-0.5 text-start">
                        <span className="text-muted-foreground">{t('usecases.sanadResponse')}</span>
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
                    <span>{t('usecases.comparisonBadge')}</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase">
                    {isArabic ? 'ضوابط الأمان' : 'Guardrail Demo'}
                  </span>
                </div>

                <CardTitle className="text-xl sm:text-2xl font-bold text-foreground text-start">
                  {isArabic ? 'صفر أسعار مؤلفة أو وعود كاذبة.' : 'Zero made-up claims or prices.'}
                </CardTitle>

                <CardDescription className="text-sm text-foreground/75 leading-relaxed font-normal text-start">
                  {isArabic
                    ? 'في العيادات والمطاعم، أي سعر خاطئ أو خطأ في الحساسية يسبب أزمة. جرّب الفرق بين سند والبوتات العامة:'
                    : 'In clinics, dining, and retail, a fabricated price or false allergen statement is disastrous. Toggle to see Sanad vs generic AI:'}
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
                    {t('usecases.modeSanad')}
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
                    {t('usecases.modeGeneric')}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {guardrailMode === 'sanad' ? (
                    <motion.div
                      key="sanad-mode"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="p-3.5 bg-secondary/30 dark:bg-secondary/15 border border-primary/30 flex flex-col gap-2 text-start"
                    >
                      <div className="flex items-center gap-2 text-primary font-bold text-xs font-mono uppercase">
                        <CheckCircle2 className="size-3.5 text-primary" />
                        <span>{t('usecases.sanadResultTitle')}</span>
                      </div>
                      <p className="text-xs text-foreground/90 font-mono leading-relaxed">
                        {isArabic
                          ? '«سؤال: هل يتوفر ليزر تحت تخدير كلي؟ -> غير موجود بالأوراق الرسمية -> يعتذر المساعد بلباقة ويحول للاستقبال»'
                          : 'Query: Do you offer laser hair removal under general anesthesia? -> Not in clinic records -> Respectfully defers to receptionist.'}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="generic-mode"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="p-3.5 bg-destructive/10 border border-destructive/30 flex flex-col gap-2 text-start"
                    >
                      <div className="flex items-center gap-2 text-destructive font-bold text-xs font-mono uppercase">
                        <AlertTriangle className="size-3.5 text-destructive" />
                        <span>{t('usecases.genericResultTitle')}</span>
                      </div>
                      <p className="text-xs text-foreground/90 font-mono leading-relaxed">
                        {isArabic
                          ? '«البوت التقليدي يؤلف: نعم بالتأكيد متاح بـ 1,200 جنيه تفضل غداً! -> يتسبب في غضب المريض ومسؤولية قانونية»'
                          : 'Generic AI hallucinates: Yes, we offer that for 1,200 EGP, please arrive tomorrow! -> Causes patient dispute and legal liability.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
