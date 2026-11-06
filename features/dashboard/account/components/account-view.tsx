"use client";
import Link from "next/link";
import {
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AccountData } from "../types";
import AccountProfileSettings  from "./account-profile-settings"
import AccountBusinessWorkspace from "./account-business-workspace";
import AccountSecurity from "./account-security";


interface AccountViewProps {
  initialData: AccountData;
}

export function AccountView({ initialData }: AccountViewProps) {
  

  const planTierFormatted =
    initialData.planTier === "pro"
      ? "Flagship Pro"
      : initialData.planTier === "starter"
      ? "Starter Plan"
      : "Free Plan";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* ── Page Header ── */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="size-2 bg-primary inline-block" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Configuration & Preferences
          </span>
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Account & Workspace
        </h1>
        <p className="font-sans text-sm text-muted-foreground mt-1">
          Manage your operator profile, business workspace identity, and security credentials.
        </p>
      </div>

      {/* ── 1. Plan & Subscription Card (Inside Page) ── */}
      <section className="relative bg-card border border-border p-5 sm:p-6 shadow-2xs space-y-4">
        {/* Tactical Crosshairs */}
        <span className="pointer-events-none absolute -top-1.5 -left-1.5 font-mono text-xs text-primary/40 font-bold select-none">+</span>
        <span className="pointer-events-none absolute -top-1.5 -right-1.5 font-mono text-xs text-primary/40 font-bold select-none">+</span>
        <span className="pointer-events-none absolute -bottom-1.5 -left-1.5 font-mono text-xs text-primary/40 font-bold select-none">+</span>
        <span className="pointer-events-none absolute -bottom-1.5 -right-1.5 font-mono text-xs text-primary/40 font-bold select-none">+</span>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 border border-border bg-background flex items-center justify-center shrink-0">
              <Sparkles className="size-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-base font-bold text-foreground">
                  {planTierFormatted}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                  Active
                </span>
              </div>
              <p className="font-sans text-xs text-muted-foreground mt-0.5">
                Current subscription tier for your AI inquiries, temperature tuning, and team features.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="self-start sm:self-auto font-sans text-xs font-semibold"
            render={<Link href="/dashboard/billing" />}
            nativeButton={false}
          >
            <CreditCard className="size-3.5 text-primary" />
            <span>Manage Billing & Plans</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="border border-border/70 bg-background/50 p-3">
            <span className="font-mono text-[10px] uppercase text-muted-foreground block">
              Tier Level
            </span>
            <span className="font-mono text-sm font-bold text-foreground capitalize mt-0.5 block">
              {initialData.planTier}
            </span>
          </div>

          <div className="border border-border/70 bg-background/50 p-3">
            <span className="font-mono text-[10px] uppercase text-muted-foreground block">
              Billing Interval
            </span>
            <p className="font-mono text-sm flex flex-row font-bold text-foreground mt-0.5 block">
              Monthly
              <span className="text-green-700 ml-2">
                 (EGP)
                </span>
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Operator Profile (Personal Identity) ── */}
      <AccountProfileSettings  initialData={initialData} />

      {/* ── 3. Business Workspace Context ── */}
      <AccountBusinessWorkspace initialData={initialData}/>

      {/* ── 4. Security & Access ── */}
      <AccountSecurity initialData={initialData}/>

   
    </div>
  );
}

