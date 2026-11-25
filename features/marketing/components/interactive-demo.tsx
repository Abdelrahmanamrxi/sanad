'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  FileCheck2,
  Building2,
  Utensils,
  ShoppingBag,
  RotateCw,
  Send,
  ShieldCheck,
  Check,
  Sparkles,
  Zap,
  Bot,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface QueryVariant {
  id: string
  chipLabel: string
  questionText: string
  questionTime: string
  badge: string
  latency: string
  greeting: string
  body: string
  closing: string
  exactFactMatched: string
}

interface Scenario {
  id: string
  title: string
  icon: React.ElementType
  branchName: string
  fileType: string
  fileName: string
  fileDetails: string
  factTitle: string
  extractedFacts: string[]
  guardrailText: string
  queries: QueryVariant[]
}

const scenariosAr: Scenario[] = [
  {
    id: 'clinic',
    title: 'عيادة أسنان',
    icon: Building2,
    branchName: 'فرع الدقي التخصصي لطب الأسنان',
    fileType: 'PDF',
    fileName: 'Dokki_Clinic_Prices_2025.pdf',
    fileDetails: '42 صفحة • تشمل الإجراءات والأسعار ومواعيد الأطباء',
    factTitle: 'الحقائق المستخرجة المؤكدة',
    extractedFacts: [
      'حشو عصب الضرس: يبدأ من 1,400 ج.م (شامل الأشعة الرقمية والتعقيم)',
      'د. أحمد فؤاد (استشاري علاج الجذور) متواجد اليوم حتى الساعة 10:00 مساءً',
      'التقسيط: 0% فوائد حتى 6 أشهر ببطاقات البنك الأهلي وبنك مصر',
    ],
    guardrailText: 'ضمان الأمان الذكي: يستخرج «سند» الإجابات من أوراقك فقط ولا يؤلف أبداً أي سعر أو إجراء غير مسجل.',
    queries: [
      {
        id: 'q1',
        chipLabel: 'سؤال ١: الأسعار والمواعيد',
        questionText: 'مساء الخير، لو سمحت هو حشو العصب عندكم بكام؟ ومين الدكتور الموجود انهاردة؟',
        questionTime: 'عميل • 7:14 م',
        badge: 'موثق من قائمة أسعار فرع الدقي',
        latency: '240ms',
        greeting: 'أهلاً بك يا فندم،',
        body: 'حشو العصب للضرس يبدأ من 1,400 جنيه مصري شامل الأشعة الرقمية والتعقيم. دكتور أحمد فؤاد (استشاري علاج الجذور) متواجد اليوم بفرع الدقي حتى الساعة 10:00 مساءً.',
        closing: 'هل تحب أحجز لحضرتك موعد مع دكتور أحمد اليوم؟',
        exactFactMatched: 'Dokki_Clinic_Prices_2025.pdf · صفحة 14 وجدول الأطباء',
      },
      {
        id: 'q2',
        chipLabel: 'سؤال ٢: الشروط والتقسيط',
        questionText: 'متاح تقسيط لحشو العصب والتركيبات بكروت البنك الأهلي؟',
        questionTime: 'عميل • 7:18 م',
        badge: 'موثق من اتفاقية خيارات الدفع والتقسيط',
        latency: '210ms',
        greeting: 'أهلاً بحضرتك،',
        body: 'نعم بالتأكيد! متاح تقسيط بدون فوائد حتى 6 أشهر باستخدام بطاقات ائتمان البنك الأهلي المصري وبنك مصر.',
        closing: 'الخدمة سارية على كافة الإجراءات التي تتجاوز 1,000 ج.م.',
        exactFactMatched: 'Dokki_Clinic_Prices_2025.pdf · البند 8.1 (شروط الدفع)',
      },
    ],
  },
  {
    id: 'retail',
    title: 'متجر تجزئة وأزياء',
    icon: ShoppingBag,
    branchName: 'المتجر الإلكتروني وفرع مصر الجديدة',
    fileType: 'DOCX',
    fileName: 'Heliopolis_Store_Policies.docx',
    fileDetails: 'سياسة الاستبدال والاسترجاع والشحن المعتمدة لعام 2025',
    factTitle: 'الحقائق المستخرجة المؤكدة',
    extractedFacts: [
      'الاستبدال والاسترجاع: متاح خلال 14 يوماً من الاستلام بالفاتورة الأصلية',
      'الشحن المجاني: متاح لجميع الطلبات التي تتجاوز 1,200 ج.م لكافة المحافظات',
      'المعاينة عند الاستلام: مسموح بفتح الشحنة والتأكد من المقاس قبل الدفع للمندوب',
    ],
    guardrailText: 'ضمان الأمان الذكي: يلتزم حرفياً بسياسات جهاز حماية المستهلك وسياسات استرجاع المتجر.',
    queries: [
      {
        id: 'q1',
        chipLabel: 'سؤال ١: المعاينة والاسترجاع',
        questionText: 'ينفع أقيس الأوردر مع المندوب قبل ما أدفع؟ وإيه نظام الاسترجاع؟',
        questionTime: 'عميل • 3:20 م',
        badge: 'موثق من وثيقة سياسات الشحن والاسترجاع',
        latency: '230ms',
        greeting: 'أهلاً بحضرتك،',
        body: 'نعم بالتأكيد! متاح معاينة وقياس الملابس مع المندوب قبل الاستلام. وإذا رغبت بالاسترجاع يمكنك ذلك خلال 14 يوماً من تاريخ الفاتورة مجاناً.',
        closing: 'هل تود الاستفسار عن مدة التوصيل لمحافظتك؟',
        exactFactMatched: 'Heliopolis_Store_Policies.docx · البند 4 (سياسة المعاينة)',
      },
      {
        id: 'q2',
        chipLabel: 'سؤال ٢: مصاريف الشحن والمحافظات',
        questionText: 'الشحن لإسكندرية بكام؟ وبياخد كام يوم؟',
        questionTime: 'عميل • 3:25 م',
        badge: 'موثق من جدول أسعار الشحن 2025',
        latency: '200ms',
        greeting: 'أهلاً بك،',
        body: 'الشحن لمحافظة الإسكندرية 45 ج.م ويستغرق من 48 إلى 72 ساعة عمل. وإذا تجاوزت قيمة مشترياتك 1,200 ج.م يكون الشحن مجاناً تماماً.',
        closing: 'هل ترغب في متابعة طلب حالي؟',
        exactFactMatched: 'Heliopolis_Store_Policies.docx · جدول المحافظات',
      },
    ],
  },
]

