'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  FileText,
  ShieldCheck,
  Zap,
  RotateCw,
  Send,
  Sparkles,
  Bot,
  Building2,
  Utensils,
  ShoppingBag,
  Database,
  Check,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  FileCheck2,
} from 'lucide-react'

interface QueryVariant {
  id: string
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
  icon: typeof Building2
  branchName: string
  fileType: string
  fileName: string
  fileDetails: string
  factTitle: string
  extractedFacts: string[]
  scheduleName: string
  guardrailText: string
  queries: QueryVariant[]
}

const scenarios: Scenario[] = [
  {
    id: 'clinic',
    title: 'Dental Clinic',
    icon: Building2,
    branchName: 'Dokki Dental Specialty Branch',
    fileType: 'PDF',
    fileName: 'Dokki_Clinic_Prices_2025_v3.pdf',
    fileDetails: '42 pages • Includes procedures, prices & doctor schedules',
    factTitle: 'Verified Extracted Facts',
    extractedFacts: [
      'Molar root canal treatment: 1,400 EGP (includes digital X-ray & sterilization)',
      'Dr. Ahmed Fouad (Endodontics Consultant) on duty today until 10:00 PM',
      'Installment: 0% interest up to 6 months with NBE & Banque Misr credit cards',
    ],
    scheduleName: 'Ramadan_Doctor_Schedule_2025.xlsx',
    guardrailText: 'Smart Guardrail: Sanad only answers from your files and will never invent unlisted prices or procedures.',
    queries: [
      {
        id: 'q1',
        questionText: 'مساء الخير، لو سمحت هو حشو العصب عندكم بكام؟ ومين الدكتور الموجود انهاردة؟',
        questionTime: 'Visitor • 7:14 PM',
        badge: 'Verified from Dokki Clinic Price Matrix',
        latency: '240ms',
        greeting: 'أهلاً بك يا فندم،',
        body: 'حشو العصب للضرس يبدأ من 1,400 جنيه مصري شامل الأشعة الرقمية والتعقيم. دكتور أحمد فؤاد (استشاري علاج الجذور) متواجد اليوم بفرع الدقي حتى الساعة 10:00 مساءً.',
        closing: 'هل تحب أحجز لحضرتك موعد مع دكتور أحمد اليوم؟',
        exactFactMatched: 'Dokki_Clinic_Prices_2025_v3.pdf · Page 14 & Schedule.xlsx',
      },
      {
        id: 'q2',
        questionText: 'متاح تقسيط لحشو العصب والتركيبات بكروت البنك الأهلي؟',
        questionTime: 'Visitor • 7:18 PM',
        badge: 'Verified from Payment Options Agreement',
        latency: '210ms',
        greeting: 'أهلاً بحضرتك،',
        body: 'نعم بالتأكيد! متاح تقسيط بدون فوائد حتى 6 أشهر باستخدام بطاقات ائتمان البنك الأهلي المصري وبنك مصر.',
        closing: 'الخدمة سارية على كافة الإجراءات التي تتجاوز 1,000 ج.م.',
        exactFactMatched: 'Dokki_Clinic_Prices_2025_v3.pdf · Clause 8.1 (Payment Terms)',
      },
    ],
  },
  {
    id: 'restaurant',
    title: 'Artisan Burger',
    icon: Utensils,
    branchName: 'Zamalek & Sheikh Zayed Branches',
    fileType: 'XLSX',
    fileName: 'Zamalek_Menu_Combos_v4.xlsx',
    fileDetails: 'Sheet: Active Menu • Includes allergens, combos & delivery zones',
    factTitle: 'Verified Extracted Facts',
    extractedFacts: [
      'Triple Bacon Mushroom: 210 EGP (Gluten-free bun available at 0 EGP extra)',
      'Delivery to Sheikh Zayed: Available until 2:00 AM (Flat fee 35 EGP)',
      'Sanad Feast Combo: 4 Single Burgers + 2 Large Fries + 1L Pepsi: 580 EGP',
    ],
    scheduleName: 'Branch_Operating_Hours_2025.csv',
    guardrailText: 'Smart Guardrail: Accurately checks dietary allergens and active branch delivery cut-off times.',
    queries: [
      {
        id: 'q1',
        questionText: 'لو سمحت سندوتش تريبل بيكون ماشروم بكام؟ ومتاح عيش خالي من الجلوتين وتوصيل لزايد؟',
        questionTime: 'Visitor • 8:30 PM',
        badge: 'Verified from active menu & delivery sheet',
        latency: '190ms',
        greeting: 'أهلاً بك يا فندم،',
        body: 'سعر تريبل بيكون ماشروم هو 210 جنيه مصري، ومتاح بالتأكيد خبز خالي من الجلوتين (Gluten-Free) بدون أي تكلفة إضافية.',
        closing: 'خدمة التوصيل لفرع الشيخ زايد متاحة حتى الساعة 2:00 صباحاً. تحب نعمل لحضرتك الأوردر؟',
        exactFactMatched: 'Zamalek_Menu_Combos_v4.xlsx · Row 18 & Delivery Matrix',
      },
      {
        id: 'q2',
        questionText: 'عندكم كومبو عائلي يكفي 4 أفراد وسعره كام؟',
        questionTime: 'Visitor • 8:34 PM',
        badge: 'Verified from Zamalek Combo Sheet',
        latency: '180ms',
        greeting: 'مساء النور!',
        body: 'عندنا "Sanad Feast Combo" يكفي 4 أفراد، يشمل (4 برجر سنجل + 2 بطاطس كبير + لتر بيبسي) بسعر 580 ج.م شامل الضريبة.',
        closing: 'متاح الطلب للتوصيل الفوري أو الاستلام من أقرب فرع.',
        exactFactMatched: 'Zamalek_Menu_Combos_v4.xlsx · Sheet: Combos · Row 12',
      },
    ],
  },
  {
    id: 'retail',
    title: 'Retail & Fashion',
    icon: ShoppingBag,
    branchName: 'Cairo Festival City & Mall of Egypt',
    fileType: 'PDF',
    fileName: 'Return_Policy_&_Branch_Stock_2025.pdf',
    fileDetails: '26 pages • Store exchange policy & live branch inventory',
    factTitle: 'Verified Extracted Facts',
    extractedFacts: [
      'Black Leather Jacket (Size L): In stock at CFC and Mall of Egypt',
      'Exchange & Refund: 14 days with original receipt in new condition',
      'Free shipping on exchanges across Greater Cairo',
    ],
    scheduleName: 'Live_Store_Inventory_Feed.xlsx',
    guardrailText: 'Smart Guardrail: Sanad applies your 14-day refund policy strictly without deviation.',
    queries: [
      {
        id: 'q1',
        questionText: 'عايز أعرف الجاكيت الجلد الأسود موجود منه مقاس L في فرع كايرو فيستيفال؟ وإيه نظام الاسترجاع؟',
        questionTime: 'Visitor • 4:15 PM',
        badge: 'Verified from branch inventory & policy',
        latency: '220ms',
        greeting: 'مرحباً بحضرتك،',
        body: 'نعم، مقاس L من السترة الجلدية السوداء متوفر حالياً في فرع كايرو فيستيفال سيتي (CFC). سياسة الاستبدال والاسترجاع تتيح لك 14 يوماً مع الفاتورة الأصلية بحالتها الجديدة.',
        closing: 'هل تحب نحجز القطعة لحضرتك في الفرع لتجربتها؟',
        exactFactMatched: 'Return_Policy_&_Branch_Stock_2025.pdf · Section 3.1 & Stock DB',
      },
      {
        id: 'q2',
        questionText: 'لو اشتريت أونلاين والمقاس طلع كبير الاستبدال بياخد شحن كام؟',
        questionTime: 'Visitor • 4:19 PM',
        badge: 'Verified from Shipping Policy',
        latency: '205ms',
        greeting: 'أهلاً بك،',
        body: 'الاستبدال مجاني تماماً بدون أي مصاريف شحن داخل القاهرة الكبرى، مندوب التوصيل بيوصلك بالمقاس البديل ويستلم القطعة القديمة مباشرة.',
        closing: 'فترة الاستبدال متاحة خلال 14 يوماً من استلام الشحنة.',
        exactFactMatched: 'Return_Policy_&_Branch_Stock_2025.pdf · Clause 5.2 (Free Exchange)',
      },
    ],
  },
]

