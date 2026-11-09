"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader,
  AlertCircle,
  Languages,
  Sun,
  Moon,
  Check,
} from "lucide-react";

import { onboardingSchema, type OnboardingType } from "../schema";
import { createBusiness } from "../actions";
import { SectorCard } from "./sector-card";
import { BUSINESS_SECTORS, EGYPT_CITIES, STEP_FIELDS } from "../constants";
import { FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import logo from "@/public/sanad_logo.png";
import logoDark from "@/public/sanad_logo_dark.png";

const STEPS = [
  {
    id: 1,
    key: "identity",
    labelEn: "Identity",
    labelAr: "الهوية",
    descEn: "Name your business in English & Arabic",
    descAr: "اسم النشاط باللغتين",
    icon: Languages,
  },
  {
    id: 2,
    key: "sector",
    labelEn: "Industry",
    labelAr: "النشاط",
    descEn: "Choose your primary business domain",
    descAr: "حدد مجال العمل الأساسي",
    icon: Building2,
  },
  {
    id: 3,
    key: "location",
    labelEn: "Location",
    labelAr: "الموقع",
    descEn: "Select your city and primary branch",
    descAr: "المحافظة والفرع الرئيسي",
    icon: MapPin,
  },
];

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}
const getThemeSnapshot = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

