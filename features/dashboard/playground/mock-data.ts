import type {
  PlaygroundChunk,
  PlaygroundMessage,
  PlaygroundMetrics,
} from "./types";

export const initialMockChunks: PlaygroundChunk[] = [
  {
    id: "chk-mock-01",
    documentId: "doc-kb-01",
    documentName: "دليل_المعرفة_خدمة_العملاء.pdf",
    headingPath: "Section 4.2 > سياسة الاسترجاع والاستبدال",
    content:
      "يحق للعميل طلب استرجاع أو استبدال المنتجات المشتراة خلال 14 يوماً من تاريخ استلام الطلب، شريطة أن يكون المنتج بحالته الأصلية غير مستخدم وفي تغليفه الأصلي مع إرفاق فاتورة الشراء الأصلية. يُستثنى من ذلك المنتجات الرقمية والاشتراكات البرمجية بعد تفعيلها.",
    similarity: 0.95,
    rank: 1,
    includedInContext: true,
  },
  {
    id: "chk-mock-02",
    documentId: "doc-kb-01",
    documentName: "دليل_المعرفة_خدمة_العملاء.pdf",
    headingPath: "Section 4.5 > آلية رد المبالغ المالية",
    content:
      "يتم رد المبالغ المستحقة بنفس وسيلة الدفع الأصلية المستخدمة أثناء الشراء خلال مدة تتراوح بين 3 إلى 7 أيام عمل من تاريخ استلام وفحص المنتج المسترجع في مركز التوزيع الرئيسي. لا يتم احتساب رسوم إعادة الشحن إذا كان الإرجاع بسبب عيب مصنعي.",
    similarity: 0.88,
    rank: 2,
    includedInContext: true,
  },
  {
    id: "chk-mock-03",
    documentId: "doc-kb-02",
    documentName: "اتفاقية_مستوى_الخدمة_SLA.pdf",
    headingPath: "Section 2.1 > أوقات العمل والدعم الفني المعتمدة",
    content:
      "يعمل فريق خدمة العملاء والدعم الفني على مدار الساعة طوال أيام الأسبوع (24/7) للمشتركين في الباقة المتقدمة والمؤسسية، ومن الساعة 8:00 صباحاً حتى 10:00 مساءً بتوقيت مكة المكرمة لباقي الباقات عبر قنوات الشات والبريد الإلكتروني المباشر.",
    similarity: 0.74,
    rank: 3,
    includedInContext: true,
  },
];

export const initialMockMetrics: PlaygroundMetrics = {
  latencyMs: 340,
  retrievalMs: 75,
  generationMs: 265,
  promptTokens: 418,
  completionTokens: 184,
  totalTokens: 602,
  model: "Sanad Standard",
};

export const initialMockRawPrompt = `You are Sanad AI, a verified customer support specialist.
Your primary directive is absolute truthfulness based ONLY on the provided context passages.

CRITICAL RULE: Rely strictly on the retrieved context below. If the answer cannot be found in the context, explicitly state that the information is not documented in the knowledge base.

=== VERIFIED DOCUMENT CONTEXT ===
[Source #1: دليل_المعرفة_خدمة_العملاء.pdf | Section: Section 4.2 > سياسة الاسترجاع والاستبدال]
يحق للعميل طلب استرجاع أو استبدال المنتجات المشتراة خلال 14 يوماً من تاريخ استلام الطلب، شريطة أن يكون المنتج بحالته الأصلية غير مستخدم وفي تغليفه الأصلي مع إرفاق فاتورة الشراء الأصلية. يُستثنى من ذلك المنتجات الرقمية والاشتراكات البرمجية بعد تفعيلها.

---

[Source #2: دليل_المعرفة_خدمة_العملاء.pdf | Section: Section 4.5 > آلية رد المبالغ المالية]
يتم رد المبالغ المستحقة بنفس وسيلة الدفع الأصلية المستخدمة أثناء الشراء خلال مدة تتراوح بين 3 إلى 7 أيام عمل من تاريخ استلام وفحص المنتج المسترجع في مركز التوزيع الرئيسي.
=== END OF CONTEXT ===

User: ما هي شروط وسياسة استرجاع المنتجات والمدة المحددة لرد المبالغ؟`;

