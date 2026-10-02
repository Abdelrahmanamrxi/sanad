"use client";

import { cn } from "cn";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Check, Ellipsis } from "lucide-react";
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
import { signUp } from "../actions";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [serverError, setServerError] = useState<string | null>();
  const [isSuccess, setSuccess] = useState<boolean>(false);
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

  async function signUpSubmit(data: User) {
    setServerError(null);
    const result = await signUp(data);

    if (!result.success) {
      if (result.error) {
        setServerError(result.error);
      }
      return;
    }
    setSuccess(true);
  }

  if (isSuccess) {
    return (
      <div className="border border-border bg-card p-6 text-start space-y-3">
        <div className="flex items-center gap-2 text-primary font-semibold text-base">
          <Check className="size-5 text-success" />
          <span>Account created successfully</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Please check your email to confirm your account and log in.
        </p>
       
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <form onSubmit={handleSubmit(signUpSubmit)} noValidate>
        <FieldGroup className="gap-4">
          <div className="flex flex-col gap-1.5">
            <Link
              href="/"
              className="flex items-center gap-2 font-medium focus:outline-none lg:hidden mb-2"
            >
              <Image
                src={logo}
                alt="Sanad سند"
                height={40}
                className="h-9 w-auto object-contain"
                priority
              />
              <span className="sr-only">Sanad سند</span>
            </Link>

            <div className="space-y-1 text-start">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Create an account
              </h1>
              <FieldDescription>
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
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              autoFocus
              aria-invalid={!!errors.email}
            />
            {errors.email?.message && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="••••••••"
              required
              aria-invalid={!!errors.password}
            />

            {/* Sleek 2-Column Real-time Password Checklist */}
            {(password.length > 0 || errors.password) && (
              <div className="border border-border/80 bg-muted/20 p-2.5 mt-1 space-y-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground block">
                  Password Requirements
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-xs">
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
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Field>

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input
              {...register("confirmPassword")}
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              required
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword?.message && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}
          </Field>

          <Button disabled={isSubmitting} type="submit" className="w-full cursor-pointer">
            {isSubmitting ? (
              <p className="flex flex-row items-center justify-center gap-2">
                <span>Creating Account</span>
                <Ellipsis className="size-4 animate-spin" />
              </p>
            ) : (
              "Create Account"
            )}
          </Button>
        </FieldGroup>
      </form>
      <FieldDescription className="px-2 text-center text-xs">
        By creating an account, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
