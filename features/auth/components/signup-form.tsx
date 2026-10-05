"use client";

import { cn } from "cn";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { Check, Loader, Mail, ArrowLeft } from "lucide-react";
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
import logo from "../../../public/sanad_logo.png";
import { User, userSchema } from "../schemas/auth";
import { signUp, verifyOtp, resendOTP } from "../actions";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Form States
  const [serverError, setServerError] = useState<string | null>();
  const [step, setStep] = useState<"form" | "otp" | "success">("form");

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
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Lowercase letter (a-z)", met: /[a-z]/.test(password) },
    { label: "Uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "Number (0-9)", met: /[0-9]/.test(password) },
    { label: "Special symbol (@#$%^&*)", met: /[@#$%^&*]/.test(password) },
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
      setOTPError("A network error occurred. Please check your connection and try again.");
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
      setOTPError("A network error occurred while resending. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  // STEP 3: SUCCESS STATE
  if (step === "success") {
    return (
      <div className={cn("border border-border bg-card p-5 sm:p-6 text-start space-y-4 shadow-xs", className)}>
        <div className="flex items-center gap-2.5 text-primary font-semibold text-base">
          <div className="size-8 bg-success/15 border border-success/30 flex items-center justify-center shrink-0">
            <Check className="size-4 text-success" />
          </div>
          <span>Email verified successfully</span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Your account is fully verified and ready. Welcome to Sanad!
        </p>
        <Button
          onClick={() => (window.location.href = "/dashboard")}
          className="w-full h-11 sm:h-10 cursor-pointer text-sm font-medium"
        >
          Go to Dashboard
        </Button>
      </div>
    );
  }

  // STEP 2: OTP VERIFICATION
  if (step === "otp") {
    const email = watch("email");
    return (
      <div className={cn("flex flex-col gap-4 sm:gap-5 text-start w-full", className)} {...props}>
        {/* Header & Icon */}
        <div className="space-y-1.5 sm:space-y-2">
          <div className="size-9 sm:size-10 border border-border bg-secondary flex items-center justify-center text-secondary-foreground">
            <Mail className="size-4 sm:size-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Check your email
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-normal break-words">
            We sent a 6-digit verification code to{" "}
            <span className="font-semibold text-foreground break-all">{email}</span>.
          </p>
        </div>

        {/* Resend Success Banner */}
        {resendSuccess && (
          <div className="border border-success/40 bg-success/10 p-2.5 text-xs text-success flex items-start gap-2">
            <Check className="size-4 shrink-0 mt-0.5" />
            <span>A fresh verification code was sent to your inbox.</span>
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
            <FieldLabel htmlFor="otp-input" className="text-xs uppercase tracking-wider text-muted-foreground">
              Verification Code
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
                <span>Verifying...</span>
              </span>
            ) : (
              "Verify & Continue"
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
            <ArrowLeft className="size-3.5" />
            <span>Edit email</span>
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
                <span>Sending...</span>
              </>
            ) : resendCooldown > 0 ? (
              <span>Resend in {resendCooldown}s</span>
            ) : (
              <span>Resend code</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // STEP 1: INITIAL SIGNUP FORM
  return (
    <div className={cn("flex flex-col pt-10 md:pt-0 gap-3.5 sm:gap-4 w-full", className)} {...props}>
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
                className="h-8 w-auto object-contain"
                priority
              />
              <span className="sr-only">Sanad سند</span>
            </Link>

            <div className="space-y-1 text-start">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Create an account
              </h1>
              <FieldDescription className="text-xs sm:text-sm">
                Enter your email and password below to get started.
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
              Email
            </FieldLabel>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              autoFocus
              aria-invalid={!!errors.email}
              className="h-11 sm:h-10 text-base md:text-sm"
            />
            {errors.email?.message && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password" className="text-xs sm:text-sm">
              Password
            </FieldLabel>
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="••••••••"
              required
              aria-invalid={!!errors.password}
              className="h-11 sm:h-10 text-base md:text-sm"
            />

            {/* Sleek 2-Column Real-time Password Checklist */}
            {(password.length > 0 || errors.password) && (
              <div className="border border-border/80 bg-muted/20 p-2 sm:p-2.5 mt-1 space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                  Password Requirements
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1 text-[11px] sm:text-xs">
                  {passwordRequirements.map((req, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center gap-1.5 transition-colors",
                        req.met ? "text-success font-medium" : "text-muted-foreground"
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
            <FieldLabel htmlFor="confirm-password" className="text-xs sm:text-sm">
              Confirm Password
            </FieldLabel>
            <Input
              {...register("confirmPassword")}
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              required
              aria-invalid={!!errors.confirmPassword}
              className="h-11 sm:h-10 text-base md:text-sm"
            />
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
                <span>Creating Account</span>
                <Loader className="size-4 animate-spin" />
              </p>
            ) : (
              "Create Account"
            )}
          </Button>

          <FieldDescription className="px-1 text-center text-[11px] sm:text-xs leading-relaxed -mt-1 sm:mt-0">
            By creating an account, you agree to our{" "}
            <a href="#" className="underline hover:text-foreground">Terms of Service</a> and{" "}
            <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}
