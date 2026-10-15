import React from "react"
import { FileText, FileCode, FileSpreadsheet, File } from "lucide-react"
import type { DocumentItem, ChunkItem, MimeType } from "./types"

export const initialDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    business_id: "biz-1",
    storage_path: "policies/shipping_and_delivery_policy_2026.pdf",
    markdown_path: "parsed/shipping_and_delivery_policy_2026.md",
    mime_type: "pdf",
    doc_status: "indexed",
    stats: {
      total_chunks: 4,
      total_tokens: 933,
      file_size: 1420500,
    },
    performance: {
      times_cited_30d: 142,
      times_cited_7d: 38,
      satisfaction_rate: 97,
      thumbs_down_count: 2,
      top_queries_helped: [
        { query: "What are the delivery fees inside Cairo?", count: 64 },
        { query: "How long does standard shipping take?", count: 48 },
        { query: "Can I change my delivery address after dispatch?", count: 30 },
      ],
      suggested_questions: [
        "كم تبلغ تكلفة الشحن للمحافظات؟",
        "What is the estimated delivery time for express orders?",
        "Do you offer free shipping above 500 EGP?",
        "What happens if I miss the courier delivery?",
        "How do I track my shipment status?",
        "هل يوجد دفع عند الاستلام لجميع المدن؟",
      ],
    },
    created_at: "2 hours ago",
  },
  {
    id: "doc-2",
    business_id: "biz-1",
    storage_path: "knowledge/store_faqs_and_ramadan_hours.md",
    markdown_path: "parsed/store_faqs_and_ramadan_hours.md",
    mime_type: "markdown",
    doc_status: "indexed",
    stats: {
      total_chunks: 3,
      total_tokens: 615,
      file_size: 48200,
    },
    performance: {
      times_cited_30d: 89,
      times_cited_7d: 21,
      satisfaction_rate: 94,
      thumbs_down_count: 3,
      top_queries_helped: [
        { query: "ما هي مواعيد العمل في رمضان؟", count: 52 },
        { query: "Where is the nearest branch located in New Cairo?", count: 37 },
      ],
      suggested_questions: [
        "ما هي أوقات العمل في فرع التجمع الخامس؟",
        "Are branches open after Iftar during Ramadan?",
        "Is Friday work schedule different?",
        "كيف يمكنني حجز موعد استشارة مسبق؟",
        "What are the official holidays when clinic is closed?",
      ],
    },
    created_at: "5 hours ago",
  },
  {
    id: "doc-3",
    business_id: "biz-1",
    storage_path: "legal/damaged_goods_workflow.pdf",
    mime_type: "pdf",
    doc_status: "failed",
    stats: {
      total_chunks: 0,
      total_tokens: 0,
      file_size: 820100,
    },
    error_message: "Text extraction failed: PDF contains scanned raster pages with no embedded OCR text layer.",
    performance: {
      times_cited_30d: 0,
      times_cited_7d: 0,
      satisfaction_rate: 0,
      thumbs_down_count: 0,
      top_queries_helped: [],
      suggested_questions: [],
    },
    created_at: "1 day ago",
  },
  {
    id: "doc-4",
    business_id: "biz-1",
    storage_path: "catalogs/product_catalog_and_price_list_v4.docx",
    markdown_path: "parsed/product_catalog_and_price_list_v4.md",
    mime_type: "docx",
    doc_status: "indexed",
    stats: {
      total_chunks: 6,
      total_tokens: 1840,
      file_size: 2450000,
    },
    performance: {
      times_cited_30d: 312,
      times_cited_7d: 84,
      satisfaction_rate: 98,
      thumbs_down_count: 1,
      top_queries_helped: [
        { query: "كم سعر تنظيف الأسنان وإزالة الجير؟", count: 118 },
        { query: "What is the cost of Root Canal retreatment?", count: 94 },
        { query: "Do you accept AXA Egypt insurance for veneers?", count: 62 },
        { query: "What is the warranty period for composite fillings?", count: 38 },
      ],
      suggested_questions: [
        "كم سعر كحت الجير العميق للجيوب اللثوية؟",
        "What is included in the Standard Consultation fee?",
        "Does the clinic offer installments with ValU or Sympl?",
        "What is the price of Philips Zoom 4 in-office bleaching?",
        "هل يشمل الفينير ضمان 5 سنوات معتمد؟",
      ],
    },
    created_at: "3 days ago",
  },
  {
    id: "doc-5",
    business_id: "biz-1",
    storage_path: "notes/customer_onboarding_terms.txt",
    markdown_path: "parsed/customer_onboarding_terms.md",
    mime_type: "txt",
    doc_status: "indexed",
    stats: {
      total_chunks: 2,
      total_tokens: 420,
      file_size: 18500,
    },
    performance: {
      times_cited_30d: 0,
      times_cited_7d: 0,
      satisfaction_rate: 0,
      thumbs_down_count: 0,
      top_queries_helped: [],
      suggested_questions: [
        "What personal info is needed to create a patient profile?",
        "Can a guardian register on behalf of a minor?",
      ],
    },
    created_at: "1 week ago",
  },
]

