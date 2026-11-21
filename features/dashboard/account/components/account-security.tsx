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
import { useTranslation } from "react-i18next";

interface AccountSecurityProps {
  initialData: AccountData;
}

const initialState: AccountSecurityState = {};

export default function AccountSecurity({ initialData }: AccountSecurityProps) {
  const { t } = useTranslation();
  const [state, formAction, isPending] = useActionState(
    updateAccountPassword,
    initialState,
  );

  // Password visibility toggle states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <section className="bg-card border border-border p-5 sm:p-6 shadow-2xs space-y-5 rounded-none">
      <div className="flex items-center gap-2 border-b border-border/80 pb-3">
        <KeyRound className="size-4 text-primary" />
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground font-sans">
          {t("dashboard.account.security.title", "Security & Password")}
        </h2>
      </div>

      {/* Top Level Error Banner */}
      {state.error && (
        <div className="p-3 border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2 rounded-none font-sans">
          <AlertCircle className="size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Top Level Success Banner */}
      {state.success && (
        <div className="p-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 rounded-none font-sans">
          <Check className="size-4 shrink-0" />
          <span>{t("dashboard.account.security.success", "Password changed successfully.")}</span>
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
            {t("dashboard.account.security.currentPassword", "Current Password")}
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              required
              autoComplete="current-password"
              suppressHydrationWarning
              placeholder="••••••••••••"
              className={`w-full border bg-background px-3 py-2 pe-10 text-sm text-foreground focus:outline-none transition-colors rounded-none ${
                state.fieldErrors?.currentPassword
                  ? "border-destructive focus:border-destructive"
                  : "border-border focus:border-primary"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowCurrent((prev) => !prev)}
              onMouseDown={(e) => e.preventDefault()}
              tabIndex={-1}
              aria-label={
                showCurrent
                  ? t("dashboard.account.security.hidePassword", "Hide password")
                  : t("dashboard.account.security.showPassword", "Show password")
              }
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
            <span className="text-[11px] text-destructive block font-sans">
              {state.fieldErrors.currentPassword[0]}
            </span>
          )}
        </div>

        {/* New Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="font-sans text-xs font-semibold text-foreground">
              {t("dashboard.account.security.newPassword", "New Password")}
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                required
                autoComplete="new-password"
                suppressHydrationWarning
                placeholder={t("dashboard.account.security.newPasswordPlaceholder", "At least 8 characters")}
                className={`w-full border bg-background px-3 py-2 pe-10 text-sm text-foreground focus:outline-none transition-colors rounded-none ${
                  state.fieldErrors?.newPassword
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                onMouseDown={(e) => e.preventDefault()}
                tabIndex={-1}
                aria-label={
                  showNew
                    ? t("dashboard.account.security.hidePassword", "Hide password")
                    : t("dashboard.account.security.showPassword", "Show password")
                }
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
              <span className="text-[11px] text-destructive block font-sans">
                {state.fieldErrors.newPassword[0]}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="font-sans text-xs font-semibold text-foreground">
              {t("dashboard.account.security.confirmPassword", "Confirm Password")}
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                required
                autoComplete="new-password"
                suppressHydrationWarning
                placeholder={t("dashboard.account.security.confirmPasswordPlaceholder", "Repeat new password")}
                className={`w-full border bg-background px-3 py-2 pe-10 text-sm text-foreground focus:outline-none transition-colors rounded-none ${
                  state.fieldErrors?.confirmPassword
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                onMouseDown={(e) => e.preventDefault()}
                tabIndex={-1}
                aria-label={
                  showConfirm
                    ? t("dashboard.account.security.hidePassword", "Hide password")
                    : t("dashboard.account.security.showPassword", "Show password")
                }
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
              <span className="text-[11px] text-destructive block font-sans">
                {state.fieldErrors.confirmPassword[0]}
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-border/60 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground font-mono">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3 text-muted-foreground" />
            <span suppressHydrationWarning>
              {t("dashboard.account.security.accountCreated", {
                date: initialData.user.createdAt || t("dashboard.account.security.activeSession", "Active Session"),
              })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="size-3 text-emerald-600 dark:text-emerald-400" />
            <span>{t("dashboard.account.security.encrypted", "Password is Encrypted")}</span>
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
              {t("dashboard.account.security.updating", "Updating Password...")}
            </span>
          ) : (
            t("dashboard.account.security.changeBtn", "Change Password")
          )}
        </Button>
      </form>
    </section>
  );
}
