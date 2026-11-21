'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import {
  HelpCircle,
  Search,
  ArrowRight,
  MessageCircle,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface FAQItem {
  id: string
  category: 'safety' | 'dialect' | 'integration'
  question: string
  answer: string
}

const faqDataAr: FAQItem[] = [
  {
    id: 'hallucination-safety',
    category: 'safety',
    question: 'هل يمكن للمساعد أن يؤلف أسعاراً أو نصائح طبية غير صحيحة؟',
    answer:
      'مستحيل. يعمل «سند» وفق ضوابط استرجاع صارمة (RAG). يقتبس فقط الأسعار والإجراءات وجداول الأطباء المستخرجة رسمياً من ملفاتك المعتمدة. إذا خرج السؤال عن الملفات، يمتنع المساعد بأدب عن التخمين أو التأليف.',
  },
  {
    id: 'dialect-slang',
    category: 'dialect',
    question: 'هل يفهم المساعد العامية المصرية والفرانكو والمصطلحات الدارجة حقاً؟',
    answer:
      'نعم بكل تأكيد. تم تدريب «سند» بشكل مخصص على اللهجة المصرية المحكية، الاختصارات الدارجة، الأخطاء الإملائية الشائعة، والفرانكو العربي (Arabizi). يفهم المساعد قصد العميل دون الحاجة لكتابة فصحى منمقة.',
  },
  {
    id: 'website-installation',
    category: 'integration',
    question: 'ما مدى صعوبة تثبيت المساعد في موقعي؟ هل أحتاج لمبرمج؟',
    answer:
      'التثبيت يستغرق أقل من دقيقتين. كل ما عليك هو نسخ سطر برمجي واحد ولصقه في موقعك — متوافق فوراً مع ووردبريس، ويكس، شوبيفاي، والمواقع المخصصة دون أي خبرة برمجية.',
  },
  {
    id: 'unanswered-questions',
    category: 'safety',
    question: 'ماذا يحدث لو سأل العميل عن معلومة غير موجودة في أوراقي؟',
    answer:
      'بدلاً من أن يؤلف إجابة، يخبر العميل بلباقة بأن المعلومة قيد المراجعة مع الإدارة، ويحول السؤال تلقائياً إلى «قائمة الأسئلة المعلقة» في لوحة تحكمك. تجيب عليها مرة واحدة، ويتعلمها «سند» لجميع العملاء القادمين.',
  },
  {
    id: 'data-privacy',
    category: 'integration',
    question: 'هل يمكن للمنافسين سحب قوائم أسعارنا أو سجلات محادثات عملائنا؟',
    answer:
      'أبداً. تُخزن متجهات المعرفة في قواعد بيانات سحابية معزولة ومشفرة ومحمية بسياسات CORS الصارمة. لا يستجيب المساعد إلا للطلبات القادمة من نطاقات موقعك المعتمدة فقط.',
  },
]

const faqDataEn: FAQItem[] = [
  {
    id: 'hallucination-safety',
    category: 'safety',
    question: 'Will the bot make up prices or dangerous medical advice?',
    answer:
      'Never. Sanad operates with strict retrieval-augmented boundaries (RAG). It only quotes verified prices, procedures, and branch schedules directly extracted from your uploaded documents. If an inquiry falls outside your uploaded facts, Sanad gracefully refrains rather than speculating or hallucinating.',
  },
  {
    id: 'dialect-slang',
    category: 'dialect',
    question: 'Does it really understand Egyptian slang, abbreviations, and Franco?',
    answer:
      'Yes. Sanad is specifically fine-tuned on real Egyptian dialect (Ammiya), colloquial abbreviations, common phonetic typos, and Franco-Arabic (Arabizi). Whether a customer types in Egyptian slang or Franco, Sanad identifies intent accurately without requiring standardized Modern Standard Arabic.',
  },
  {
    id: 'website-installation',
    category: 'integration',
    question: 'How hard is the website installation? Do I need a software engineer?',
    answer:
      'Installation takes less than two minutes. You simply paste a single <script> tag into your website header or footer—compatible with WordPress, Wix, Shopify, custom HTML, and modern React/Next.js sites. No software engineer or complex backend setup is required.',
  },
  {
    id: 'unanswered-questions',
    category: 'safety',
    question: 'What happens when a customer asks something not in my documents?',
    answer:
      'Rather than guessing, Sanad politely states that this information is being verified by management and instantly routes the inquiry into your dashboard Unanswered Queue. You answer it once in your portal, and Sanad automatically learns it for all future customer conversations.',
  },
  {
    id: 'data-privacy',
    category: 'integration',
    question: 'Can competitors scrape our price lists or customer chat logs?',
    answer:
      'Never. All knowledge vectors are stored in private, isolated database schemas protected by strict CORS origin policies. Your widget only executes requests originating from your verified domain names.',
  },
]