const scenariosEn: Scenario[] = [
  {
    id: 'clinic',
    title: 'Dental Clinic',
    icon: Building2,
    branchName: 'Dokki Dental Specialty Branch',
    fileType: 'PDF',
    fileName: 'Dokki_Clinic_Prices_2025.pdf',
    fileDetails: '42 pages • Includes procedures, prices & doctor schedules',
    factTitle: 'Verified Extracted Facts',
    extractedFacts: [
      'Molar root canal treatment starts at 1,400 EGP (includes digital X-ray & sterilization)',
      'Dr. Ahmed Fouad (Endodontics Consultant) on duty today until 10:00 PM',
      'Installment: 0% interest up to 6 months with NBE & Banque Misr credit cards',
    ],
    guardrailText: 'Smart Guardrail: Sanad only answers from your files and will never invent unlisted prices or procedures.',
    queries: [
      {
        id: 'q1',
        chipLabel: 'Question 1: Pricing & Schedule',
        questionText: 'Good evening, how much is a root canal? And which doctor is on duty today?',
        questionTime: 'Visitor • 7:14 PM',
        badge: 'Verified from Dokki Clinic Price Matrix',
        latency: '240ms',
        greeting: 'Hello!',
        body: 'Molar root canal treatment starts at 1,400 EGP including digital X-rays and sterilization. Dr. Ahmed Fouad (Endodontics Consultant) is on duty today at the Dokki branch until 10:00 PM.',
        closing: 'Would you like me to book an appointment with Dr. Ahmed today?',
        exactFactMatched: 'Dokki_Clinic_Prices_2025.pdf · Page 14 & Schedule.xlsx',
      },
      {
        id: 'q2',
        chipLabel: 'Question 2: 0% Installment Terms',
        questionText: 'Do you offer 0% installment plans for dental work with National Bank credit cards?',
        questionTime: 'Visitor • 7:18 PM',
        badge: 'Verified from Payment Options Agreement',
        latency: '210ms',
        greeting: 'Hello!',
        body: 'Yes, absolutely! 0% interest installment is available for up to 6 months using NBE and Banque Misr credit cards on procedures exceeding 1,000 EGP.',
        closing: 'Would you like details on other payment tenures?',
        exactFactMatched: 'Dokki_Clinic_Prices_2025.pdf · Clause 8.1 (Payment Terms)',
      },
    ],
  },
  {
    id: 'retail',
    title: 'Fashion & Retail',
    icon: ShoppingBag,
    branchName: 'E-commerce & Heliopolis Boutique',
    fileType: 'DOCX',
    fileName: 'Heliopolis_Store_Policies.docx',
    fileDetails: '2025 Store Warranty, Exchange & Shipping Standards',
    factTitle: 'Verified Extracted Facts',
    extractedFacts: [
      'Exchange & returns: 14 days from delivery with the original invoice',
      'Free shipping on all orders over 1,200 EGP nationwide across Egypt',
      'Inspection upon delivery: Try-on allowed before paying the courier',
    ],
    guardrailText: 'Smart Guardrail: Strictly adheres to consumer protection standards and store return terms.',
    queries: [
      {
        id: 'q1',
        chipLabel: 'Question 1: Try-on & Return Policy',
        questionText: 'Can I try on the clothes before paying the courier? What is your return policy?',
        questionTime: 'Visitor • 3:20 PM',
        badge: 'Verified from Shipping & Return Policy',
        latency: '230ms',
        greeting: 'Hello!',
        body: 'Yes, inspection and try-on with the courier before payment is fully allowed. If you wish to return items, free returns are valid within 14 days of delivery.',
        closing: 'Would you like to track an existing order?',
        exactFactMatched: 'Heliopolis_Store_Policies.docx · Clause 4 (Inspection Policy)',
      },
      {
        id: 'q2',
        chipLabel: 'Question 2: Shipping Rates & Times',
        questionText: 'How much is shipping to Alexandria, and how long does it take?',
        questionTime: 'Visitor • 3:25 PM',
        badge: 'Verified from 2025 Shipping Rates',
        latency: '200ms',
        greeting: 'Hello!',
        body: 'Shipping to Alexandria is 45 EGP and takes 48 to 72 business hours. If your order exceeds 1,200 EGP, shipping is completely free.',
        closing: 'Would you like help completing an order?',
        exactFactMatched: 'Heliopolis_Store_Policies.docx · Shipping Zones',
      },
    ],
  },
]