export default function InteractiveDemo() {
  const [activeScenarioId, setActiveScenarioId] = useState('clinic')
  const [activeQueryIndex, setActiveQueryIndex] = useState(0)
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
            <span>Interactive Grounding Sandbox &bull; Real-time Verification</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Grounded Retrieval-Augmented Verification Engine.
          </h2>

          <p className="text-sm sm:text-base text-foreground/75 max-w-2xl leading-relaxed">
            Test how Sanad isolates verified prices, procedures, and branch rules directly from business documents to answer visitor inquiries with 100% fidelity.
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
                Sanad Grounding Engine &bull; Cairo Shard [Verified Memory]
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-success/10 text-success border border-success/30 text-xs font-semibold">
                <span className="size-1.5 bg-success shrink-0 animate-pulse" />
                Deterministic Guardrails Active
              </span>
            </div>
          </div>

          {/* Dual Pane Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
            {/* Left Pane: Uploaded Documents & Verified Facts (5 cols) */}
            <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col gap-5 bg-card/40 dark:bg-card/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm">
                  <FileCheck2 className="size-4 text-primary" />
                  <span>1. Uploaded Business Documents</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">Synced</span>
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
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-bold text-foreground truncate">
                        {activeScenario.fileName}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {activeScenario.fileDetails}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold shrink-0 border border-primary/20">
                    <Check className="size-3 text-primary" />
                    Indexed
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Extracted Exact Facts Box */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    Exact Verified Knowledge:
                  </span>
                  <span className="text-[11px] font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5">
                    100% Grounded
                  </span>
                </div>

                <div className="p-3 bg-card border border-primary/30 shadow-2xs flex flex-col gap-2">
                  <div className="space-y-2">
                    {activeScenario.extractedFacts.map((factText, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2 bg-muted/40 border border-border/40 text-xs text-foreground font-medium leading-relaxed"
                      >
                        <span className="size-1.5 bg-primary shrink-0 mt-1.5" />
                        <span>{factText}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Citation Badge */}
              <div className="p-3 bg-card/60 border border-border/50 text-xs font-mono flex flex-col gap-1">
                <span className="text-[10px] uppercase text-muted-foreground">Active Citation Reference</span>
                <span className="text-primary font-semibold truncate">{activeQuery.exactFactMatched}</span>
              </div>

              {/* Smart Guardrail Banner */}
              <div className="flex items-start gap-2.5 p-3 bg-secondary text-secondary-foreground border border-primary/25 text-xs font-medium">
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
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      {activeScenario.title} Digital Assistant
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                      <span className="size-1.5 bg-success shrink-0" />
                      2. Instant Grounded Answer on WhatsApp / Web
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
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>Click to test visitor inquiry:</span>
                  <span className="text-primary font-semibold">Live Egyptian Dialect</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeScenario.queries.map((q, idx) => {
                    const isSelected = activeQueryIndex === idx
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setActiveQueryIndex(idx)}
                        className={`text-xs px-3 py-1.5 text-right font-medium transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary shadow-2xs font-semibold'
                            : 'bg-card border-border/80 text-foreground/80 hover:border-primary/40 hover:text-foreground'
                        }`}
                      >
                        {idx === 0 ? 'سؤال ١: الأسعار والمواعيد' : 'سؤال ٢: الشروط والتقسيط'}
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
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.25 }}
                    className="self-start max-w-[90%]"
                    dir="rtl"
                  >
                    <div className="p-3.5 bg-muted/90 text-foreground text-sm font-medium leading-relaxed border border-border/60 text-right">
                      <p>{activeQuery.questionText}</p>
                    </div>
                    <span className="text-[11px] text-muted-foreground mt-1 block px-1 text-right font-mono">
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
                    dir="rtl"
                  >
                    <div className="p-4 bg-secondary/80 dark:bg-secondary/25 text-secondary-foreground border border-primary/30 shadow-sm flex flex-col gap-2.5 text-right relative">
                      <div className="absolute top-0 start-0 w-1 h-full bg-primary" />

                      {/* Verified Badge Header */}
                      <div
                        className="flex items-center justify-between text-xs font-semibold border-b border-primary/15 pb-2 text-primary"
                        dir="ltr"
                      >
                        <div className="flex items-center gap-1.5">
                          <Zap className="size-3.5 fill-current" />
                          <span className="truncate">{activeQuery.badge}</span>
                        </div>
                        <span className="font-mono text-xs bg-primary/10 px-2 py-0.5">
                          Latency: {activeQuery.latency}
                        </span>
                      </div>

                      {/* Grounded AI Text */}
                      <div className="text-sm font-normal leading-relaxed text-foreground space-y-1.5">
                        <p className="font-semibold text-primary">{activeQuery.greeting}</p>
                        <p>{activeQuery.body}</p>
                        <p>{activeQuery.closing}</p>
                      </div>

                      {/* Live Citation Reference */}
                      <div className="mt-1 pt-2 border-t border-primary/15 text-[10px] font-mono text-muted-foreground" dir="ltr">
                        Source: {activeQuery.exactFactMatched}
                      </div>
                    </div>

                    <span className="text-[11px] text-muted-foreground mt-1 block px-1 text-left font-mono" dir="ltr">
                      Sanad AI &bull; {activeQuery.latency} [100% Grounded]
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Simulated WhatsApp Input Footer */}
              <div className="pt-3 border-t border-border/60 flex items-center gap-2">
                <div className="flex-1 bg-muted/60 border border-border/70 px-4 py-2.5 text-xs text-muted-foreground font-mono">
                  Select a question above or test in live production sandbox...
                </div>
                <div className="size-9 bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0">
                  <Send className="size-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}