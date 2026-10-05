"use client";

import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { onboardingSchema, OnboardingType } from "../schema";
import { motion, AnimatePresence } from "motion/react";
import { createBusiness } from "../actions";
import {
  Building2,
  MapPin,
  Palette,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  Loader,
  AlertCircle,
  Languages,
  Eye,
  SlidersHorizontal,
  Sun,
  Moon,
  MessageSquare,
} from "lucide-react";
import { SectorCard } from "./SectorCard";
import { ChatStylingControls } from "./ChatStylingControls";
import { LiveStudioChatPreview } from "./LiveStudioChatPreview";
import { BUSINESS_SECTORS, EGYPT_CITIES, STEP_FIELDS } from "../constants";
import { BusinessType, ColorPreset } from "../types";
import { cn } from "@/lib/utils";
import logo from "@/public/sanad_logo.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError } from "@/components/ui/field";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    id: 1,
    key: "identity",
    labelEn: "Identity",
    labelAr: "الهوية",
    icon: Languages,
  },
  {
    id: 2,
    key: "sector",
    labelEn: "Sector",
    labelAr: "النشاط",
    icon: Building2,
  },
  {
    id: 3,
    key: "location",
    labelEn: "Location",
    labelAr: "الموقع",
    icon: MapPin,
  },
  {
    id: 4,
    key: "styling",
    labelEn: "Chat Styling",
    labelAr: "تصميم المحادثة",
    icon: Palette,
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
  const [serverError, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

  const router = useRouter();

  // Track and toggle global app dark mode
  const isDark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerSnapshot,
  );
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  // Form Validation
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
      secondaryColor: "#E8A33D",
      chatBgColor: "#FFFFFF",
      borderRadius: 0,
    },
    mode: "onTouched",
  });

  const formValues = watch();

  const handleNext = async () => {
    setError("");
    setSuccess("");
    const fieldsToValidate = STEP_FIELDS[currentStep];
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid && currentStep < STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleStepClick = async (targetStep: number) => {
    if (targetStep === currentStep) return;
    setError("");
    setSuccess("");

    // Moving backward is always allowed
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      return;
    }

    // Moving forward: sequentially validate prior steps
    for (let s = currentStep; s < targetStep; s++) {
      const fieldsToValidate = STEP_FIELDS[s];
      const isStepValid = await trigger(fieldsToValidate);
      if (!isStepValid) {
        setCurrentStep(s);
        return;
      }
    }

    setCurrentStep(targetStep);
  };

  const handleBack = () => {
    setError("");
    setSuccess("");
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleLaunch = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    const fieldsToValidate = STEP_FIELDS[4];
    const isStepValid = await trigger(fieldsToValidate);
    if (!isStepValid) return;

    setIsSaving(true);
    try {
      const result = await createBusiness(formValues);

      if (!result.success) {
        setError(result.error || "Failed to create business. Please check your data and try again.");
        return;
      }

      setSuccess("Business workspace initialized successfully! Redirecting to dashboard...");
      setTimeout(() => {
        router.replace("/dashboard");
      }, 1000);
    } catch (err: unknown) {
      console.error("Onboarding submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while saving your workspace. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col transition-colors duration-200">
      {/* Top Global Bar */}
      <header className="h-14 border-b border-border bg-card/70 dark:bg-card/50 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={logo}
              alt="Sanad Logo"
              width={26}
              height={26}
              className="rounded-none object-contain"
              priority
            />
            <span className="font-heading font-bold text-base tracking-tight text-foreground">
              SANAD
            </span>
          </Link>
          <span className="text-border">|</span>
          <span className="text-xs font-mono tracking-wider uppercase text-muted-foreground hidden sm:inline-block">
            BUSINESS CHAT STUDIO SETUP // EGYPT
          </span>
        </div>

        {/* Center / Right controls: Dark Mode Toggle + Mobile Switcher + Step indicator */}
        <div className="flex items-center gap-3">
          {/* App Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="size-8 border border-border bg-card hover:bg-muted text-foreground flex items-center justify-center transition-colors rounded-none cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="size-4 text-highlight" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>

          {/* Mobile View Toggle (Setup Form vs Live Chat Preview) */}
          <div className="flex lg:hidden items-center border border-border bg-background p-0.5 rounded-none">
            <button
              type="button"
              onClick={() => setMobileTab("form")}
              className={cn(
                "px-2.5 py-1 text-xs font-mono uppercase flex items-center gap-1 transition-colors rounded-none",
                mobileTab === "form"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <SlidersHorizontal className="size-3" />
              <span>SETUP</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={cn(
                "px-2.5 py-1 text-xs font-mono uppercase flex items-center gap-1 transition-colors rounded-none",
                mobileTab === "preview"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <MessageSquare className="size-3" />
              <span>CHAT</span>
            </button>
          </div>

          {/* Desktop Step Counter */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="text-primary font-bold">0{currentStep}</span>
            <span>/</span>
            <span>0{STEPS.length}</span>
          </div>
        </div>
      </header>

      {/* Main Split Screen Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* ========================================================= */}
        {/* LEFT COLUMN: The Interactive Setup Form */}
        {/* ========================================================= */}
        <div
          className={cn(
            "col-span-12 lg:col-span-6 xl:col-span-6 flex flex-col justify-between p-5 sm:p-8 lg:p-10 border-e border-border overflow-y-auto",
            mobileTab === "preview" && "hidden lg:flex",
          )}
        >
          <div className="space-y-6 max-w-xl mx-auto w-full">
            {/* Step Navigation Pill Indicator */}
            <div className="grid grid-cols-4 gap-2">
              {STEPS.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepClick(step.id)}
                    className={cn(
                      "py-2 px-2.5 border text-start flex flex-col gap-0.5 transition-all rounded-none cursor-pointer",
                      isActive
                        ? "border-primary bg-primary/[0.08] shadow-[inset_0_0_0_1px_var(--primary)]"
                        : isCompleted
                          ? "border-primary/40 bg-card hover:border-primary/60"
                          : "border-border bg-card/40 opacity-60 hover:opacity-100",
                    )}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span
                        className={
                          isActive
                            ? "text-primary font-bold"
                            : "text-muted-foreground"
                        }
                      >
                        0{step.id}
                      </span>
                      {isCompleted && (
                        <Check className="size-2.5 text-primary stroke-[3]" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium truncate",
                        isActive
                          ? "text-foreground font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      {step.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Step Header */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="size-1.5 bg-primary block" />
                <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground">
                  STEP 0{currentStep} /{" "}
                  {STEPS[currentStep - 1].labelEn.toUpperCase()}
                </span>
              </div>

              {currentStep === 1 && (
                <div>
                  <h1 className="font-heading font-bold text-2xl text-foreground">
                    Business Nomenclature
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your trade name in English and Arabic. Your Egyptian
                    customers will see these names in your chat header.
                  </p>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h1 className="font-heading font-bold text-2xl text-foreground">
                    Business Sector & Domain
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Select your industry. This tailors the chat inquiry
                    categories and customer service details.
                  </p>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h1 className="font-heading font-bold text-2xl text-foreground">
                    Egypt Branch & Operations
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Set your operating city in Egypt for delivery zones, clinic
                    branches, or store locations.
                  </p>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h1 className="font-heading font-bold text-2xl text-foreground">
                    Chat Styling, Canvas & Roundness
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Customize brand colors, container background, and border
                    roundness. Watch the live chat preview respond in real-time.
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Step Content */}
            <div className="py-2">
              <AnimatePresence mode="wait">
                {/* STEP 1: Bilingual Business Name */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    <div className="border border-border bg-card p-4 space-y-2 rounded-none">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase font-mono tracking-wider text-foreground">
                          English Trade Name
                        </label>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          LTR FORMAT
                        </span>
                      </div>
                      <input
                        type="text"
                        {...register("businessNameEn")}
                        placeholder="e.g. Lumiere Studio"
                        aria-invalid={!!errors.businessNameEn}
                        className={cn(
                          "w-full bg-background border h-11 px-3.5 text-sm text-foreground focus:outline-none rounded-none transition-colors",
                          errors.businessNameEn
                            ? "border-destructive focus:border-destructive"
                            : "border-border focus:border-primary",
                        )}
                      />
                      {errors.businessNameEn?.message && (
                        <FieldError className="text-xs">
                          {errors.businessNameEn.message}
                        </FieldError>
                      )}
                    </div>

                    <div className="border border-border bg-card p-4 space-y-2 rounded-none">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase font-mono tracking-wider text-foreground">
                          الاسم التجاري بالعربية
                        </label>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          RTL FORMAT
                        </span>
                      </div>
                      <input
                        type="text"
                        dir="rtl"
                        {...register("businessNameAr")}
                        placeholder="مثال: استوديو لوميير"
                        aria-invalid={!!errors.businessNameAr}
                        className={cn(
                          "w-full bg-background border h-11 px-3.5 text-base font-sans text-foreground focus:outline-none rounded-none text-end transition-colors",
                          errors.businessNameAr
                            ? "border-destructive focus:border-destructive"
                            : "border-border focus:border-primary",
                        )}
                      />
                      {errors.businessNameAr?.message && (
                        <FieldError className="text-xs text-end">
                          {errors.businessNameAr.message}
                        </FieldError>
                      )}
                    </div>
                    <div className="p-3 border border-border/70 bg-muted/20 flex items-center justify-between text-xs font-mono text-muted-foreground">
                      <span>Live Chat Portal Link:</span>
                      <span className="text-foreground font-semibold">
                        chat.sanad.app/
                        {formValues.businessNameEn
                          ? formValues.businessNameEn
                              .toLowerCase()
                              .replace(/[^a-z0-9]/g, "-")
                          : "my-brand"}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Business Type / Sector */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-3"
                  >
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

                {/* STEP 3: Egypt Location & Hub */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4"
                  >
                    {/* Country Badge (Fixed to Egypt) */}
                    <div className="border border-border bg-card p-3.5 flex items-center justify-between rounded-none">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                          Operational Territory
                        </span>
                        <div className="font-heading font-semibold text-sm text-foreground flex items-center gap-2 mt-0.5">
                          <span>Egypt (جمهورية مصر العربية)</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-primary/10 text-primary border border-primary/20">
                        EGP // ج.م
                      </span>
                    </div>

                    {/* Egyptian City Selector */}
                    <div className="border border-border bg-card p-4 space-y-2 rounded-none">
                      <label className="text-xs font-semibold uppercase font-mono tracking-wider text-foreground">
                        Select City / Governorate (المدينة / المحافظة)
                      </label>
                      <select
                        {...register("city")}
                        aria-invalid={!!errors.city}
                        className={cn(
                          "w-full bg-background border h-11 px-3 text-sm text-foreground focus:outline-none rounded-none cursor-pointer transition-colors",
                          errors.city
                            ? "border-destructive focus:border-destructive"
                            : "border-border focus:border-primary",
                        )}
                      >
                        {EGYPT_CITIES.map((c) => (
                          <option key={c.cityEn} value={c.cityEn}>
                            {c.cityEn} — {c.cityAr} ({c.regionEn})
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
                    <div className="border border-border bg-card p-4 space-y-2 rounded-none">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase font-mono tracking-wider text-foreground">
                          District / Neighborhood (المنطقة / الحي)
                        </label>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          OPTIONAL
                        </span>
                      </div>
                      <input
                        type="text"
                        {...register("district")}
                        aria-invalid={!!errors.district}
                        placeholder="e.g. Zamalek, Maadi, New Cairo, Mohandessin..."
                        className={cn(
                          "w-full bg-background border h-11 px-3 text-sm text-foreground focus:outline-none rounded-none transition-colors",
                          errors.district
                            ? "border-destructive focus:border-destructive"
                            : "border-border focus:border-primary",
                        )}
                      />
                      {errors.district?.message && (
                        <FieldError className="text-xs">
                          {errors.district.message}
                        </FieldError>
                      )}
                    </div>

                    {/* Quick Egyptian Hub Chips */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-mono text-muted-foreground uppercase">
                        Quick Egyptian Hubs:
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
                                : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/30",
                            )}
                          >
                            {c.cityEn} / {c.cityAr}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Brand Palette, Background Color & Border Sides */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ChatStylingControls
                      primaryColor={formValues.primaryColor}
                      secondaryColor={formValues.secondaryColor}
                      chatBgColor={formValues.chatBgColor}
                      borderRadius={formValues.borderRadius}
                      onChangePrimary={(c) =>
                        setValue("primaryColor", c, { shouldValidate: true })
                      }
                      onChangeSecondary={(c) =>
                        setValue("secondaryColor", c, { shouldValidate: true })
                      }
                      onChangeChatBg={(c) =>
                        setValue("chatBgColor", c, { shouldValidate: true })
                      }
                      onChangeBorderRadius={(r) =>
                        setValue("borderRadius", r, { shouldValidate: true })
                      }
                      onApplyPreset={(p) => {
                        setValue("primaryColor", p.primary, {
                          shouldValidate: true,
                        });
                        setValue("secondaryColor", p.secondary, {
                          shouldValidate: true,
                        });
                      }}
                    />

                    {(errors.primaryColor ||
                      errors.secondaryColor ||
                      errors.chatBgColor ||
                      errors.borderRadius) && (
                      <div className="border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive space-y-1">
                        {errors.primaryColor?.message && (
                          <p>{errors.primaryColor.message}</p>
                        )}
                        {errors.secondaryColor?.message && (
                          <p>{errors.secondaryColor.message}</p>
                        )}
                        {errors.chatBgColor?.message && (
                          <p>{errors.chatBgColor.message}</p>
                        )}
                        {errors.borderRadius?.message && (
                          <p>{errors.borderRadius.message}</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-6 mt-8 border-t border-border flex items-center justify-between max-w-xl mx-auto w-full">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || isSaving}
              className={cn(
                "h-10 px-4 border border-border text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors rounded-none",
                currentStep === 1 || isSaving
                  ? "opacity-30 cursor-not-allowed"
                  : "bg-card text-foreground hover:bg-muted cursor-pointer",
              )}
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </button>

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={handleNext}
                className="h-10 px-6 bg-primary text-primary-foreground text-xs font-mono uppercase font-semibold tracking-wider flex items-center gap-2 hover:bg-primary/90 transition-colors rounded-none cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="size-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLaunch}
                disabled={isSaving}
                className={cn(
                  "h-10 px-6 bg-primary text-primary-foreground text-xs font-mono uppercase font-semibold tracking-wider flex items-center gap-2 hover:bg-primary/90 transition-colors rounded-none",
                  isSaving ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                )}
              >
                {isSaving ? (
                  <>
                    <Loader className="size-3.5 animate-spin" />
                    <span>Saving Studio...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    <span>Launch Chat Studio</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Real-Time Live Studio Chat Preview */}
        {/* ========================================================= */}
        <div
          className={cn(
            "col-span-12 lg:col-span-6 xl:col-span-6 bg-muted/20 dark:bg-card/20 flex flex-col justify-center min-h-[520px] lg:min-h-full",
            mobileTab === "form" && "hidden lg:flex",
          )}
        >
          <LiveStudioChatPreview
            businessNameEn={formValues.businessNameEn}
            businessNameAr={formValues.businessNameAr}
            businessType={formValues.businessType}
            city={formValues.city}
            district={formValues.district}
            primaryColor={formValues.primaryColor}
            secondaryColor={formValues.secondaryColor}
            chatBgColor={formValues.chatBgColor}
            borderRadius={formValues.borderRadius}
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* CENTERED MODAL OVERLAY: Loading Spinner & Error Display  */}
      {/* ========================================================= */}
      <AnimatePresence>
        {(isSaving || serverError || success) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => {
              if (e.target === e.currentTarget && !isSaving && !success) {
                setError("");
              }
            }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="border border-border bg-card p-6 sm:p-8 max-w-md w-full shadow-2xl rounded-none text-center space-y-5"
            >
              {/* 1. LOADING SPINNER IN THE MIDDLE */}
              {isSaving && (
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="size-14 border border-border bg-background flex items-center justify-center rounded-none shadow-xs">
                    <Loader className="size-7 animate-spin text-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-heading font-bold text-lg text-foreground tracking-tight">
                      Initializing Studio Workspace
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                      Saving your brand profile, Egyptian operations, and chat styling configurations...
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground uppercase tracking-widest pt-1">
                    <span className="size-1.5 bg-primary animate-pulse inline-block" />
                    <span>Configuring Database</span>
                  </div>
                </div>
              )}

              {/* 2. ERROR DISPLAY IN THE MIDDLE */}
              {!isSaving && serverError && (
                <div className="flex flex-col items-center gap-4">
                  <div className="size-14 border border-destructive/40 bg-destructive/10 flex items-center justify-center rounded-none text-destructive">
                    <AlertCircle className="size-7" />
                  </div>
                  <div className="space-y-2 w-full text-center">
                    <h3 className="font-heading font-bold text-lg text-foreground tracking-tight">
                      Workspace Creation Failed
                    </h3>
                    <div className="border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive text-start leading-relaxed break-words rounded-none font-sans">
                      {serverError}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 w-full pt-1">
                    <button
                      type="button"
                      onClick={() => setError("")}
                      className="flex-1 h-10 border border-border bg-background hover:bg-muted text-foreground text-xs font-mono uppercase tracking-wider transition-colors rounded-none cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLaunch()}
                      className="flex-1 h-10 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-mono uppercase font-semibold tracking-wider transition-colors rounded-none cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="size-3.5" />
                      <span>Try Again</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 3. SUCCESS IN THE MIDDLE */}
              {!isSaving && !serverError && success && (
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="size-14 border border-success/40 bg-success/10 flex items-center justify-center rounded-none text-success">
                    <Check className="size-7 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-heading font-bold text-lg text-foreground tracking-tight">
                      Workspace Ready!
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                      {success}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1 text-xs font-mono text-muted-foreground">
                    <Loader className="size-3.5 animate-spin text-primary" />
                    <span>Redirecting to dashboard...</span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
