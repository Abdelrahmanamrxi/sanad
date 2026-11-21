export const SUPPORTED_LANGUAGES = ["ar", "en"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGE_COOKIE = "sanad_locale";

export function getDirection(lang: Language): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}
