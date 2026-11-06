"use client";

import {
  Lock,
  KeyRound,
  Calendar,
  AlertCircle,
  Check,
  Loader,
  Eye,
  EyeOff,
} from "lucide-react";
import { type AccountData, type AccountSecurityState } from "../types";
import { Button } from "@/components/ui/button";
import { useActionState, useState } from "react";
import { updateAccountPassword } from "../actions";

interface AccountSecurityProps {
  initialData: AccountData;
}

const initialState: AccountSecurityState = {};

export default function AccountSecurity({ initialData }: AccountSecurityProps) {
  const [state, formAction, isPending] = useActionState(
    updateAccountPassword,
    initialState,
  );

  // Password visibility toggle states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section className="bg-card border border-border p-5 sm:p-6 shadow-2xs space-y-5">
      <div className="flex items-center gap-2 border-b border-border/80 pb-3">
        <KeyRound className="size-4 text-primary" />
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
          Security & Password
        </h2>
      </div>

      {/* Top Level Error Banner */}
      {state.error && (
        <div className="p-3 border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Top Level Success Banner */}
      {state.success && (
        <div className="p-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <Check className="size-4 shrink-0" />
          <span>Password changed successfully.</span>
        </div>
      )}

      {/* Key changes upon success to reset all input values cleanly — zero useEffect needed */}
      <form
        key={state.success ? "password-updated" : "password-initial"}
        action={formAction}
        className="space-y-4 max-w-xl"
        suppressHydrationWarning
      >
        {/* Current Password */}
        <div className="space-y-1.5">
          <label className="font-sans text-xs font-semibold text-foreground">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              required
              autoComplete="current-password"
              suppressHydrationWarning
              placeholder="••••••••••••"
              className={`w-full border bg-background px-3 py-2 pe-10 text-sm text-foreground focus:outline-none transition-colors ${
                state.fieldErrors?.currentPassword
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((prev) => !prev)}
              tabIndex={-1}
              aria-label={showCurrent ? "Hide password" : "Show password"}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {showCurrent ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
          {state.fieldErrors?.currentPassword && (
            <span className="text-[11px] text-destructive block">
              {state.fieldErrors.currentPassword[0]}
            </span>
          )}
        </div>

        {/* New Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="font-sans text-xs font-semibold text-foreground">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                required
                autoComplete="new-password"
                suppressHydrationWarning
                placeholder="At least 8 characters"
                className={`w-full border bg-background px-3 py-2 pe-10 text-sm text-foreground focus:outline-none transition-colors ${
                  state.fieldErrors?.newPassword
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                tabIndex={-1}
                aria-label={showNew ? "Hide password" : "Show password"}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showNew ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {state.fieldErrors?.newPassword && (
              <span className="text-[11px] text-destructive block">
                {state.fieldErrors.newPassword[0]}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="font-sans text-xs font-semibold text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                required
                autoComplete="new-password"
                suppressHydrationWarning
                placeholder="Repeat new password"
                className={`w-full border bg-background px-3 py-2 pe-10 text-sm text-foreground focus:outline-none transition-colors ${
                  state.fieldErrors?.confirmPassword
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                tabIndex={-1}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute end-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showConfirm ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {state.fieldErrors?.confirmPassword && (
              <span className="text-[11px] text-destructive block">
                {state.fieldErrors.confirmPassword[0]}
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-border/60 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3 text-muted-foreground" />
            <span suppressHydrationWarning>
              Account created: {initialData.user.createdAt || "Active Session"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="size-3 text-emerald-600 dark:text-emerald-400" />
            <span>Password is Encrypted</span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          size="default"
          className="font-sans text-xs font-semibold px-6 shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader className="size-3.5 animate-spin" />
              Updating Password...
            </span>
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
    </section>
  );
}
