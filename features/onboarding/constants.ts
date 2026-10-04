import { BusinessSectorMeta, ColorPreset } from "./types";

export const BUSINESS_SECTORS: BusinessSectorMeta[] = [
  {
    id: "salon",
    titleEn: "Salon & Wellness",
    titleAr: "صالون وتجميل وعناية",
    badgeEn: "SALON // WELLNESS",
    badgeAr: "صالون // عناية وتجميل",
    descriptionEn: "Hair & skincare services, price inquiries, packages, and client care.",
    descriptionAr: "خدمات الشعر والبشرة، استفسارات الأسعار، الباقات، وخدمة العملاء.",
    iconName: "scissors",
    sampleItem: {
      titleEn: "Royal Keratin & Scalp Therapy",
      titleAr: "جلسة العناية والعلاج الملكي للشعر",
      subEn: "60 mins · Lead Stylist",
      subAr: "٦٠ دقيقة · إشراف الأخصائية",
      tagEn: "POPULAR SERVICE",
      tagAr: "الخدمة الأكثر طلباً",
      actionEn: "Inquire about Service",
      actionAr: "استفسار عن الخدمة",
      price: "650 EGP",
    },
  },
  {
    id: "brand",
    titleEn: "Brand & Retail",
    titleAr: "علامة تجارية ومتجر",
    badgeEn: "BRAND // RETAIL",
    badgeAr: "علامة // متجر تجزئة",
    descriptionEn: "Product catalog, sizing assistance, delivery tracking, and store support.",
    descriptionAr: "كتالوج المنتجات، المساعدة في المقاسات، تتبع الشحنات، وخدمة المتجر.",
    iconName: "shopping-bag",
    sampleItem: {
      titleEn: "Linen Minimalist Kimono — Drop 02",
      titleAr: "كيمونو كتان مصري فاخر — الإصدار الثاني",
      subEn: "In Stock · Same Day Delivery in Cairo",
      subAr: "متوفر بالمخزون · توصيل سريع في القاهرة",
      tagEn: "LIMITED EDITION",
      tagAr: "إصدار حصري",
      actionEn: "Inquire about Sizing",
      actionAr: "استفسار عن المقاس",
      price: "1,250 EGP",
    },
  },
  {
    id: "restaurant",
    titleEn: "Restaurant & Cafe",
    titleAr: "مطعم ومقهى ومخبز",
    badgeEn: "DINING // HOSPITALITY",
    badgeAr: "مطاعم // ضيافة ومقاهي",
    descriptionEn: "Digital menus, chef specials, dietary options, and guest hospitality.",
    descriptionAr: "قوائم الطعام، أطباق الشيف، الخيارات الغذائية، وضيافة الزوار.",
    iconName: "utensils",
    sampleItem: {
      titleEn: "Smoked Brisket Brioche & Truffle Mash",
      titleAr: "بريوش بريسكت مدخن مع بطاطس بالكمأة",
      subEn: "Chef Selection · Table Dining",
      subAr: "اختيار الشيف · خدمة طاولات",
      tagEn: "SIGNATURE DISH",
      tagAr: "طبق الشيف المميز",
      actionEn: "View Menu Details",
      actionAr: "تفاصيل القائمة",
      price: "340 EGP",
    },
  },
  {
    id: "clinic",
    titleEn: "Clinic & Healthcare",
    titleAr: "عيادة ومركز طبي",
    badgeEn: "CLINIC // HEALTHCARE",
    badgeAr: "عيادة // رعاية طبية",
    descriptionEn: "Medical specialties, clinic working hours, insurance inquiries, and patient care.",
    descriptionAr: "التخصصات الطبية، مواعيد العيادة، استفسارات التأمين، ورعاية المراجعين.",
    iconName: "stethoscope",
    sampleItem: {
      titleEn: "Comprehensive Consultation & Examination",
      titleAr: "كشف استشاري وفحص شامل",
      subEn: "Senior Specialist · Modern Clinic",
      subAr: "استشاري أول · المركز التخصصي",
      tagEn: "MEDICAL CONSULT",
      tagAr: "كشف استشاري",
      actionEn: "Inquire about Clinic",
      actionAr: "استفسار عن العيادة",
      price: "600 EGP",
    },
  },
];

