import type { WidgetConfig, PlatformGuide } from "./types";

export interface StyleArchetype {
  id: string;
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  badge: string;
  badgeType?: "free" | "starter" | "pro";
  isDefault?: boolean;
  requiresTier?: "starter" | "pro";
  previewColors: {
    primary: string;
    bg: string;
    accent: string;
  };
  config: Partial<WidgetConfig>;
}

export const DESIGN_ARCHETYPES: StyleArchetype[] = [
  {
    id: "egyptian-concierge",
    name: "Egyptian Concierge",
    nameAr: "الكونسيرج المصري الأندلسي",
    tagline: "Arched dome, Nile emerald, warm linen, conversational concierge",
    taglineAr: "قبة أندلسية، أخضر نيلي، كتان دافئ، ترحيب بالعامية",
    badge: "DEFAULT",
    badgeType: "free",
    isDefault: true,
    previewColors: {
      primary: "#0E4741",
      bg: "#FAF6EE",
      accent: "#E2D9C8",
    },
    config: {
      containerShape: "arch",
      headerLayout: "hero",
      avatarMode: "monogram",
      avatarMonogram: "س",
      borderStyle: "hairline",
      citationStyle: "document-snippet",
      primaryColor: "#0E4741",
      secondaryColor: "#E2D9C8",
      backgroundColor: "#FAF6EE",
      cornerRadius: 24,
      borderRadius: 1,
      launcherText: "تحت أمرك، اسألني",
      launcherStyle: "badge",
    },
  },
  {
    id: "velvet-salon",
    name: "Velvet Salon",
    nameAr: "صالون لمسة ورقي",
    tagline: "Pill curves, delicate gold hairline, deep plum & warm blush",
    taglineAr: "منحنيات بيضاوية ناعمة، إطار ذهبي رقيق، درجات التوت والوردي",
    badge: "BOUTIQUE",
    badgeType: "free",
    previewColors: {
      primary: "#883E4C",
      bg: "#FFFBF5",
      accent: "#E5D5B8",
    },
    config: {
      containerShape: "pill",
      headerLayout: "docked",
      avatarMode: "monogram",
      avatarMonogram: "ل",
      borderStyle: "accent-gold",
      citationStyle: "compact",
      primaryColor: "#883E4C",
      secondaryColor: "#FCEEE6",
      backgroundColor: "#FFFBF5",
      cornerRadius: 28,
      borderRadius: 1,
      launcherText: "احجزي ميعادك",
      launcherStyle: "badge",
    },
  },
  {
    id: "tech-monolith",
    name: "Tech Monolith",
    nameAr: "تك زون العصري",
    tagline: "Zero radius, dark header, electric blue accents, instant proof",
    taglineAr: "حواف حادة صفرية، هيدر أسود تقني، أزرق كهربائي سريع",
    badge: "TECH",
    badgeType: "free",
    previewColors: {
      primary: "#2563EB",
      bg: "#FFFFFF",
      accent: "#0A0E17",
    },
    config: {
      containerShape: "square",
      headerLayout: "docked",
      avatarMode: "monogram",
      avatarMonogram: "TZ",
      borderStyle: "hairline",
      citationStyle: "compact",
      primaryColor: "#2563EB",
      secondaryColor: "#DBEAFE",
      backgroundColor: "#FFFFFF",
      cornerRadius: 0,
      borderRadius: 1,
      launcherText: "Technical Support",
      launcherStyle: "badge",
    },
  },
  {
    id: "editorial-brutalist",
    name: "Editorial Brutalist",
    nameAr: "مطعم الأصيل التراثي",
    tagline: "Hard 2px ink stroke, retro terracotta, bold paper shadow",
    taglineAr: "إطار كرتوني عريض ٢ بكسل، أحمر قرميدي، ظل مطبوع",
    badge: "EDITORIAL",
    badgeType: "free",
    previewColors: {
      primary: "#B83A24",
      bg: "#FDFBF7",
      accent: "#1E1E1E",
    },
    config: {
      containerShape: "square",
      headerLayout: "docked",
      avatarMode: "monogram",
      avatarMonogram: "أ",
      borderStyle: "hard-brutalist",
      citationStyle: "compact",
      primaryColor: "#B83A24",
      secondaryColor: "#F5E8D3",
      backgroundColor: "#FDFBF7",
      cornerRadius: 0,
      borderRadius: 2,
      launcherText: "اطلب أونلاين",
      launcherStyle: "badge",
    },
  },
];

export const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  botName: "عيادة النور",
  subtitle: "بترد في ثواني",
  primaryColor: "#0E4741",
  secondaryColor: "#E2D9C8",
  backgroundColor: "#FAF6EE",
  borderRadius: 1,
  cornerRadius: 24,
  position: "bottom-right",
  launcherStyle: "badge",
  launcherText: "تحت أمرك، اسألني",
  isActive: true,
  defaultLanguage: "ar",
  containerShape: "arch",
  headerLayout: "hero",
  avatarMode: "monogram",
  avatarMonogram: "س",
  borderStyle: "hairline",
  citationStyle: "document-snippet",
  welcomeMessage: "اسألني بالعامية، وأنا برد عليك من ملفات العيادة نفسها.",
  starterQuestions: [
    "الكشف بكام ومواعيد العيادة إيه؟",
    "عايزة أحجز استشارة قريبة",
    "هل في متابعة مجانية بعد الكشف؟",
    "طرق الدفع والتقسيط المتاحة؟",
  ],
  allowedDomains: [],
};

export interface ColorPreset {
  name: string;
  hex: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: "Sanad Teal", hex: "#0F5C55" },
  { name: "Royal Navy", hex: "#1E3A8A" },
  { name: "Forest Emerald", hex: "#166534" },
  { name: "Desert Amber", hex: "#D97706" },
  { name: "Charcoal Slate", hex: "#10201F" },
  { name: "Deep Violet", hex: "#581C87" },
];

export const PLATFORM_GUIDES: PlatformGuide[] = [
  {
    id: "salla",
    name: "Salla",
    tagline: "MENA E-Commerce Platform",
    steps: [
      "Log in to your Salla merchant control panel.",
      "Navigate to Store Settings > Store Options > Custom Code.",
      "Paste the Sanad embed snippet into the Header Scripts field and click Save.",
    ],
  },
  {
    id: "shopify",
    name: "Shopify",
    tagline: "Online Store & Themes",
    steps: [
      "Log in to Shopify Admin and navigate to Online Store > Themes.",
      "Click the (...) button next to your active theme and choose Edit Code.",
      "Open theme.liquid and paste the script directly above the closing </body> tag.",
    ],
  },
  {
    id: "wordpress",
    name: "WordPress ",
    tagline: "Open Source Storefront",
    steps: [
      "Log in to your WordPress admin dashboard (WP Admin).",
      "Use WPCode, Insert Headers and Footers, or your theme's custom JavaScript settings.",
      "Paste the snippet into the Footer Scripts box and click Save Changes.",
    ],
  },
];
