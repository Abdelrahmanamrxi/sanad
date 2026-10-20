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
  position: WidgetPosition;
  launcherStyle: LauncherStyle;
  launcherText: string;
  defaultLanguage: WidgetLanguage;
  welcomeMessage: string;
  starterQuestions: string[];
}

export interface PlatformGuide {
  id: "salla" | "shopify" | "wordpress";
  name: string;
  tagline: string;
  steps: string[];
}
