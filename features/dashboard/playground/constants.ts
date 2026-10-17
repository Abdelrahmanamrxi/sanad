import type { PlaygroundConfig, SystemPreset } from "./types";

export interface ModelOption {
  id: string;
  name: string;
  badge: string;
  description: string;
  speed: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "openai/gpt-oss-20b",
    name: "Sanad Standard",
    badge: "Recommended",
    speed: "Fast",
    description:
      "Best for everyday customer inquiries. Delivers fast, direct, and factually grounded answers.",
  },
  {
    id: "allam-2-7b",
    name: "Sanad Arabic Specialist (Allam)",
    badge: "Native Arabic",
    speed: "Ultra-Fast",
    description:
      "Specially crafted for fluent Arabic customer conversations, Saudi business terms, and formal replies.",
  },
  {
    id: "openai/gpt-oss-120b",
    name: "Sanad Advanced (High Reasoning)",
    badge: "Complex Inquiries",
    speed: "Deep Analysis",
    description:
      "Best for multi-part customer questions that require step-by-step reasoning and deep policy review.",
  },
  {
    id: "qwen/qwen3.8-27b",
    name: "Sanad Multilingual",
    badge: "Bilingual",
    speed: "Balanced",
    description:
      "Smoothly switches between Arabic and English, ideal for diverse customer bases.",
  },
];

export const SYSTEM_PRESETS: SystemPreset[] = [
  {
    id: "strict-support",
    name: "Customer Support (Strict Grounding)",
    nameAr: "خدمة العملاء (التزام صارم بالمعلومات)",
    description:
      "Answers solely using your verified documents. Politely informs customers if details aren't available.",
    temperature: 0.2,
    strictGrounding: true,
    systemPrompt: `You are Sanad AI, a verified customer support specialist.
Your primary directive is absolute truthfulness based ONLY on the provided context passages.

Guidelines:
1. Base all answers strictly on the retrieved context documents below.
2. If the context does not contain the answer, state clearly in the user's language: "Based on our knowledge base, this information is not currently available."
3. Cite the relevant source document name or section when providing factual figures, policies, or dates.
4. Maintain a professional, polite, and helpful tone in both Arabic and English.`,
  },
  {
    id: "arabic-advisor",
    name: "Arabic Business Advisor (مستشار الأعمال)",
    nameAr: "مستشار الأعمال الذكي",
    description:
      "Fluent Arabic business assistant trained on corporate policies, SLAs, and customer journey.",
    temperature: 0.25,
    strictGrounding: true,
    systemPrompt: `أنت "سند"، المساعد المؤسسي الذكي المعتمد لمنظومة الأعمال.
مهمتك تقديم إجابات دقيقة واحترافية باللغة العربية الفصحى اعتماداً على الوثائق والمستندات المرفقة فقط.

تعليمات الأداء:
1. الإجابة باللغة العربية الفصحى الواضحة والمهنية، مع استخدام المصطلحات المعتمدة في الوثائق.
2. الالتزام الحرفي بنصوص السياسات والشروط المذكورة في سياق البحث.
3. تلخيص الإجراءات والخطوات في نقاط مرقمة لتسهيل القراءة والتنفيذ.
4. الإشارة إلى رقم المادة أو القسم عند الاستشهاد بالشروط واللوائح.`,
  },
  {
    id: "technical-explainer",
    name: "Technical Q&A & Developer Guide",
    nameAr: "الدليل التقني والبرمجي",
    description:
      "Explains technical steps, configuration settings, and guides clearly.",
    temperature: 0.1,
    strictGrounding: false,
    systemPrompt: `You are Sanad Technical Support Agent.
Answer technical questions regarding APIs, data pipelines, integrations, and platform configurations.

Formatting guidelines:
1. Present code snippets inside markdown fenced blocks with language identifiers.
2. Outline preconditions, step-by-step instructions, and expected responses.
3. Highlight critical warnings or parameters using clear emphasis.`,
  },
  {
    id: "concise-summarizer",
    name: "Executive Brief & Fast Q&A",
    nameAr: "الملخص التنفيذي السريع",
    description:
      "High-density answers with bullet points, zero fluff, and immediate action items.",
    temperature: 0.2,
    strictGrounding: true,
    systemPrompt: `You are an executive knowledge assistant.
Deliver concise, high-density summaries of the retrieved information.
Always lead with the direct answer in the first sentence, followed by 3-5 high-signal bullet points. Avoid filler words.`,
  },
];

export const DEFAULT_CONFIG: PlaygroundConfig = {
  model: "openai/gpt-oss-20b",
  systemPrompt: SYSTEM_PRESETS[0].systemPrompt,
  temperature: 0.2,
  strictGrounding: true,
};

export interface CategorizedStarter {
  category: string;
  categoryAr: string;
  query: string;
}

export const CATEGORIZED_STARTERS: CategorizedStarter[] = [
  {
    category: "Returns & Exchanges",
    categoryAr: "الاسترجاع والاستبدال",
    query: "ما هي شروط وسياسة استرجاع المنتجات والمدة المحددة لرد المبالغ؟",
  },
  {
    category: "Working Hours & SLA",
    categoryAr: "أوقات العمل والدعم الفني",
    query: "ما هي أوقات عمل مركز خدمة العملاء والدعم الفني المعتمدة؟",
  },
  {
    category: "Invoicing & Payments",
    categoryAr: "الفواتير والمدفوعات",
    query: "How do I configure notifications for failed customer payments?",
  },
  {
    category: "Document Formats",
    categoryAr: "صيغ ومواصفات الملفات",
    query:
      "What is the maximum file upload size and supported document formats?",
  },
];
