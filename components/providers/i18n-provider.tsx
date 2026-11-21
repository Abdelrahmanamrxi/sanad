"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { Language, getDirection } from "@/lib/i18n/settings";
import i18n from "@/lib/i18n/client"
interface I18nProviderProps {
  children: React.ReactNode;
  initialLanguage: Language;
}

export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  // Sync i18n instance and DOM attributes when language changes or mounts
  if (i18n.language !== initialLanguage) {
    i18n.changeLanguage(initialLanguage);
  }

  useEffect(() => {
    document.documentElement.lang = initialLanguage;
    document.documentElement.dir = getDirection(initialLanguage);
  }, [initialLanguage]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}