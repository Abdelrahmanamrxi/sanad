"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import logo from "../../../public/sanad_logo.png";
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { signInSchema, type SignInInput } from "../schemas/auth";
import { signIn } from "../actions";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange", // Validates and clears errors as soon as the user types
  });

  const onSubmit = async (data: SignInInput) => {
    setServerError(null);
    try {
      const result = await signIn(data);

      if (!result.success) {
        setServerError(result.error || "Failed to sign in. Please try again.");
        return;
      }

      router.replace(result.redirectTo || "/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("A network error occurred. Please try again later.");
      }
    }
  };

  return (
    <div
      className={cn("flex flex-col pt-6 md:pt-0 gap-4 sm:gap-5 w-full", className)}
      {...props}
    >
      {/* Mobile-only logo */}
      <Link
        href="/"
        className="flex items-center gap-2 font-medium focus:outline-none lg:hidden mb-1"
      >
        <Image
          src={logo}
          alt="Sanad سند"
          height={32}
          className="h-8 w-auto object-contain rounded-none"
          priority
        />
        <span className="sr-only">Sanad سند</span>
      </Link>

      {/* Header */}
      <div className="space-y-1 text-start">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
          Welcome back
        </h1>
        <FieldDescription className="text-xs sm:text-sm">
          Enter your email and password to sign in.
        </FieldDescription>
      </div>

      {/* Sign In Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Server Error Message */}
        {serverError && (
          <div className="flex items-start gap-2.5 p-3 text-xs bg-destructive/10 border border-destructive/30 text-destructive rounded-none">
            <AlertCircle className="size-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{serverError}</span>
          </div>
        )}

        <FieldGroup className="gap-3.5 sm:gap-4">
          {/* Email */}
          <Field>
            <FieldLabel htmlFor="signin-email" className="text-xs sm:text-sm">
              Email
            </FieldLabel>
            <Input
              id="signin-email"
              type="email"
              placeholder="name@company.com"
              autoComplete="email"
              autoFocus
              {...register("email", {
                onChange: () => setServerError(null),
              })}
              className={cn(
                "h-11 sm:h-10 text-base md:text-sm border border-border bg-background px-3 focus-visible:border-primary rounded-none",
                errors.email && "border-destructive focus-visible:border-destructive"
              )}
            />
            {errors.email?.message && (
              <FieldError className="text-xs">{errors.email.message}</FieldError>
            )}
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="signin-password" className="text-xs sm:text-sm">
              Password
            </FieldLabel>
            <div className="relative">
              <Input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password", {
                  onChange: () => setServerError(null),
                })}
                className={cn(
                  "h-11 sm:h-10 text-base md:text-sm border border-border bg-background px-3 pe-10 focus-visible:border-primary rounded-none",
                  errors.password && "border-destructive focus-visible:border-destructive"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-none"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password?.message && (
              <FieldError className="text-xs">{errors.password.message}</FieldError>
            )}
          </Field>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 sm:h-10 mt-1 cursor-pointer text-sm font-medium flex items-center justify-center gap-2 rounded-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
