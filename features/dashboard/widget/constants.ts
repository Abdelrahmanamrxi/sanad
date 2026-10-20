import type { WidgetConfig, PlatformGuide } from "./types";

export const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  botName: "Sanad AI Support",
  subtitle: "Online • Instant verified answers",
  primaryColor: "#0F5C55",
  secondaryColor: "#D3E6E2",
  backgroundColor: "#FFFFFF",
  borderRadius: 0,
  cornerRadius: 0,
  position: "bottom-right",
  launcherStyle: "badge",
  launcherText: "Chat with us",
  isActive: true,
  defaultLanguage: "auto",
  welcomeMessage:
    "Hello! I am Sanad, your AI assistant. I can help answer questions regarding our products, shipping timelines, and return policies using our verified store documentation. How can I assist you today?",
  starterQuestions: [
    "What is your return and exchange policy?",
    "How long does delivery take and what does it cost?",
    "How can I track my existing order status?",
    "What payment methods and installment options are available?",
  ],
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
