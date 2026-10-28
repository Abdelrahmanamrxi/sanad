import { ConversationItem } from "./types";

export const MOCK_CONVERSATIONS: ConversationItem[] = [
  {
    id: "conv-101",
    visitorId: "vis-8492",
    title: "Enterprise Plan & Volume Pricing",
    channel: "widget",
    status: "active",
    hasLead: true,
    originPage: "/pricing",
    summary:
      "Visitor asked about enterprise volume tier for 50,000 monthly inquiries and custom vector search limits; shared contact details for sales callback.",
    lastMessageSnippet: "Thank you Ahmed, our enterprise team will reach out via WhatsApp and email.",
    lastMessageAt: "10m ago",
    messagesCount: 6,
    lead: {
      name: "Ahmed Khan",
      email: "ahmed.khan@techcorp.sa",
      phone: "+966 50 123 4567",
      company: "TechCorp Logistics",
      status: "new",
    },
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "السلام عليكم، هل متاح خطة مخصصة لعدد استفسارات يتجاوز 50 ألف شهرياً وربط الـ API بالنظام الداخلي؟",
        createdAt: "10:14 AM",
      },
      {
        id: "msg-2",
        role: "assistant",
        content:
          "وعليكم السلام ورحمة الله. نعم، خطة المؤسسات (Enterprise) مصممة خصيصاً لحجم الاستفسارات الكبير، وتوفر وصولاً كاملاً لـ API مع دعم فني مخصص وSLA بنسبة 99.9%.",
        createdAt: "10:14 AM",
        source: {
          documentName: "Enterprise Tier & SLA Guide v2",
          similarity: 0.96,
          chunkSnippet:
            "Enterprise plan supports custom query volumes exceeding 50,000 monthly turns, tailored vector dimensions, dedicated infrastructure, and direct Webhook/REST API connectivity.",
        },
      },
      {
        id: "msg-3",
        role: "user",
        content: "ممتاز، محتاج حد من فريق المبيعات يتواصل معايا للتفاصيل وتفعيل نسخة تجريبية.",
        createdAt: "10:15 AM",
      },
      {
        id: "msg-4",
        role: "assistant",
        content: "يسعدنا ذلك جداً! يرجى تزويدي بالاسم، ورقم الجوال والبريد الإلكتروني للعمل لتسجيل طلبك.",
        createdAt: "10:15 AM",
      },
      {
        id: "msg-5",
        role: "user",
        content: "اسمي أحمد خان، شركتنا TechCorp Logistics، إيميلي ahmed.khan@techcorp.sa ورقمي 0501234567.",
        createdAt: "10:16 AM",
        isLeadCaptureEvent: true,
        capturedData: {
          name: "Ahmed Khan",
          email: "ahmed.khan@techcorp.sa",
          phone: "+966 50 123 4567",
        },
      },
      {
        id: "msg-6",
        role: "assistant",
        content:
          "تم تسجيل بياناتك بنجاح يا أستاذ أحمد. سيتواصل معك أحد مستشارينا عبر الواتساب والبريد خلال ساعة واحدة لتحديد موعد العرض التوضيحي. شكراً لاهتمامك بسند!",
        createdAt: "10:16 AM",
      },
    ],
  },
  {
    id: "conv-102",
    visitorId: "vis-8490",
    title: "Saudi Customs & Bulk Shipping",
    channel: "widget",
    status: "active",
    hasLead: true,
    originPage: "/shipping-policy",
    summary:
      "Customer inquired about commercial clearance requirements and tax invoices for bulk shipments to Riyadh; left contact for business account setup.",
    lastMessageSnippet: "I have submitted your request for commercial clearance assistance.",
    lastMessageAt: "28m ago",
    messagesCount: 4,
    lead: {
      name: "Sarah Al-Mansoor",
      email: "sarah.m@almansoorgroup.com",
      phone: "+966 54 987 6543",
      company: "Al-Mansoor Trading",
      status: "new",
    },
    messages: [
      {
        id: "msg-201",
        role: "user",
        content: "هل يتم إصدار فواتير ضريبية معتمدة من هيئة الزكاة والضريبة والجمارك (ZATCA) للشحنات التجارية؟",
        createdAt: "9:54 AM",
      },
      {
        id: "msg-202",
        role: "assistant",
        content:
          "نعم بالتأكيد. جميع الفواتير الصادرة متوافقة تماماً مع متطلبات الفوترة الإلكترونية للمرحلة الثانية التابعة لهيئة الزكاة والضريبة والجمارك (ZATCA) وتحتوي على رمز الاستجابة السريع (QR Code) والرقم الضريبي.",
        createdAt: "9:55 AM",
        source: {
          documentName: "Saudi Tax & ZATCA Invoicing Policy",
          similarity: 0.94,
          chunkSnippet:
            "All B2B and merchant invoices comply with Phase 2 ZATCA electronic invoicing guidelines, featuring cryptographic stamps and compliant QR codes.",
        },
      },
      {
        id: "msg-203",
        role: "user",
        content: "تمام، أرجو فتح حساب تاجر باسم مجموعة المنصور. إيميل sarah.m@almansoorgroup.com وجوال 0549876543.",
        createdAt: "9:57 AM",
        isLeadCaptureEvent: true,
        capturedData: {
          name: "Sarah Al-Mansoor",
          email: "sarah.m@almansoorgroup.com",
          phone: "+966 54 987 6543",
        },
      },
      {
        id: "msg-204",
        role: "assistant",
        content: "أهلاً بكِ أستاذة سارة. تم تسجيل بيانات مجموعة المنصور، وسيقوم مسؤول الحسابات التجارية بالتواصل فوراً لتفعيل الحساب.",
        createdAt: "9:58 AM",
      },
    ],
  },
  {
    id: "conv-103",
    visitorId: "vis-8488",
    title: "International Return Shipping Window",
    channel: "widget",
    status: "resolved",
    hasLead: false,
    originPage: "/returns",
    summary: "Visitor clarified the 14-day international return window and courier drop-off locations.",
    lastMessageSnippet: "You can hand over the package to any local DHL branch.",
    lastMessageAt: "1h ago",
    messagesCount: 4,
    messages: [
      {
        id: "msg-301",
        role: "user",
        content: "كم المدة المتاحة لاسترجاع المنتجات من خارج مصر؟",
        createdAt: "9:10 AM",
      },
      {
        id: "msg-302",
        role: "assistant",
        content:
          "فترة الاسترجاع للطلبات الدولية هي 14 يوماً من تاريخ استلام الشحنة، بشرط أن تكون المنتجات بحالتها الأصلية غير المستخدمة في عبوتها الرسمية.",
        createdAt: "9:10 AM",
        source: {
          documentName: "Global Returns & Exchanges v1.4",
          similarity: 0.98,
          chunkSnippet:
            "International orders are eligible for return within 14 calendar days from receipt date provided packaging is intact.",
        },
      },
      {
        id: "msg-303",
        role: "user",
        content: "شكراً جزيلاً، واضح جداً.",
        createdAt: "9:11 AM",
      },
      {
        id: "msg-304",
        role: "assistant",
        content: "العفو! نسعد دائماً بخدمتك. نتمنى لك يوماً سعيداً.",
        createdAt: "9:11 AM",
      },
    ],
  },
  {
    id: "conv-104",
    visitorId: "vis-8482",
    title: "Installment Payment via Tabby / Tamara",
    channel: "widget",
    status: "needs_attention",
    hasLead: false,
    originPage: "/checkout",
    summary: "Visitor inquired about Tabby 4-month zero-interest installments; similarity score fell below threshold.",
    lastMessageSnippet: "I apologize, our knowledge base does not currently state installment provider fees.",
    lastMessageAt: "2h ago",
    messagesCount: 3,
    messages: [
      {
        id: "msg-401",
        role: "user",
        content: "هل متاح التقسيط على 4 دفعات بدون فوائد عن طريق تابي أو تمارا في صفحة الدفع؟",
        createdAt: "8:20 AM",
      },
      {
        id: "msg-402",
        role: "assistant",
        content:
          "نحن ندعم الدفع بالبطاقات الائتمانية والدفع عند الاستلام. حالياً لا توجد تفاصيل مؤكدة في المستندات المعتمدة حول التقسيط عبر تابي أو تمارا.",
        createdAt: "8:20 AM",
        source: {
          documentName: "Payment Gateway Integration Guide",
          similarity: 0.48, // Low confidence!
          chunkSnippet: "Supported payment methods: Visa, Mastercard, Mada, Apple Pay, and Cash on Delivery.",
        },
      },
      {
        id: "msg-403",
        role: "user",
        content: "تمام، كنت محتاج أعرف لو في رسوم إضافية للتقسيط.",
        createdAt: "8:21 AM",
      },
    ],
  },
  {
    id: "conv-105",
    visitorId: "vis-8475",
    title: "Wholesale Order Discount Verification",
    channel: "widget",
    status: "active",
    hasLead: true,
    originPage: "/catalog",
    summary: "Wholesale inquiry for 200 units; contact details gathered for supplier discount code.",
    lastMessageSnippet: "Contact details forwarded to supplier relations.",
    lastMessageAt: "3h ago",
    messagesCount: 4,
    lead: {
      name: "Tarek Helmy",
      email: "tarek.helmy@retailhub.eg",
      phone: "+20 10 9988 7766",
      company: "RetailHub Egypt",
      status: "contacted",
    },
    messages: [
      {
        id: "msg-501",
        role: "user",
        content: "مساء الخير، لو هطلب كمية جملة أكثر من 200 قطعة، هل في كود خصم خاص للمتاجر؟",
        createdAt: "7:40 AM",
      },
      {
        id: "msg-502",
        role: "assistant",
        content:
          "مساء النور! نعم، توجد أسعار مخصصة للطلبات التجارية والجملة تبدأ من خصم 25% مع إمكانية توفير شحن مباشر لمستودعاتكم.",
        createdAt: "7:40 AM",
        source: {
          documentName: "Wholesale & B2B Volume Matrix",
          similarity: 0.92,
        },
      },
      {
        id: "msg-503",
        role: "user",
        content: "ممتاز، ده إيميلي tarek.helmy@retailhub.eg ورقمي 01099887766، أرجو إرسال الكتالوج وقائمة الأسعار.",
        createdAt: "7:42 AM",
        isLeadCaptureEvent: true,
        capturedData: {
          name: "Tarek Helmy",
          email: "tarek.helmy@retailhub.eg",
          phone: "+20 10 9988 7766",
        },
      },
      {
        id: "msg-504",
        role: "assistant",
        content: "تم إرسال طلبك لفريق مبيعات الجملة يا أستاذ طارق. سيتم إرسال الكتالوج والأسعار عبر الإيميل فوراً.",
        createdAt: "7:43 AM",
      },
    ],
  },
  {
    id: "conv-106",
    visitorId: "vis-8460",
    title: "Cash on Delivery Availability in Alexandria",
    channel: "widget",
    status: "resolved",
    hasLead: false,
    originPage: "/faq",
    summary: "Confirmed COD availability and 35 EGP standard courier fee for Alexandria.",
    lastMessageSnippet: "Delivery takes 2 to 3 business days via our courier partners.",
    lastMessageAt: "5h ago",
    messagesCount: 4,
    messages: [
      {
        id: "msg-601",
        role: "user",
        content: "هل متاح الدفع عند الاستلام لمحافظة الإسكندرية وكم يستغرق التوصيل؟",
        createdAt: "5:15 AM",
      },
      {
        id: "msg-602",
        role: "assistant",
        content:
          "نعم، الدفع عند الاستلام متاح لجميع محافظات جمهورية مصر العربية بما في ذلك الإسكندرية. مدة التوصيل للإسكندرية هي 2 إلى 3 أيام عمل برسوم شحن 35 جنيهاً مصرياً.",
        createdAt: "5:15 AM",
        source: {
          documentName: "Domestic Shipping & Rates 2026",
          similarity: 0.97,
        },
      },
      {
        id: "msg-603",
        role: "user",
        content: "شكراً تم تأكيد الطلب.",
        createdAt: "5:16 AM",
      },
      {
        id: "msg-604",
        role: "assistant",
        content: "سعداء بخدمتك دائماً! نتمنى لك تجربة تسوق ممتعة.",
        createdAt: "5:16 AM",
      },
    ],
  },
];
