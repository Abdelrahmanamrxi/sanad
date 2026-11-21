"use client";

import { cn } from "cn";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, Loader, Mail, ArrowLeft, EyeOff, Eye } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import logo from "../../../public/sanad_logo.png";
import logoDark from "../../../public/sanad_logo_dark.png";
import { User, userSchema } from "../schemas/auth";
import { signUp, verifyOtp, resendOTP } from "../actions";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const router = useRouter();

  // Form States
  const [serverError, setServerError] = useState<string | null>();
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirm] = useState<boolean>(false);
  // OTP States
  const [otp, setCode] = useState<string>("");
  const [otpError, setOTPError] = useState<string | null>("");
  const [isVerifying, setVerifying] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
    criteriaMode: "all",
  });

  const password = watch("password") || "";

  const passwordRequirements = [
    { label: t("auth.signup.reqLength"), met: password.length >= 8 },
    { label: t("auth.signup.reqLower"), met: /[a-z]/.test(password) },
    { label: t("auth.signup.reqUpper"), met: /[A-Z]/.test(password) },
    { label: t("auth.signup.reqNumber"), met: /[0-9]/.test(password) },
    { label: t("auth.signup.reqSymbol"), met: /[@#$%^&*]/.test(password) },
  ];

  // Countdown timer for resend OTP cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  async function signUpSubmit(data: User) {
    setServerError(null);
    try {
      const result = await signUp(data);

      if (!result.success) {
        if (result.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            if (messages && messages[0]) {
              setError(field as keyof User, {
                type: "server",
                message: messages[0],
              });
            }
          });
        }
        if (result.error) {
          setServerError(result.error);
        }
        return;
      }
      setStep("otp");
      setResendCooldown(60); // Supabase rate limits email sends to 60s
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("A network error has occurred. Please try again later.");
      }
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();

    if (otp.length < 6) {
      setOTPError("Please enter the complete 6-digit verification code.");
      return;
    }

    setOTPError(null);
    setVerifying(true);
    try {
      const email = watch("email");
      const result = await verifyOtp(email, otp);

      if (!result.success) {
        setOTPError(result.error || "Failed to verify code.");
        return;
      }
      setStep("success");
    } catch (err) {
      setOTPError(
        "A network error occurred. Please check your connection and try again.",
      );
    } finally {
      setVerifying(false);
    }
  }

  async function handleResendOTP() {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setOTPError(null);
    setResendSuccess(false);

    try {
      const email = watch("email");
      const result = await resendOTP(email);

      if (!result.success) {
        setOTPError(result.error || "Failed to resend code.");
        return;
      }

      setResendSuccess(true);
      setResendCooldown(60);
    } catch (err) {
      setOTPError(
        "A network error occurred while resending. Please try again.",
      );
    } finally {
      setIsResending(false);
    }
  }

  // STEP 3: SUCCESS STATE — brief message then redirect to onboarding
  useEffect(() => {
    if (step !== "success") return;
    const timeout = setTimeout(() => {
      router.replace("/onboarding");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [step, router]);

  if (step === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "border border-border bg-card p-6 sm:p-8 text-center space-y-4 shadow-xs",
          className,
        )}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 200,
            damping: 14,
          }}
          className="size-12 bg-success/15 border border-success/30 flex items-center justify-center mx-auto"
        >
          <Check className="size-5 text-success" />
        </motion.div>

        <div className="space-y-1">
          <h2 className="text-base font-bold text-foreground">
            {t("auth.signup.successTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t("auth.signup.successSubtitle")}
          </p>
        </div>

        {/* Auto-redirect progress bar */}
        <div className="h-1 w-full bg-border overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "linear" }}
            className="h-full bg-success"
          />
        </div>
      </motion.div>
    );
  }

  // STEP 2: OTP VERIFICATION
  if (step === "otp") {
    const email = watch("email");
    return (
      <div
        className={cn(
          "flex flex-col gap-4 sm:gap-5 text-start w-full",
          className,
        )}
        {...props}
      >
        {/* Header & Icon */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="size-9 sm:size-10 border border-border bg-secondary flex items-center justify-center text-secondary-foreground">
            <Mail className="size-4 sm:size-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
            {t("auth.signup.otpTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-normal break-words">
            {t("auth.signup.otpSubtitle")}{" "}
            <span className="font-semibold text-foreground break-all" dir="ltr">
              {email}
            </span>
            .
          </p>
        </div>

        {/* Resend Success Banner */}
        {resendSuccess && (
          <div className="border border-success/40 bg-success/10 p-2.5 text-xs text-success flex items-start gap-2">
            <Check className="size-4 shrink-0 mt-0.5" />
            <span>{t("auth.signup.otpFreshCode")}</span>
          </div>
        )}

        {/* Error Message */}
        {otpError && (
          <div className="border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
            {otpError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <Field>
            <FieldLabel
              htmlFor="otp-input"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              {t("auth.signup.otpLabel")}
            </FieldLabel>
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="one-time-code"
              autoFocus
              value={otp}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ""));
                setResendSuccess(false);
              }}
              placeholder="000000"
              className="h-12 w-full border border-border bg-background px-2 text-center font-mono text-xl sm:text-2xl tracking-[0.25em] sm:tracking-[0.4em] text-foreground outline-none transition-[border-color] focus:border-ring placeholder:text-muted-foreground/30 placeholder:tracking-normal"
            />
          </Field>

          <Button
            disabled={isVerifying || otp.length < 6}
            type="submit"
            className="w-full h-11 sm:h-10 cursor-pointer text-sm font-medium"
          >
            {isVerifying ? (
              <span className="flex items-center gap-2">
                <Loader className="size-4 animate-spin" />
                <span>{t("auth.signup.otpVerifying")}</span>
              </span>
            ) : (
              t("auth.signup.otpSubmit")
            )}
          </Button>
        </form>

        {/* Back and Resend Actions */}
        <div className="flex flex-row items-center justify-between gap-2 border-t border-border pt-4 text-xs">
          <button
            type="button"
            onClick={() => {
              setStep("form");
              setOTPError(null);
              setResendSuccess(false);
            }}
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors py-1 pe-2"
          >
            <ArrowLeft className="size-3.5 rtl:rotate-180" />
            <span>{t("auth.signup.otpEditEmail")}</span>
          </button>

          <button
            type="button"
            disabled={resendCooldown > 0 || isResending}
            onClick={handleResendOTP}
            className="inline-flex items-center gap-1.5 text-primary hover:underline cursor-pointer disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed transition-colors py-1 ps-2 font-medium"
          >
            {isResending ? (
              <>
                <Loader className="size-3.5 animate-spin" />
                <span>{t("auth.signup.otpSending")}</span>
              </>
            ) : resendCooldown > 0 ? (
              <span>{t("auth.signup.otpResendCooldown", { seconds: resendCooldown })}</span>
            ) : (
              <span>{t("auth.signup.otpResend")}</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // STEP 1: INITIAL SIGNUP FORM
  return (
    <div
      className={cn(
        "flex flex-col pt-10 md:pt-0 gap-3.5 sm:gap-4 w-full",
        className,
      )}
      {...props}
    >
      <form onSubmit={handleSubmit(signUpSubmit)} noValidate>
        <FieldGroup className="gap-3.5 sm:gap-4">
          <div className="flex flex-col gap-1.5">
            <Link
              href="/"
              className="flex items-center gap-2 font-medium focus:outline-none lg:hidden mb-1"
            >
              <Image
                src={logo}
                alt="Sanad سند"
                height={36}
                className="h-8 w-auto object-contain dark:hidden"
                priority
              />
              <Image
                src={logoDark}
                alt="Sanad سند"
                height={36}
                className="h-8 w-auto object-contain hidden dark:block"
                priority
              />
              <span className="sr-only">Sanad سند</span>
            </Link>

            <div className="space-y-1 text-start">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
                {t("auth.signup.title")}
              </h1>
              <FieldDescription className="text-xs sm:text-sm">
                {t("auth.signup.subtitle")}
              </FieldDescription>
              {serverError && (
                <div className="p-3 text-xs border border-destructive/40 bg-destructive/10 text-destructive">
                  {serverError}
                </div>
              )}
            </div>
          </div>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email" className="text-xs sm:text-sm">
              {t("auth.signup.email")}
            </FieldLabel>
            <Input
              {...register("email", {
                onChange: () => setServerError(null),
              })}
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              autoFocus
              aria-invalid={!!errors.email}
              className="h-11 sm:h-10 text-base md:text-sm"
            />
            {errors.email?.message && (
              <FieldError>{errors.email.message}</FieldError>
            )}
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password" className="text-xs sm:text-sm">
              {t("auth.signup.password")}
            </FieldLabel>
            <div className="relative">
              <Input
                {...register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                aria-invalid={!!errors.password}
                className="h-11 sm:h-10 text-base md:text-sm pe-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-none"
                title={showPassword ? t("auth.signup.hidePassword") : t("auth.signup.showPassword")}
                aria-label={showPassword ? t("auth.signup.hidePassword") : t("auth.signup.showPassword")}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {/* Sleek 2-Column Real-time Password Checklist */}
            {(password.length > 0 || errors.password) && (
              <div className="border border-border/80 bg-muted/20 p-2 sm:p-2.5 mt-1 space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                  {t("auth.signup.reqTitle")}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-[11px] sm:text-xs">
                  {passwordRequirements.map((req, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center gap-1.5 transition-colors",
                        req.met
                          ? "text-success font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      {req.met ? (
                        <Check className="size-3.5 shrink-0 text-success" />
                      ) : (
                        <span className="size-1.5 bg-muted-foreground/60 shrink-0" />
                      )}
                      <span className="leading-tight">{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel
              htmlFor="confirm-password"
              className="text-xs sm:text-sm"
            >
              {t("auth.signup.confirmPassword")}
            </FieldLabel>
            <div className="relative">
              <Input
                {...register("confirmPassword")}
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                aria-invalid={!!errors.confirmPassword}
                className="h-11 sm:h-10 text-base md:text-sm pe-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowConfirm(!showConfirmPassword)}
                className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-none"
                title={showConfirmPassword ? t("auth.signup.hidePassword") : t("auth.signup.showPassword")}
                aria-label={showConfirmPassword ? t("auth.signup.hidePassword") : t("auth.signup.showPassword")}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword?.message && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}
          </Field>

          <Button
            disabled={isSubmitting}
            type="submit"
            className="w-full h-11 sm:h-10 cursor-pointer text-sm font-medium"
          >
            {isSubmitting ? (
              <p className="flex flex-row items-center justify-center gap-2">
                <span>{t("auth.signup.submitting")}</span>
                <Loader className="size-4 animate-spin" />
              </p>
            ) : (
              t("auth.signup.submit")
            )}
          </Button>

          <FieldDescription className="px-1 text-center text-[11px] sm:text-xs leading-relaxed -mt-1 sm:mt-0">
            {t("auth.signup.termsPrefix")}{" "}
            <a href="#" className="underline hover:text-foreground">
              {t("auth.signup.terms")}
            </a>{" "}
            {t("auth.signup.and")}{" "}
            <a href="#" className="underline hover:text-foreground">
              {t("auth.signup.privacy")}
            </a>
            .
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