export const initialMockMessages: PlaygroundMessage[] = [
  {
    id: "msg-mock-1",
    role: "user",
    content: "ما هي شروط وسياسة استرجاع المنتجات والمدة المحددة لرد المبالغ؟",
    createdAt: "10:24 AM",
  },
  {
    id: "msg-mock-2",
    role: "assistant",
    content: `وفقاً لوثائق سياسة خدمة العملاء المعتمدة في قاعدة المعرفة، إليك الشروط والجدول الزمني المعتمد لعمليات الاسترجاع:

1. شروط الاسترجاع والاستبدال:
- يحق للعميل طلب الاسترجاع أو الاستبدال خلال مدة أقصاها **14 يوماً** من تاريخ استلام الطلب.
- يجب أن يكون المنتج بحالته الأصلية تماماً، غير مستخدم، وفي عبوته وتغليفه الأصلي.
- يلزم إرفاق فاتورة الشراء الأصلية مع المنتج المسترجع.
- تُستثنى المنتجات الرقمية وتراخيص البرامج والاشتراكات المفعلة من الاسترجاع.

2. مدة وآلية رد المبالغ المالية:
- تُعاد الأموال بنفس وسيلة الدفع الأصلية (مدى / بطاقة ائتمان / تحويل بنكي).
- تستغرق عملية الرد بين **3 إلى 7 أيام عمل**، وذلك بعد وصول المنتج إلى مركز التوزيع وفحصه والتأكد من سلامته.`,
    createdAt: "10:24 AM",
    retrievedChunks: initialMockChunks,
    metrics: initialMockMetrics,
    rawPrompt: initialMockRawPrompt,
  },
];

export function generateSimulatedResponse(query: string, modelName: string) {
  const isArabic = /[\u0600-\u06FF]/.test(query);

  if (
    query.includes("أوقات") ||
    query.includes("ساعات") ||
    query.toLowerCase().includes("hours") ||
    query.toLowerCase().includes("support")
  ) {
    return {
      answer: isArabic
        ? `بناءً على وثيقة اتفاقية مستوى الخدمة (SLA) المعتمدة:

- **عملاء الباقات المؤسسية والمتقدمة:** الدعم الفني متاح على مدار الساعة طوال أيام الأسبوع (24/7).
- **باقي الباقات:** ساعات العمل المعتمدة من الساعة **8:00 صباحاً حتى 10:00 مساءً** بتوقيت مكة المكرمة عبر قنوات الشات المباشر وتذاكر الدعم.`
        : `Based on the verified SLA documentation:

- **Enterprise & Advanced Tiers:** 24/7 technical and customer support.
- **Standard Tiers:** Operating hours are from **8:00 AM to 10:00 PM (Makkah Time)** daily via live chat and ticket submission.`,
      chunks: [initialMockChunks[2]],
    };
  }

  if (
    query.includes("ملف") ||
    query.includes("حجم") ||
    query.toLowerCase().includes("upload") ||
    query.toLowerCase().includes("file")
  ) {
    return {
      answer: isArabic
        ? `الحد الأقصى لحجم الملف المسموح برفعه إلى قاعدة المعرفة هو **32 ميجابايت** لكل مستند.

الصيغ المدعومة حالياً:
- مستندات PDF (.pdf)
- مستندات Word (.docx)
- ملفات النصوص البرمجية والماركداون (.md, .txt)
- صفحات الويب المباشرة عبر الرابط`
        : `The maximum supported upload size is **32 MB** per document.

Supported file types:
- PDF (.pdf)
- Microsoft Word (.docx)
- Markdown & Plain Text (.md, .txt)
- Direct web documentation links`,
      chunks: initialMockChunks.slice(0, 2),
    };
  }

  return {
    answer: isArabic
      ? `بناءً على مستندات قاعدة المعرفة المسترجعة لسؤالك "${query}":

1. تم التحقق من المعايير والشروط المنصوص عليها في وثائق الخدمة.
2. تطبق اللوائح المعتمدة على كافة المعاملات عبر المنظومة السحابية.
3. يمكنك مراجعة المصادر المرفقة أدناه للاطلاع على التفاصيل النصية الكاملة.`
      : `Based on the verified knowledge base documentation retrieved for "${query}":

1. The policies outlined in the corporate documentation apply directly to this query.
2. Standard turnaround times and regulatory guidelines are fully active.
3. Review the grounding chunk sources below for the complete textual clause reference.`,
    chunks: initialMockChunks,
  };
}