export default function FAQ() {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'
  const faqData = isArabic ? faqDataAr : faqDataEn

  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section
      id="faq"
      className="relative scroll-mt-24 w-full bg-background dark:bg-[#091413] py-16 sm:py-24 border-t border-border/60 overflow-hidden"
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
      <div className="pointer-events-none absolute top-1/3 start-1/2 -translate-x-1/2 size-96 bg-primary/5 rounded-none blur-3xl" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider border border-primary/20 shadow-2xs">
            <HelpCircle className="size-3.5 text-primary" />
            <span>{t('faq.badge')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
            {t('faq.title')}
          </h2>

          <p className="text-sm sm:text-base text-foreground/75 max-w-xl leading-relaxed">
            {t('faq.subtitle')}
          </p>
        </div>

        {/* Interactive Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-card border border-border/80 shadow-2xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-primary text-primary-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {t('faq.all')}
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('safety')}
              className={`px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'safety'
                  ? 'bg-primary text-primary-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {t('faq.safety')}
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('dialect')}
              className={`px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'dialect'
                  ? 'bg-primary text-primary-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {t('faq.dialect')}
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('integration')}
              className={`px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === 'integration'
                  ? 'bg-primary text-primary-foreground shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {t('faq.integration')}
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="size-3.5 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isArabic ? 'ابحث في الأسئلة الشائعة...' : 'Filter topics...'}
              className="w-full bg-card border border-border/80 ps-9 pe-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary rounded-none shadow-2xs"
            />
          </div>
        </div>

        {/* Accordion List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {filteredFaqs.length > 0 ? (
            <Accordion
              defaultValue={['hallucination-safety']}
              className="flex flex-col gap-3.5"
            >
              {filteredFaqs.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-card/95 dark:bg-[#132322] border border-border/80 shadow-2xs hover:border-primary/50 transition-colors px-5 sm:px-6 py-1 rounded-none border-b"
                >
                  <AccordionTrigger className="text-start text-base sm:text-lg font-bold text-foreground hover:no-underline py-4 cursor-pointer">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-base text-foreground/80 leading-relaxed font-normal pt-1 pb-4 text-start">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="p-8 text-center bg-card border border-border/80 text-muted-foreground text-sm font-mono">
              {isArabic
                ? `لم يتم العثور على نتائج تطابق «${searchQuery}». جرّب كلمة بحث أخرى.`
                : `No matching questions found for "${searchQuery}". Try another term.`}
            </div>
          )}
        </motion.div>

        {/* Bottom Interactive Support Card */}
        <div className="mt-12 p-6 sm:p-7 bg-secondary/35 dark:bg-secondary/15 border border-primary/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
              <MessageCircle className="size-5" />
            </div>
            <div className="text-start">
              <h3 className="text-sm font-bold text-foreground">
                {isArabic
                  ? 'لديك سؤال خاص بنشاطك التجاري أو عيادتك؟'
                  : 'Have a question specific to your clinic or restaurant?'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isArabic
                  ? 'يقوم مهندسو الحلول في القاهرة بمراجعة ملفاتك واستفسارك في أقل من ساعة عمل واحدة.'
                  : 'Our Cairo-based solutions engineers review documents and setups within 1 business hour.'}
              </p>
            </div>
          </div>

          <Link
            href="mailto:abdelrahmanamrxi@gmail.com?subject=Sanad%20Inquiry"
            className="shrink-0 w-full sm:w-auto"
          >
            <Button size="sm" className="w-full sm:w-auto rounded-none font-semibold group cursor-pointer">
              {isArabic ? 'تحدث مع فريقنا' : 'Ask Our Team'}
              <ArrowRight className="size-3.5 ms-1.5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
