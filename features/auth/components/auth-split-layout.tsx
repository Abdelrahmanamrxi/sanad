"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "motion/react";
import {
  ArrowLeft,
  ShieldCheck,
  Bot,
  Inbox,
  UploadCloud,
  Code2,
  Check,
  Languages,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGE_COOKIE } from "@/lib/i18n/settings";
import logo from "../../../public/sanad_logo.png";
import logoDark from "../../../public/sanad_logo_dark.png";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  type?: "signup" | "signin";
}

export function AuthSplitLayout({
  children,
  type = "signup",
}: AuthSplitLayoutProps) {
  const { t, i18n } = useTranslation();
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const isAr = i18n.language === "ar";

  const toggleLang = () => {
    const nextLocale = isAr ? "en" : "ar";
    i18n.changeLanguage(nextLocale);
    if (typeof window !== "undefined") {
      document.cookie = `${LANGUAGE_COOKIE}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.setAttribute("dir", nextLocale === "ar" ? "rtl" : "ltr");
      document.documentElement.setAttribute("lang", nextLocale);
    }
  };

  // Interactive mouse spotlight for the showcase panel
  const mouseX = useMotionValue(300);
  const mouseY = useMotionValue(250);
  const springX = useSpring(mouseX, { damping: 26, stiffness: 130 });
  const springY = useSpring(mouseY, { damping: 26, stiffness: 130 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rightPanelRef.current) return;
    const rect = rightPanelRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Teal & Amber spotlights matching Sanad design palette
  const lightGlowTeal = useMotionTemplate`radial-gradient(550px circle at ${springX}px ${springY}px, rgba(15, 92, 85, 0.12), transparent 75%)`;
  const darkGlowTeal = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(63, 179, 166, 0.15), transparent 75%)`;
  const lightGlowAmber = useMotionTemplate`radial-gradient(280px circle at ${springX}px ${springY}px, rgba(232, 163, 61, 0.08), transparent 70%)`;
  const darkGlowAmber = useMotionTemplate`radial-gradient(300px circle at ${springX}px ${springY}px, rgba(232, 163, 61, 0.06), transparent 70%)`;

  return (
    <div className="flex min-h-svh lg:h-svh lg:max-h-svh w-full flex-col lg:grid lg:grid-cols-12 bg-background">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: Clean Authentication Form */}
      <div className="relative col-span-12 lg:col-span-6 xl:col-span-6 flex flex-col justify-start lg:justify-between p-4 sm:p-6 lg:p-10 xl:p-12 order-1 min-h-svh lg:h-full overflow-y-auto">
        {/* Subtle Ambient Blueprint Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15] dark:opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Top Navigation Bar: Back Link & Switch Auth Mode */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
            <span>{t("auth.layout.home")}</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground border border-border bg-card hover:bg-muted/40 transition-colors cursor-pointer rounded-none"
              title={isAr ? "Switch to English" : "التبديل إلى العربية"}
            >
              <Languages className="size-3 text-primary" />
              <span>{isAr ? "English" : "العربية"}</span>
            </button>

            <div className="text-xs text-muted-foreground">
              {type === "signup" ? (
                <span>
                  {t("auth.layout.alreadyHaveAccount")}{" "}
                  <Link
                    href="/signin"
                    className="font-semibold text-primary hover:underline"
                  >
                    {t("auth.layout.signIn")}
                  </Link>
                </span>
              ) : (
                <span>
                  {t("auth.layout.dontHaveAccount")}{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-primary hover:underline"
                  >
                    {t("auth.layout.signUp")}
                  </Link>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Clean Form Container */}
        <div className="relative z-10 w-full max-w-md mx-auto my-2 sm:my-auto py-1 sm:py-4">
          {children}

          {/* Mobile Product Value & Trust Highlights (Fills the mobile void with social proof) */}
          <div className="mt-5 lg:hidden border border-border/80 bg-card/70 p-3.5 space-y-2.5 backdrop-blur-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <div className="flex items-center gap-1.5 text-primary">
                <ShieldCheck className="size-4 shrink-0" />
                <span>{t("auth.layout.mobileTitle")}</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 border border-primary/20 font-mono">
                {t("auth.layout.mobilePill")}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground pt-0.5 text-start">
              <div className="flex items-start gap-2">
                <Check className="size-3.5 text-success shrink-0 mt-0.5" />
                <span className="leading-tight">
                  {t("auth.layout.mobilePoint1")}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="size-3.5 text-success shrink-0 mt-0.5" />
                <span className="leading-tight">
                  {t("auth.layout.mobilePoint2")}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="size-3.5 text-success shrink-0 mt-0.5" />
                <span className="leading-tight">
                  {t("auth.layout.mobilePoint3")}
                </span>
              </div>
            </div>

            <div className="border-t border-border/60 pt-2 flex items-center justify-between text-[11px] text-muted-foreground italic">
              <span className="truncate pe-2">
                {t("auth.layout.mobileQuote")}
              </span>
              <span className="font-semibold text-foreground not-italic shrink-0">
                {t("auth.layout.mobileAuthor")}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Legal Note */}
        <div className="relative z-10 mt-6 sm:mt-auto border-t border-border/60 pt-3 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-muted-foreground pb-2 sm:pb-0">
          <div className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>{t("auth.layout.tagline")}</span>
          </div>
          <div>
            <span>{t("auth.layout.copyright", { year: new Date().getFullYear() })}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: Minimal Product Showcase (ENLARGED SECTION)                 */}
      {/* ========================================================================= */}
      <div
        ref={rightPanelRef}
        onMouseMove={handleMouseMove}
        className="relative hidden lg:col-span-6 xl:col-span-6 lg:flex flex-col justify-between overflow-hidden border-s border-border/80 bg-card/60 dark:bg-card/40 p-10 xl:p-14 select-none order-2 h-full"
      >
        {/* Dynamic Interactive Mouse Glow Spotlights */}
        <motion.div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 dark:hidden"
          style={{ background: lightGlowTeal }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 dark:hidden"
          style={{ background: lightGlowAmber }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 hidden dark:block"
          style={{ background: darkGlowTeal }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 hidden dark:block"
          style={{ background: darkGlowAmber }}
        />

        {/* Blueprint Architectural Grid Background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.20]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top Header: Brand Logo & Badge (Larger) */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-block transition-transform hover:scale-[1.02]"
          >
            <Image
              src={logo}
              alt="Sanad سند"
              height={42}
              className="h-9 xl:h-10 w-auto object-contain dark:hidden"
              priority
            />
            <Image
              src={logoDark}
              alt="Sanad سند"
              height={42}
              className="h-9 xl:h-10 w-auto object-contain hidden dark:block"
              priority
            />
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider border border-primary/20">
            <span className="size-2 bg-success animate-pulse shrink-0" />
            <span>{t("auth.layout.widgetBadge")}</span>
          </div>
        </div>

        {/* Center: Contextual Showcase based on Sign In vs Sign Up */}
        {type === "signin" ? (
          <div className="relative z-10 my-auto flex flex-col gap-5 max-w-lg mx-auto w-full text-start">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug font-heading">
                {t("auth.layout.signinHeading")}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("auth.layout.signinSubheading")}
              </p>
            </div>

            {/* Studio Health & Live Dialogue Showcase Card */}
            <div className="border border-border/90 bg-card/85 p-5 backdrop-blur-md space-y-4 rounded-none">
              {/* Top Operational Status Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="size-2 bg-success animate-pulse inline-block" />
                  <span className="text-xs font-medium uppercase tracking-wider text-foreground">
                    {t("auth.layout.assistantStatus")}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t("auth.layout.statusOnline")}
                </span>
              </div>

              {/* 2 Metric Tiles */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 border border-border bg-background/60 rounded-none space-y-1">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t("auth.layout.metricAccuracyTitle")}
                  </div>
                  <div className="text-xl font-bold text-highlight">
                    {t("auth.layout.metricAccuracyValue")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("auth.layout.metricAccuracySub")}
                  </div>
                </div>

                <div className="p-3 border border-border bg-background/60 rounded-none space-y-1">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {t("auth.layout.metricSpeedTitle")}
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {t("auth.layout.metricSpeedValue")}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("auth.layout.metricSpeedSub")}
                  </div>
                </div>
              </div>

              {/* Live Egyptian Dialogue Simulation Box */}
              <div className="p-3.5 border border-border/80 bg-background/80 space-y-2 rounded-none">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t("auth.layout.sampleTitle")}</span>
                  <span className="text-primary font-medium">
                    {t("auth.layout.sampleBadge")}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* User query */}
                  <div className="bg-muted/40 p-2.5 border border-border/60 text-foreground text-start">
                    <p className="font-sans leading-relaxed">
                      {t("auth.layout.sampleQuestion")}
                    </p>
                  </div>

                  {/* AI Response */}
                  <div className="bg-primary/10 border border-primary/25 p-2.5 text-foreground text-start space-y-1.5">
                    <p className="font-sans leading-relaxed">
                      {t("auth.layout.sampleAnswer")}
                    </p>
                    <span className="text-[11px] text-primary block tracking-wide font-medium" dir="ltr">
                      {t("auth.layout.sampleSource")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 my-auto flex flex-col gap-5 max-w-lg mx-auto w-full text-start">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug font-heading">
                {t("auth.layout.signupHeading")}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("auth.layout.signupSubheading")}
              </p>
            </div>

            {/* Minimal 3-Step Flow (Enlarged Cards) */}
            <div className="border border-border/90 bg-card/85 p-5 backdrop-blur-md space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="flex size-8 items-center justify-center bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
                  <UploadCloud className="size-4.5" />
                </div>
                <div className="text-sm">
                  <span className="font-bold text-foreground">
                    {t("auth.layout.step1Title")}
                  </span>
                  <p className="text-muted-foreground text-xs sm:text-sm pt-0.5">
                    {t("auth.layout.step1Desc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="flex size-8 items-center justify-center bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
                  <Code2 className="size-4.5" />
                </div>
                <div className="text-sm">
                  <span className="font-bold text-foreground">
                    {t("auth.layout.step2Title")}
                  </span>
                  <p className="text-muted-foreground text-xs sm:text-sm pt-0.5">
                    {t("auth.layout.step2Desc")}
                  </p>
                </div>
              </div>

              {/* Killer Feature Highlighted Step */}
              <div className="relative p-3.5 bg-highlight/10 border border-highlight/40 flex items-start gap-3.5">
                <div className="flex size-8 items-center justify-center bg-highlight text-highlight-foreground shrink-0 mt-0.5">
                  <Inbox className="size-4.5" />
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-foreground">
                      {t("auth.layout.step3Title")}
                    </span>
                    <span className="text-[10px] font-semibold bg-highlight/25 text-highlight-foreground px-1.5 py-0.5 uppercase tracking-wide">
                      {t("auth.layout.step3Badge")}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {t("auth.layout.step3Desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Testimonial / Real Usecase (Larger) */}
        <div className="relative z-10 border-t border-border/70 pt-4 flex items-center justify-between text-xs sm:text-sm">
          <p className="text-xs sm:text-sm text-muted-foreground italic truncate pe-3">
            {t("auth.layout.testimonialQuote")}
          </p>
          <span className="text-xs sm:text-sm font-semibold text-foreground shrink-0">
            {t("auth.layout.testimonialAuthor")}
          </span>
        </div>
      </div>
    </div>
  );
}
