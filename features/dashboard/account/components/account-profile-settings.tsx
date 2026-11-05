"use client";

import {
  Check,
  User,
  ShieldCheck,
  Globe,
  AlertCircle,
  Loader,
} from "lucide-react";
import { type AccountData, type AccountProfileState } from "../types";
import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { updateAccountLanguage } from "../actions";

export interface AccountProfileSettingsProps {
  initialData: AccountData;
}
const initialState: AccountProfileState = {};

const AccountProfileSettings = ({
  initialData,
}: AccountProfileSettingsProps) => {
  const [appLanguage, setAppLanguage] = useState<"en" | "ar">(
    initialData.business.appLanguage || "en",
  );

  const [state, formAction, isPending] = useActionState(
    updateAccountLanguage,
    initialState,
  );

  // Derive saved language directly from server state or initialData — NO useEffect!
  const currentSavedLanguage =
    state.savedLanguage ?? (initialData.business.appLanguage || "en");
    
  const isDirty = appLanguage !== currentSavedLanguage;

  const initials = initialData.user.fullName
    ? initialData.user.fullName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "OP";

  return (
    <section className="bg-card border border-border p-5 sm:p-6 shadow-2xs space-y-5">
      {state.error && (
        <div className="p-3 border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Only show success while the form hasn't been re-dirtied */}
      {state.success && !isDirty && (
        <div className="p-3 border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <Check className="size-4 shrink-0" />
          <span>Profile Updated Successfully.</span>
        </div>
      )}

      <form action={formAction}>
        <div className="flex items-center gap-2 border-b border-border/80 pb-3">
          <User className="size-4 text-primary" />
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
            Profile
          </h2>
        </div>

        {/* Hidden input to pass selected state value to formData */}
        <input type="hidden" name="appLanguage" value={appLanguage} />

        <div className="flex flex-col sm:flex-row p-4 items-center sm:items-start gap-5">
          {/* Square Monogram Avatar */}
          <div className="size-16 border border-border bg-muted/40 flex items-center justify-center font-mono text-xl font-bold text-foreground shrink-0 select-none">
            {initials}
          </div>

          <div className="grid grid-cols-1 gap-4 flex-1 w-full">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-sans text-xs font-semibold text-foreground">
                  Email Address
                </label>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-3" />
                  Verified
                </span>
              </div>
              <input
                type="email"
                defaultValue={initialData.user.email}
                disabled
                className="w-full border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground cursor-not-allowed select-text font-mono"
              />
            </div>
          </div>
        </div>

        {/* App / Dashboard Interface Language */}
        <div className="border-t border-border/60 pt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="size-3.5 text-primary" />
            <label className="font-sans text-xs font-semibold text-foreground">
              Dashboard App Language
            </label>
          </div>
          <p className="font-sans text-xs text-muted-foreground">
            Sets the primary interface language and direction (LTR / RTL) for
            your dashboard workspace.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              {
                id: "en",
                title: "English (US)",
                desc: "Left-to-right (LTR) operator console",
              },
              {
                id: "ar",
                title: "العربية (Arabic)",
                desc: "واجهة عربية مخصصة من اليمين لليسار (RTL)",
              },
            ].map((lang) => {
              const isSelected = appLanguage === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setAppLanguage(lang.id as "en" | "ar")}
                  className={`p-3 text-start border transition-colors cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background hover:bg-muted/40 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-sans text-xs font-semibold text-foreground">
                      {lang.title}
                    </span>
                    {isSelected && <Check className="size-3 text-primary" />}
                  </div>
                  <span className="font-sans text-[11px] text-muted-foreground block">
                    {lang.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="submit"
            disabled={!isDirty || isPending}
            size="default"
            className="font-sans text-xs font-semibold px-6 shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader className="size-3.5 animate-spin" />
                Updating Profile...
              </span>
            ) : (
              "Update Profile Settings"
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AccountProfileSettings;
