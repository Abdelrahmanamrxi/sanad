"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ar from "@/locales/ar.json";
import en from "@/locales/en.json";
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE } from "./settings";

export const resources = {
  ar: { common: ar },
  en: { common: en },
} as const;

if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      fallbackLng: DEFAULT_LANGUAGE,
      defaultNS: "common",
      interpolation: {
        escapeValue: false, // React already escapes values
      },
      detection: {
        order: ["cookie", "navigator"],
        lookupCookie: LANGUAGE_COOKIE,
        caches: ["cookie"],
      },
    });
}

export default i18next;
