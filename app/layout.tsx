import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "Sanad Platform",
    template: "%s | Sanad Platform",
  },
  description: "AI conversational support for Egyptian & MENA enterprises",
  icons: {
    icon: "/sanad_logo.png",
    apple: "/sanad_logo.png",
  },
};

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-latin",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

import { cookies } from "next/headers";
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE, Language, getDirection } from "@/lib/i18n/settings";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const rawLang = cookieStore.get(LANGUAGE_COOKIE)?.value;
  const lang: Language = rawLang === "ar" || rawLang === "en" ? rawLang : DEFAULT_LANGUAGE;
  const dir = getDirection(lang);

  return (
    <html
      lang={lang}
      dir={dir}
      data-scroll-behavior="smooth"
      className={`scroll-smooth ${plexSans.variable} ${plexArabic.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
