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
} from "lucide-react";
import logo from "../../../public/sanad_logo.png";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  type?: "signup" | "signin";
}

export function AuthSplitLayout({
  children,
  type = "signup",
}: AuthSplitLayoutProps) {
  const rightPanelRef = useRef<HTMLDivElement>(null);

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
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Home</span>
          </Link>

          <div className="text-xs text-muted-foreground">
            {type === "signup" ? (
              <span>
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in
                </Link>
              </span>
            ) : (
              <span>
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign up
                </Link>
              </span>
            )}
          </div>
        </div>

        {/* Center: Clean Form Container */}
        <div className="relative z-10 w-full max-w-md mx-auto my-2 sm:my-auto py-1 sm:py-4">
          {children}

          {/* Mobile Product Value & Trust Highlights (Fills the mobile void with social proof) */}
          <div className="mt-5 lg:hidden border border-border/80 bg-card/70 p-3.5 space-y-2.5 backdrop-blur-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <div className="flex items-center gap-1.5 text-primary">
                <ShieldCheck className="size-4" />
                <span>Strictly Zero Hallucinations</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 border border-primary/20 font-mono">
                Sanad AI
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground pt-0.5">
              <div className="flex items-start gap-2">
                <Check className="size-3.5 text-success shrink-0 mt-0.5" />
                <span className="leading-tight">Answers strictly from your uploaded price lists, PDFs & files</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="size-3.5 text-success shrink-0 mt-0.5" />
                <span className="leading-tight">1-line script embed for any website or store</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="size-3.5 text-success shrink-0 mt-0.5" />
                <span className="leading-tight">&ldquo;Unanswered&rdquo; inbox: answer once, bot remembers forever</span>
              </div>
            </div>

            <div className="border-t border-border/60 pt-2 flex items-center justify-between text-[11px] text-muted-foreground italic">
              <span className="truncate pe-2">&ldquo;Answers our patients 24/7 without guessing.&rdquo;</span>
              <span className="font-semibold text-foreground not-italic shrink-0">Dokki Dental</span>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Legal Note */}
        <div className="relative z-10 mt-6 sm:mt-auto border-t border-border/60 pt-3 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-muted-foreground pb-2 sm:pb-0">
          <div className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>
              Answers strictly from your uploaded files • Zero Hallucination
            </span>
          </div>
          <div>
            <span>&copy; {new Date().getFullYear()} Sanad Technologies</span>
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
              className="h-9 xl:h-10 w-auto object-contain"
              priority
            />
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider border border-primary/20">
            <span className="size-2 bg-success animate-pulse shrink-0" />
            <span>Website AI Widget</span>
          </div>
        </div>

        {/* Center: Minimal Product Workflow & Killer Feature Card (Enlarged) */}
        <div className="relative z-10 my-auto flex flex-col gap-5 max-w-lg mx-auto w-full">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-snug">
              Your business files. An AI chatbot. Zero hallucinations.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tailored for clinics, restaurants, gyms, and shops in Egypt &amp; MENA.
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
                  1. Upload your documents
                </span>
                <p className="text-muted-foreground text-xs sm:text-sm pt-0.5">
                  Price lists, menus, or FAQs. The bot only answers from your files.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex size-8 items-center justify-center bg-primary/10 text-primary border border-primary/20 shrink-0 mt-0.5">
                <Code2 className="size-4.5" />
              </div>
              <div className="text-sm">
                <span className="font-bold text-foreground">
                  2. Embed with 1 line
                </span>
                <p className="text-muted-foreground text-xs sm:text-sm pt-0.5">
                  Paste a single script tag into your website or store.
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
                    3. The &ldquo;Unanswered&rdquo; Inbox
                  </span>
                  <span className="text-[10px] font-semibold bg-highlight/25 text-highlight-foreground px-1.5 py-0.5 uppercase tracking-wide">
                    Killer Feature
                  </span>
                </div>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                  If the bot doesn&apos;t know an answer, it lands in your inbox. You answer once, and the bot learns it permanently.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Testimonial / Real Usecase (Larger) */}
        <div className="relative z-10 border-t border-border/70 pt-4 flex items-center justify-between text-xs sm:text-sm">
          <p className="text-xs sm:text-sm text-muted-foreground italic truncate pe-3">
            &ldquo;Answers our patients 24/7 without guessing.&rdquo;
          </p>
          <span className="text-xs sm:text-sm font-semibold text-foreground shrink-0">
            Dokki Dental Clinic
          </span>
        </div>
      </div>
    </div>
  );
}
