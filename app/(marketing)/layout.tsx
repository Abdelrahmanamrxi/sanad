import React from "react";
import MarketingNavbar from "@/components/shared/marketing-navbar";
import Footer from "@/components/shared/footer";
import { cookies } from "next/headers";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, Language } from "@/lib/i18n/settings";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get(LANGUAGE_COOKIE)?.value;
  const lang: Language = rawLang === "ar" || rawLang === "en" ? rawLang : DEFAULT_LANGUAGE;

  return (
    <I18nProvider initialLanguage={lang}>
      <div className="min-h-screen flex flex-col">
        <MarketingNavbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </I18nProvider>
  );
}
