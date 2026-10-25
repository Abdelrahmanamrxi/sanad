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
  status?: "online" | "offline";
  allowedDomains?: string[];
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
    status: row.status,
    allowedDomains: row.allowed_domains || [],
    welcomeMessage: row.welcome_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type WidgetSettingsUpdate = Partial<
  Omit<WidgetSettingsDBRow, "id" | "business_id" | "created_at">
>;

/**
 * Converts a frontend WidgetConfig (camelCase) to a database WidgetSettingsDBRow representation (snake_case).
 * Can be used for partial updates or full row inserts when combined with options (businessId, id).
 */
export function toWidgetSettingsDBRow(
  config: Partial<WidgetConfig>,
  options?: { businessId?: string; id?: string }
): WidgetSettingsUpdate & { business_id?: string; id?: string } {
  const update: WidgetSettingsUpdate & { business_id?: string; id?: string } = {};

  if (options?.id !== undefined) update.id = options.id;
  if (options?.businessId !== undefined) update.business_id = options.businessId;

  if (config.botName !== undefined) update.bot_name = config.botName;
  if (config.subtitle !== undefined) update.subtitle = config.subtitle;
  if (config.primaryColor !== undefined) update.primary_color = config.primaryColor;
  if (config.secondaryColor !== undefined) update.secondary_color = config.secondaryColor;
  if (config.backgroundColor !== undefined) update.background_color = config.backgroundColor;
  if (config.borderRadius !== undefined) update.border_radius = config.borderRadius;
  if (config.cornerRadius !== undefined) update.corner_radius = config.cornerRadius;
  if (config.position !== undefined) update.position = config.position;
  if (config.launcherStyle !== undefined) update.launcher_style = config.launcherStyle;
  if (config.launcherText !== undefined) update.launcher_text = config.launcherText;
  if (config.welcomeMessage !== undefined) update.welcome_message = config.welcomeMessage;
  if (config.starterQuestions !== undefined) update.starter_questions = config.starterQuestions;
  if (config.defaultLanguage !== undefined) update.default_language = config.defaultLanguage;
  if (config.isActive !== undefined) update.is_active = config.isActive;
  if (config.status !== undefined) update.status = config.status;
  if (config.allowedDomains !== undefined) update.allowed_domains = config.allowedDomains;

  return update;
}
