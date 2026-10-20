export type WidgetPosition = "bottom-right" | "bottom-left";
export type LauncherStyle = "icon" | "badge";
export type WidgetLanguage = "auto" | "ar" | "en";
export type DevicePreview = "desktop" | "mobile";
export type StoreTheme = "light" | "dark";
export type EditTab = "identity" | "appearance" | "messages" | "embed";

export interface WidgetConfig {
  botName: string;
  subtitle: string;
  primaryColor: string;
  secondaryColor?: string;
  backgroundColor?: string;
  position: WidgetPosition;
  launcherStyle: LauncherStyle;
  launcherText: string;
  borderRadius?: number;
  cornerRadius?: number;
  defaultLanguage: WidgetLanguage;
  welcomeMessage: string;
  starterQuestions: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlatformGuide {
  id: "salla" | "shopify" | "wordpress";
  name: string;
  tagline: string;
  steps: string[];
}

export interface WidgetSettingsDBRow {
  id: string;
  business_id: string;
  bot_name: string;
  subtitle: string;
  default_language: WidgetLanguage;
  status: "online" | "offline";
  primary_color: string;
  secondary_color?: string;
  background_color?: string;
  border_radius: number;
  corner_radius: number;
  position: WidgetPosition;
  launcher_style: LauncherStyle;
  launcher_text: string;
  welcome_message: string;
  starter_questions: Array<string>;
  is_active: boolean;
  allowed_domains?: string[];
  created_at: string;
  updated_at: string;
}

export function toWidgetConfig(row: WidgetSettingsDBRow): WidgetConfig {
  return {
    botName: row.bot_name,
    subtitle: row.subtitle,
    primaryColor: row.primary_color,
    secondaryColor: row.secondary_color,
    backgroundColor: row.background_color,
    position: row.position,
    launcherStyle: row.launcher_style,
    launcherText: row.launcher_text,
    starterQuestions: row.starter_questions || [],
    borderRadius: row.border_radius,
    cornerRadius: row.corner_radius,
    defaultLanguage: row.default_language,
    isActive: row.is_active,
    welcomeMessage: row.welcome_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