export const COLOR_PRESETS: ColorPreset[] = [
  {
    id: "oasis",
    name: "Nile Teal & Amber",
    primary: "#0F5C55",
    secondary: "#E8A33D",
    accent: "#D3E6E2",
    description: "Deep Egyptian teal paired with glowing warm amber accents.",
  },
  {
    id: "clay",
    name: "Desert Clay & Slate",
    primary: "#9C4A2F",
    secondary: "#1C2B29",
    accent: "#EBD8CD",
    description: "Earthy terracotta tones inspired by sun-baked architecture.",
  },
  {
    id: "noir",
    name: "Royal Noir & Gold",
    primary: "#14181B",
    secondary: "#D4AF37",
    accent: "#ECE7DA",
    description: "Monolithic deep charcoal with refined champagne gold accents.",
  },
  {
    id: "sage",
    name: "Delta Sage & Chalk",
    primary: "#244F43",
    secondary: "#C7A667",
    accent: "#D7E3DC",
    description: "Lush botanical tones with crisp modern contrast.",
  },
  {
    id: "midnight",
    name: "Midnight Indigo & Coral",
    primary: "#18233C",
    secondary: "#E26D5C",
    accent: "#D3DBE8",
    description: "Modern tech-luxe deep navy punctuated with warm coral.",
  },
];

// Egypt Only with Major Cities and Commercial Hubs
export const EGYPT_CITIES = [
  { cityEn: "Cairo", cityAr: "القاهرة", regionEn: "Greater Cairo", regionAr: "القاهرة الكبرى" },
  { cityEn: "New Cairo", cityAr: "القاهرة الجديدة", regionEn: "Fifth Settlement", regionAr: "التجمع الخامس" },
  { cityEn: "Sheikh Zayed", cityAr: "الشيخ زايد", regionEn: "Giza / West Cairo", regionAr: "الجيزة / غرب القاهرة" },
  { cityEn: "6th of October", cityAr: "السادس من أكتوبر", regionEn: "Giza", regionAr: "الجيزة" },
  { cityEn: "Alexandria", cityAr: "الإسكندرية", regionEn: "Alexandria Governorate", regionAr: "محافظة الإسكندرية" },
  { cityEn: "Giza", cityAr: "الجيزة", regionEn: "Giza Governorate", regionAr: "محافظة الجيزة" },
  { cityEn: "Mansoura", cityAr: "المنصورة", regionEn: "Dakahlia", regionAr: "الدقهلية" },
  { cityEn: "Tanta", cityAr: "طنطا", regionEn: "Gharbia", regionAr: "الغربية" },
  { cityEn: "Port Said", cityAr: "بورسعيد", regionEn: "Port Said Governorate", regionAr: "محافظة بورسعيد" },
  { cityEn: "Ismailia", cityAr: "الإسماعيلية", regionEn: "Ismailia Governorate", regionAr: "محافظة الإسماعيلية" },
  { cityEn: "Suez", cityAr: "السويس", regionEn: "Suez Governorate", regionAr: "محافظة السويس" },
  { cityEn: "Zagazig", cityAr: "الزقازيق", regionEn: "Sharkia", regionAr: "الشرقية" },
  { cityEn: "Assiut", cityAr: "أسيوط", regionEn: "Upper Egypt", regionAr: "صعيد مصر" },
  { cityEn: "Aswan", cityAr: "أسوان", regionEn: "Upper Egypt", regionAr: "صعيد مصر" },
  { cityEn: "Luxor", cityAr: "الأقصر", regionEn: "Upper Egypt", regionAr: "صعيد مصر" },
  { cityEn: "Hurghada", cityAr: "الغردقة", regionEn: "Red Sea", regionAr: "البحر الأحمر" },
  { cityEn: "Sharm El Sheikh", cityAr: "شرم الشيخ", regionEn: "South Sinai", regionAr: "جنوب سيناء" },
];

export interface BorderSideConfig {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
  width: number;
}
