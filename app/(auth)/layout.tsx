import { cookies } from "next/headers";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, Language } from "@/lib/i18n/settings";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get(LANGUAGE_COOKIE)?.value;
  const lang: Language = rawLang === "ar" || rawLang === "en" ? rawLang : DEFAULT_LANGUAGE;

  return <I18nProvider initialLanguage={lang}>{children}</I18nProvider>;
}