export function LiveStudioOnboarding() {
  const [serverError, setServerError] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const router = useRouter();

  // Track and toggle theme
  const isDark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerSnapshot,
  );
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<OnboardingType>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      businessNameEn: "",
      businessNameAr: "",
      businessType: "clinic",
      city: EGYPT_CITIES[0]?.cityEn || "Cairo",
      district: "",
      primaryColor: "#0F5C55",
      secondaryColor: "#D3E6E2",
      chatBgColor: "#FFFFFF",
      botName: "AI Assistant",
      borderRadius: 0,
      cornerRadius: 0,
    },
    mode: "onTouched",
  });

  const formValues = watch();

  const handleNext = async () => {
    setServerError("");
    const fieldsToValidate = STEP_FIELDS[currentStep];
    if (fieldsToValidate) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setServerError("");
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: OnboardingType) => {
    // Strictly prevent submission unless on the final step (Step 3)
    if (currentStep < STEPS.length) {
      handleNext();
      return;
    }

    setServerError("");
    setIsSaving(true);
    try {
      const result = await createBusiness(data);
      if (!result.success) {
        setServerError(result.error || "Failed to create business workspace.");
        setIsSaving(false);
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while launching workspace.",
      );
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* ── Top Bar with Logo & Theme Toggle ── */}
      <header className="max-w-2xl mx-auto w-full flex items-center justify-between pb-6 border-b border-border">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image
            src={logo}
            alt="Sanad سند"
            height={32}
            className="h-8 w-auto object-contain rounded-none dark:hidden"
            priority
          />
          <Image
            src={logoDark}
            alt="Sanad سند"
            height={32}
            className="h-8 w-auto object-contain rounded-none hidden dark:block"
            priority
          />
          <span className="sr-only">Sanad سند</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground hidden sm:inline">
            Step {currentStep} of {STEPS.length}
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="size-9 border border-border bg-card hover:bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-none cursor-pointer"
            title="Toggle theme"
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
      </header>

      {/* ── Main Wizard Container ── */}
      <main className="max-w-2xl mx-auto w-full my-auto py-8">
        {/* Step Indicator Bar */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={cn(
                  "p-3 border transition-all rounded-none",
                  isCurrent
                    ? "border-primary bg-primary/10 text-foreground"
                    : isCompleted
                      ? "border-border bg-muted/30 text-muted-foreground"
                      : "border-border/60 bg-card/40 text-muted-foreground/60",
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon
                      className={cn(
                        "size-3.5",
                        isCurrent
                          ? "text-primary"
                          : isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground/60",
                      )}
                    />
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider">
                      0{step.id}
                    </span>
                  </div>
                  {isCompleted && <Check className="size-3 text-primary" />}
                </div>
                <div className="font-sans text-xs font-semibold truncate">
                  {step.labelEn}
                </div>
                <div className="text-[11px] text-muted-foreground truncate hidden sm:block">
                  {step.descEn}
                </div>
              </div>
            );
          })}
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-6 flex items-start gap-2.5 p-3 text-xs border border-destructive/40 bg-destructive/10 text-destructive rounded-none">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{serverError}</span>
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={(e) => {
            if (currentStep < STEPS.length) {
              e.preventDefault();
              handleNext();
            } else {
              handleSubmit(onSubmit)(e);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (currentStep < STEPS.length) {
                e.preventDefault();
                handleNext();
              }
            }
          }}
          noValidate
          className="border border-border bg-card p-6 sm:p-8 shadow-xs rounded-none"
        >
          <AnimatePresence mode="wait">
            {/* ── STEP 1: Business Identity ── */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-heading">
                    What is your business name?
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                    Enter your organization or storefront name in English and Arabic.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* English Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="businessNameEn"
                      className="block font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                    >
                      Business Name (English)
                    </label>
                    <input
                      id="businessNameEn"
                      type="text"
                      placeholder="e.g. Al-Noor Medical Center"
                      autoFocus
                      {...register("businessNameEn")}
                      className={cn(
                        "w-full border px-3 py-2.5 font-sans text-sm outline-none transition-all rounded-none bg-background text-foreground",
                        errors.businessNameEn
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary focus:ring-1 focus:ring-primary/30",
                      )}
                    />
                    {errors.businessNameEn?.message && (
                      <FieldError className="text-xs">
                        {errors.businessNameEn.message}
                      </FieldError>
                    )}
                  </div>

                  {/* Arabic Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="businessNameAr"
                      className="block font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                    >
                      اسم النشاط التجاري (بالعربية)
                    </label>
                    <input
                      id="businessNameAr"
                      type="text"
                      dir="rtl"
                      placeholder="مثال: مركز النور الطبي التخصصي"
                      {...register("businessNameAr")}
                      className={cn(
                        "w-full border px-3 py-2.5 font-sans text-sm outline-none transition-all rounded-none bg-background text-foreground text-end",
                        errors.businessNameAr
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary focus:ring-1 focus:ring-primary/30",
                      )}
                    />
                    {errors.businessNameAr?.message && (
                      <FieldError className="text-xs">
                        {errors.businessNameAr.message}
                      </FieldError>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Business Sector ── */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-heading">
                    What industry best describes your business?
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                    Sanad tailors customer conversation prompts and terminology to your domain.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BUSINESS_SECTORS.map((sector) => (
                    <SectorCard
                      key={sector.id}
                      sector={sector}
                      isSelected={formValues.businessType === sector.id}
                      onSelect={(id) =>
                        setValue("businessType", id, { shouldValidate: true })
                      }
                    />
                  ))}
                </div>
                {errors.businessType?.message && (
                  <FieldError className="text-xs">
                    {errors.businessType.message}
                  </FieldError>
                )}
              </motion.div>
            )}

            {/* ── STEP 3: Location ── */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-heading">
                    Where is your main branch or headquarters?
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                    Helps the AI handle branch inquiries, operating zones, and local delivery.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* City / Governorate Select */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="city"
                      className="block font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                    >
                      Governorate / City (Egypt)
                    </label>
                    <select
                      id="city"
                      {...register("city")}
                      className={cn(
                        "w-full border px-3 py-2.5 font-sans text-sm outline-none transition-all rounded-none bg-background text-foreground",
                        errors.city
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary focus:ring-1 focus:ring-primary/30",
                      )}
                    >
                      {EGYPT_CITIES.map((c) => (
                        <option key={c.cityEn} value={c.cityEn}>
                          {c.cityEn} — {c.cityAr}
                        </option>
                      ))}
                    </select>
                    {errors.city?.message && (
                      <FieldError className="text-xs">
                        {errors.city.message}
                      </FieldError>
                    )}
                  </div>

                  {/* District / Neighborhood Input */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="district"
                      className="block font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold"
                    >
                      District / Area (Optional)
                    </label>
                    <input
                      id="district"
                      type="text"
                      placeholder="e.g. New Cairo / التجمع الخامس"
                      {...register("district")}
                      className={cn(
                        "w-full border px-3 py-2.5 font-sans text-sm outline-none transition-all rounded-none bg-background text-foreground",
                        errors.district
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary focus:ring-1 focus:ring-primary/30",
                      )}
                    />
                    {errors.district?.message && (
                      <FieldError className="text-xs">
                        {errors.district.message}
                      </FieldError>
                    )}
                  </div>

                  {/* Quick Egyptian Hub Chips */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase">
                      Quick Hub Selection:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {EGYPT_CITIES.slice(0, 6).map((c) => (
                        <button
                          key={c.cityEn}
                          type="button"
                          onClick={() =>
                            setValue("city", c.cityEn, {
                              shouldValidate: true,
                            })
                          }
                          className={cn(
                            "text-xs px-2.5 py-1 border transition-colors rounded-none cursor-pointer",
                            formValues.city === c.cityEn
                              ? "border-primary bg-primary text-primary-foreground font-semibold"
                              : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30",
                          )}
                        >
                          {c.cityEn} / {c.cityAr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Wizard Controls Footer ── */}
          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSaving}
                className="h-10 px-4 border border-border bg-background hover:bg-muted/50 text-foreground text-xs font-mono uppercase font-semibold tracking-wider flex items-center gap-2 transition-colors rounded-none cursor-pointer disabled:opacity-50"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < STEPS.length ? (
              <button
                key="btn-next"
                type="button"
                onClick={handleNext}
                className="h-10 px-6 bg-primary text-primary-foreground text-xs font-mono uppercase font-semibold tracking-wider flex items-center gap-2 hover:bg-primary/90 transition-colors rounded-none cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="size-3.5" />
              </button>
            ) : (
              <button
                key="btn-submit"
                type="submit"
                disabled={isSaving}
                className={cn(
                  "h-10 px-6 bg-primary text-primary-foreground text-xs font-mono uppercase font-semibold tracking-wider flex items-center gap-2 hover:bg-primary/90 transition-colors rounded-none",
                  isSaving ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                )}
              >
                {isSaving ? (
                  <>
                    <Loader className="size-3.5 animate-spin" />
                    <span>Launching Workspace...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    <span>Launch Workspace</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </main>

      {/* ── Footer Notice ── */}
      <footer className="max-w-2xl mx-auto w-full text-center text-xs text-muted-foreground pt-4">
        <span>You can configure your AI chat widget anytime in </span>
        <strong className="text-foreground font-semibold">Dashboard → Widget Studio</strong>
      </footer>
    </div>
  );
}
