"use client";

import React, { useTransition } from "react";
import { useTranslation } from "react-i18next";
import { Languages, Loader2 } from "lucide-react";
import { LANGUAGE_COOKIE } from "@/lib/i18n/settings";
import { updateAccountLanguage } from "@/features/dashboard/account/actions";

export default function LanguageToggle({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const isArabic = i18n.language === "ar";

  const handleToggle = () => {
    const nextLang = isArabic ? "en" : "ar";

    // 1. Immediate client update
    i18n.changeLanguage(nextLang);
    if (typeof window !== "undefined") {
      document.cookie = `${LANGUAGE_COOKIE}=${nextLang}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.setAttribute("dir", nextLang === "ar" ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", nextLang);
    }

    // 2. Persist to DB in the background
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("appLanguage", nextLang);
        await updateAccountLanguage({ success: false }, formData);
      } catch (err) {
        console.error("Failed to persist workspace language:", err);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground border border-border bg-card/60 hover:bg-card transition-colors cursor-pointer rounded-none disabled:opacity-60 ${className || ""}`}
      title={isArabic ? "Switch to English" : "التبديل إلى العربية"}
      aria-label="Toggle language"
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin text-primary" />
      ) : (
        <Languages className="size-3.5 text-primary" />
      )}
      <span className="font-mono text-[11px]">{isArabic ? "English" : "العربية"}</span>
    </button>
  );
}
