import React from "react"
import { FileText, FileCode, FileSpreadsheet, File } from "lucide-react"
import type { DocumentItem, ChunkItem, MimeType } from "./types"

export const initialDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    business_id: "biz-1",
    storage_path: "policies/shipping_and_delivery_policy_2026.pdf",
    markdown_path: "parsed/shipping_and_delivery_policy_2026.md",
    mime_type: "application/pdf",
    doc_status: "indexed",
    stats: {
      total_chunks: 4,
      total_tokens: 933,
      file_size: 1420500,
    },
    created_at: "2 hours ago",
  },
  {
    id: "doc-2",
    business_id: "biz-1",
    storage_path: "knowledge/store_faqs_and_ramadan_hours.md",
    markdown_path: "parsed/store_faqs_and_ramadan_hours.md",
    mime_type: "text/markdown",
    doc_status: "indexed",
    stats: {
      total_chunks: 3,
      total_tokens: 615,
      file_size: 48200,
    },
    created_at: "5 hours ago",
  },
  {
    id: "doc-3",
    business_id: "biz-1",
    storage_path: "legal/damaged_goods_workflow.pdf",
    mime_type: "application/pdf",
    doc_status: "failed",
    stats: {
      total_chunks: 0,
      total_tokens: 0,
      file_size: 820100,
    },
    error_message: "Text extraction failed: PDF contains scanned raster pages with no embedded OCR text layer.",
    created_at: "1 day ago",
  },
  {
    id: "doc-4",
    business_id: "biz-1",
    storage_path: "catalogs/product_catalog_and_price_list_v4.csv",
    markdown_path: "parsed/product_catalog_and_price_list_v4.md",
    mime_type: "text/csv",
    doc_status: "indexed",
    stats: {
      total_chunks: 6,
      total_tokens: 1840,
      file_size: 2450000,
    },
    created_at: "3 days ago",
  },
  {
    id: "doc-5",
    business_id: "biz-1",
    storage_path: "notes/customer_onboarding_terms.txt",
    markdown_path: "parsed/customer_onboarding_terms.md",
    mime_type: "text/plain",
    doc_status: "indexed",
    stats: {
      total_chunks: 2,
      total_tokens: 420,
      file_size: 18500,
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
    case "application/pdf":
      return <FileText className="size-4 text-destructive" />
    case "text/markdown":
      return <FileCode className="size-4 text-primary" />
    case "text/csv":
      return <FileSpreadsheet className="size-4 text-success" />
    case "text/plain":
    default:
      return <File className="size-4 text-highlight" />
  }
}

export function getFormatBadge(mime: MimeType): string {
  switch (mime) {
    case "application/pdf":
      return "PDF"
    case "text/markdown":
      return "MD"
    case "text/csv":
      return "CSV"
    case "text/plain":
    default:
      return "TXT"
  }
}