export default function InteractiveDemo() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const scenarios = isArabic ? scenariosAr : scenariosEn

  const [activeScenarioId, setActiveScenarioId] = useState<string>('clinic')
  const [activeQueryIndex, setActiveQueryIndex] = useState<number>(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0]
  const activeQuery = activeScenario.queries[activeQueryIndex] || activeScenario.queries[0]

  const handleScenarioChange = (id: string) => {
    setActiveScenarioId(id)
    setActiveQueryIndex(0)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 400)
  }

  return (
    <section
      id="demo"
      className="relative scroll-mt-24 w-full bg-background dark:bg-[#091413] py-16 sm:py-24 border-b border-border/60 overflow-hidden"
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.3] dark:opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient Radial Spotlight */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] bg-primary/5 rounded-none blur-3xl" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider border border-primary/20 shadow-2xs">
            <Sparkles className="size-3.5 text-primary" />
            <span>{t('demo.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            {t('demo.title')}
          </h2>

          <p className="text-sm sm:text-base text-foreground/75 max-w-2xl leading-relaxed">
            {t('demo.subtitle')}
          </p>

          {/* Scenario Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 p-1.5 bg-card border border-border/80 shadow-xs">
            {scenarios.map((scenario) => {
              const Icon = scenario.icon
              const isActive = activeScenarioId === scenario.id
              return (
                <button
                  key={scenario.id}
                  type="button"
                  onClick={() => handleScenarioChange(scenario.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer rounded-none ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{scenario.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Interactive Demo Window */}
        <div className="rounded-none bg-[#FAF7F0] dark:bg-[#0E1B1A] border border-border/90 dark:border-border/60 shadow-xl overflow-hidden">
          {/* Window Chrome / Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-border/60 bg-muted/40 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 bg-primary/40 shrink-0" />
                <span className="size-2.5 bg-primary/70 shrink-0" />
                <span className="size-2.5 bg-primary shrink-0" />
              </div>
              <span className="text-foreground/80 font-mono text-xs font-semibold">
                {t('demo.headerEngine')}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-success/10 text-success border border-success/30 text-xs font-semibold">
                <span className="size-1.5 bg-success shrink-0 animate-pulse" />
                {t('demo.headerGuardrail')}
              </span>
            </div>
          </div>

          {/* Dual Pane Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x lg:rtl:divide-x-reverse divide-border/60">
            {/* Left Pane: Uploaded Documents & Verified Facts (5 cols) */}
            <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col gap-5 bg-card/40 dark:bg-card/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                  <FileCheck2 className="size-4 text-primary shrink-0" />
                  <span>{t('demo.leftPaneTitle')}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {t('demo.leftPaneSynced')}
                </span>
              </div>

              {/* Uploaded File Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeScenario.fileName}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="p-3.5 bg-card border border-border/80 shadow-2xs flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-8 bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                      {activeScenario.fileType}
                    </div>
                    <div className="min-w-0 text-start">
                      <p className="text-xs font-mono font-bold text-foreground truncate" dir="ltr">
                        {activeScenario.fileName}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {activeScenario.fileDetails}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold shrink-0 border border-primary/20">
                    <Check className="size-3 text-primary" />
                    {t('demo.leftPaneIndexed')}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Extracted Exact Facts Box */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {t('demo.exactFactsTitle')}
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5">
                    {t('demo.exactFactsBadge')}
                  </span>
                </div>

                <div className="p-3 bg-card border border-primary/30 shadow-2xs flex flex-col gap-2">
                  <div className="space-y-2">
                    {activeScenario.extractedFacts.map((factText, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2 bg-muted/40 border border-border/40 text-xs text-foreground font-medium leading-relaxed text-start"
                      >
                        <span className="size-1.5 bg-primary shrink-0 mt-1.5" />
                        <span>{factText}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Citation Badge */}
              <div className="p-3 bg-card/60 border border-border/50 text-xs font-mono flex flex-col gap-1 text-start">
                <span className="text-[10px] uppercase text-muted-foreground">
                  {t('demo.citationTitle')}
                </span>
                <span className="text-primary font-semibold truncate" dir={isArabic ? 'rtl' : 'ltr'}>
                  {activeQuery.exactFactMatched}
                </span>
              </div>

              {/* Smart Guardrail Banner */}
              <div className="flex items-start gap-2.5 p-3 bg-secondary text-secondary-foreground border border-primary/25 text-xs font-medium text-start">
                <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
                <p className="leading-relaxed">{activeScenario.guardrailText}</p>
              </div>
            </div>

            {/* Right Pane: Live Inquiries & Real-time Responses (7 cols) */}
            <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-6 bg-card/70 dark:bg-card/40">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="size-8 bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                    <Bot className="size-4" />
                  </div>
                  <div className="text-start">
                    <h4 className="text-sm font-bold text-foreground">
                      {activeScenario.title} {t('demo.rightPaneAssistant')}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <span className="size-1.5 bg-success shrink-0" />
                      <span>{t('demo.rightPaneSubtitle')}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRefresh}
                  title="Refresh conversation state"
                  className="p-1.5 text-foreground/70 hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
                >
                  <RotateCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Interactive Inbound Question Selector Chips */}
              <div className="flex flex-col gap-2 text-start">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>{t('demo.testInquiryLabel')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeScenario.queries.map((q, idx) => {
                    const isSelected = activeQueryIndex === idx
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setActiveQueryIndex(idx)}
                        className={`text-xs px-3 py-1.5 text-start font-medium transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-2xs font-semibold'
                            : 'bg-card border-border/80 text-foreground/80 hover:border-primary/40 hover:text-foreground'
                        }`}
                      >
                        {q.chipLabel}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Conversation Messages */}
              <div className="flex flex-col gap-4 my-auto">
                {/* 1. Customer Inbound Bubble */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`query-${activeScenario.id}-${activeQuery.id}`}
                    initial={{ opacity: 0, x: isArabic ? 8 : -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isArabic ? 8 : -8 }}
                    transition={{ duration: 0.25 }}
                    className="self-start max-w-[90%]"
                  >
                    <div className="p-3.5 bg-muted/90 text-foreground text-sm font-medium leading-relaxed border border-border/60 text-start">
                      <p>{activeQuery.questionText}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-1 block px-1 text-start font-mono">
                      {activeQuery.questionTime}
                    </span>
                  </motion.div>
                </AnimatePresence>

                {/* 2. Sanad AI Grounded Response Bubble */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`ai-${activeScenario.id}-${activeQuery.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="self-end max-w-[96%]"
                  >
                    <div className="p-4 bg-secondary/80 dark:bg-secondary/25 text-secondary-foreground border border-primary/30 shadow-sm flex flex-col gap-2.5 text-start relative">
                      <div className="absolute top-0 start-0 w-1 h-full bg-primary" />

                      {/* Verified Badge Header */}
                      <div className="flex items-center justify-between text-xs font-semibold border-b border-primary/15 pb-2 text-primary">
                        <div className="flex items-center gap-1.5">
                          <Zap className="size-3.5 fill-current" />
                          <span className="truncate">{activeQuery.badge}</span>
                        </div>
                      
                      </div>

                      {/* Grounded AI Text */}
                      <div className="text-sm font-normal leading-relaxed text-foreground space-y-1.5">
                        <p className="font-semibold text-primary">{activeQuery.greeting}</p>
                        <p>{activeQuery.body}</p>
                        <p>{activeQuery.closing}</p>
                      </div>

                      {/* Live Citation Reference */}
                      <div
                        className="mt-1 pt-2 border-t border-primary/15 text-[10px] font-mono text-muted-foreground"
                        dir={isArabic ? 'rtl' : 'ltr'}
                      >
                        {isArabic ? 'المصدر المرجعي: ' : 'Source: '}
                        {activeQuery.exactFactMatched}
                      </div>
                    </div>

                    <span className="text-[11px] text-muted-foreground mt-1 block px-1 text-end font-mono">
                      Sanad AI 
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Simulated WhatsApp Input Footer */}
              <div className="pt-3 border-t border-border/60 flex items-center gap-2">
                <div className="flex-1 bg-muted/60 border border-border/70 px-4 py-2.5 text-xs text-muted-foreground font-mono text-start">
                  {t('demo.inputPlaceholder')}
                </div>
                <div className="size-9 bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0">
                  <Send className="size-4 rtl:rotate-180" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