export const mockChunksByDocId: Record<string, ChunkItem[]> = {
  "doc-1": [
    {
      id: "chk-1-0",
      document_id: "doc-1",
      chunk_index: 0,
      heading_path: "General Shipping Terms > Domestic Coverage",
      page_number: 1,
      token_count: 248,
      embedding_model: "text-embedding-3-small",
      content:
        "تشمل خدمات التوصيل جميع محافظات جمهورية مصر العربية، مع إتاحة خدمة التوصيل في نفس اليوم لمدن القاهرة والجيزة والاسكندرية لكافة الطلبات المسجلة قبل الساعة الثانية ظهراً. تستغرق الشحنات لباقي المحافظات من ٢٤ إلى ٤٨ ساعة عمل.",
      created_at: "2026-10-08T14:30:00Z",
    },
    {
      id: "chk-1-1",
      document_id: "doc-1",
      chunk_index: 1,
      heading_path: "Shipping Rates & Free Delivery Threshold",
      page_number: 1,
      token_count: 185,
      embedding_model: "text-embedding-3-small",
      content:
        "تبلغ تكلفة الشحن الثابتة ٥٠ جنيهاً داخل القاهرة الكبرى، و٧٠ جنيهاً لمحافظات الدلتا ومدن القناة، و٩٠ جنيهاً لمحافظات الصعيد. الشحن مجاني بالكامل لأي طلبية تتجاوز قيمتها الإجمالية ١٠٠٠ جنيه مصري.",
      created_at: "2026-10-08T14:30:01Z",
    },
    {
      id: "chk-1-2",
      document_id: "doc-1",
      chunk_index: 2,
      heading_path: "International & GCC Express Delivery",
      page_number: 2,
      token_count: 210,
      embedding_model: "text-embedding-3-small",
      content:
        "الشحن الدولي متاح حالياً لدول مجلس التعاون الخليجي (المملكة العربية السعودية، دولة الإمارات، دولة الكويت) عبر أرامكس ودي إتش إل. تستغرق مدة الشحن من ٣ إلى ٥ أيام عمل مع احتساب رسوم الجمارك والشحن عند إتمام الطلب.",
      created_at: "2026-10-08T14:30:02Z",
    },
    {
      id: "chk-1-3",
      document_id: "doc-1",
      chunk_index: 3,
      heading_path: "Inspection on Delivery & Damaged Packages",
      page_number: 3,
      token_count: 290,
      embedding_model: "text-embedding-3-small",
      content:
        "يحق للعميل فحص وتفقد الشحنة بحضور مندوب التوصيل قبل دفع المبلغ والاستلام. في حالة ملاحظة أي كسر أو تلف ظاهري في العبوة، يحق للعميل رفض استلام الشحنة وإعادتها فوراً مع المندوب دون تحمل أي مصاريف شحن.",
      created_at: "2026-10-08T14:30:03Z",
    },
  ],
  "doc-2": [
    {
      id: "chk-2-0",
      document_id: "doc-2",
      chunk_index: 0,
      heading_path: "Store Hours > Regular & Weekend Schedule",
      page_number: 1,
      token_count: 195,
      embedding_model: "text-embedding-3-small",
      content:
        "مواعيد العمل الرسمية في جميع الفروع والمعارض: من السبت إلى الخميس من الساعة ١٠:٠٠ صباحاً حتى ١١:٠٠ مساءً، ويوم الجمعة من الساعة ٢:٠٠ ظهراً حتى ١١:٣٠ مساءً. خدمة العملاء عبر الواتساب والموقع متاحة طوال أيام الأسبوع.",
      created_at: "2026-10-08T12:00:00Z",
    },
    {
      id: "chk-2-1",
      document_id: "doc-2",
      chunk_index: 1,
      heading_path: "Seasonal Hours > Holy Month of Ramadan",
      page_number: 1,
      token_count: 210,
      embedding_model: "text-embedding-3-small",
      content:
        "مواعيد العمل خلال شهر رمضان المبارك تنقسم إلى فترتين: الفترة الصباحية من الساعة ١١:٠٠ صباحاً حتى ٥:٠٠ مساءً قبل الإفطار، والفترة المسائية من الساعة ٨:٠٠ مساءً حتى ٢:٠٠ صباحاً بعد صلاة التراويح.",
      created_at: "2026-10-08T12:00:01Z",
    },
    {
      id: "chk-2-2",
      document_id: "doc-2",
      chunk_index: 2,
      heading_path: "Accepted Payment Methods & Installments",
      page_number: 2,
      token_count: 210,
      embedding_model: "text-embedding-3-small",
      content:
        "نقبل الدفع عند الاستلام نقداً، والبطاقات الائتمانية والمصرفية (فيزا وماستركارد وميزة)، والمحافظ الإلكترونية (فودافون كاش، انستاباي). كما متاح التقسيط المباشر بدون فوائد عبر منصات فاليو (valU) وتوبي وميزة لمدة تصل إلى ١٢ شهراً.",
      created_at: "2026-10-08T12:00:02Z",
    },
  ],
  "doc-4": [
    {
      id: "chk-4-0",
      document_id: "doc-4",
      chunk_index: 0,
      heading_path: "Product Catalog > Hair Care & Treatments",
      page_number: 1,
      token_count: 320,
      embedding_model: "text-embedding-3-small",
      content:
        "باقات العناية بالشعر: جلسة بروتين برازيلي علاجي ٨٥٠ ج.م، جلسة بوتوكس للشعر ٦٥0 ج.م، جلسة ترميم كولاجين ٥٠٠ ج.م. تشمل جميع الجلسات غسيل وتنظيف الفروة وسيروم ترطيب مجاني.",
      created_at: "2026-10-06T10:00:00Z",
    },
    {
      id: "chk-4-1",
      document_id: "doc-4",
      chunk_index: 1,
      heading_path: "Product Catalog > Skin & Facial Treatments",
      page_number: 1,
      token_count: 290,
      embedding_model: "text-embedding-3-small",
      content:
        "جلسات تنظيف وتقشير البشرة: هيدرافيشل ملكي ٩ مراحل ٥٥٠ ج.م، تنظيف بشرة عميق ٤٠٠ ج.م، جلسة ديرمابن مع ميزوثيرابي ٧٠٠ ج.م. تطبق المنتجات الطبية المعتمدة من وزارة الصحة.",
      created_at: "2026-10-06T10:00:01Z",
    },
  ],
  "doc-5": [
    {
      id: "chk-5-0",
      document_id: "doc-5",
      chunk_index: 0,
      heading_path: "Onboarding Terms > Account Verification",
      page_number: 1,
      token_count: 210,
      embedding_model: "text-embedding-3-small",
      content:
        "يتطلب تفعيل الحسابات الجديدة إدخال رقم هاتف مصري صالح وتأكيد الرمز المرسل عبر الرسائل النصية القصيرة (SMS). لا يسمح بمشاركة الحساب أو تكرار التسجيل لنفس المستفيد.",
      created_at: "2026-10-01T09:00:00Z",
    },
    {
      id: "chk-5-1",
      document_id: "doc-5",
      chunk_index: 1,
      heading_path: "Onboarding Terms > Privacy & Data Handling",
      page_number: 1,
      token_count: 210,
      embedding_model: "text-embedding-3-small",
      content:
        "يتم تخزين بيانات العملاء وسجلات المحادثات بأمان تام وفقاً لأحدث معايير التشفير. لا يتم بيع أو مشاركة أي بيانات شخصية مع أطراف ثالثة خارج مزودي خدمات التوصيل والمدفوعات المعتمدين.",
      created_at: "2026-10-01T09:00:01Z",
    },
  ],
}

/* ── Utility formatting functions ── */

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export function getFileName(path: string): string {
  return path.split("/").pop() || path
}

export function getFileIcon(mime: MimeType) {
  switch (mime) {
    case "pdf":
      return <FileText className="size-4 text-destructive" />
    case "markdown":
      return <FileCode className="size-4 text-primary" />
    case "docx":
      return <FileText className="size-4 text-primary" />
    case "txt":
    default:
      return <File className="size-4 text-highlight" />
  }
}

export function getFormatBadge(mime: MimeType): string {
  switch (mime) {
    case "pdf":
      return "PDF"
    case "markdown":
      return "MD"
    case "docx":
      return "DOCX"
    case "txt":
    default:
      return "TXT"
  }
}
