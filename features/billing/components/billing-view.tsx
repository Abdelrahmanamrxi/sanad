"use client";

import React, { useState } from "react";
import { CurrentPlanBanner } from "./current-plan-banner";
import { FlagshipCard } from "./flagship-card";
import { StarterCard } from "./starter-card";
import UpgradePlansModal from "./upgrade-plans-modal";
import type { BillingViewData } from "../types";
import { Download } from "lucide-react";


interface BillingViewProps {
  data: BillingViewData;
}

export function BillingView({ data }: BillingViewProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const isPro = data.planTier === "pro";
  console.log(data)

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* ── Page Header ── */}
      <div className="border-b border-border pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1.5">
          <span className="size-2 bg-primary rounded-none inline-block animate-pulse" />
          <span>Sanad Platform</span>
          <span className="text-border">/</span>
          <span className="text-primary font-bold">Billing & Quota Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-heading">
          Subscription & Resource Billing
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
          Monitor active AI inquiry consumption, manage knowledge base capacity, and inspect billing cycles.
        </p>
      </div>

      {/* ── Current Plan & Real-Time Telemetry Meters ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Current Tier Consumption
          </h2>
          <span className="text-[11px] font-mono text-muted-foreground">
            Workspace: <strong className="text-foreground">{data.businessName}</strong>
          </span>
        </div>
        <CurrentPlanBanner data={data} />
      </section>

      {/* ── Available Subscription Plans (Starter & Flagship Pro) ── */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Available Subscription Plans
          </h2>
          <span className="text-[11px] font-mono text-muted-foreground">
            Billed in Egyptian Pounds (EGP) • 30-Day Cycles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          <StarterCard
            currentTier={data.planTier}
            starterConfig={data.starterConfig}
            onSelect={() => setShowUpgradeModal(true)}
          />
          <FlagshipCard
            currentTier={data.planTier}
            flagshipConfig={data.flagshipConfig}
            onUpgrade={() => setShowUpgradeModal(true)}
          />
        </div>
      </section>

      {/* ── Invoice Receipts Ledger Table ── */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Billing History & Tax Receipts
          </h2>
          <span className="text-[11px] font-mono text-muted-foreground">
            Official E-Invoice Compliant (ETA)
          </span>
        </div>

        <div className="bg-card border border-border p-5 shadow-sm rounded-none">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-muted-foreground font-mono border-b border-border/80 text-[11px]">
                  <th className="py-2.5 px-3">Invoice Ref</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Plan Description</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-sans">
                {isPro ? (
                  <tr className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      SANAD-PRO-PLAN
                    </td>
                    <td className="py-3 px-3 text-muted-foreground font-mono">
                      {new Date(data.periodStart).toLocaleDateString("en-US",{
                        month:'short',
                        day:"numeric"
                      })}
                    </td>
                    <td className="py-3 px-3 font-medium text-foreground">
                      Growth Pro Plan (30 Days Active Cycle)
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      990.00 EGP
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-none">
                        PAID
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => alert("Invoice PDF receipt download initiated.")}
                        className="inline-flex items-center gap-1 text-primary hover:underline font-mono text-xs font-semibold cursor-pointer"
                      >
                        <Download className="size-3" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-muted-foreground">
                    SANAD-INITIAL-PLAN
                    </td>
                    <td className="py-3 px-3 text-muted-foreground font-mono">
                      Active
                    </td>
                    <td className="py-3 px-3 font-medium text-foreground">
                      Free Plan Sandbox (75 Inquiries)
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      0.00 EGP
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 font-mono text-[10px] font-bold bg-primary/10 border border-primary/30 text-primary rounded-none">
                        ACTIVE 
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-muted-foreground font-mono">
                      —
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Reusable Upgrade Modal (if clicked) ── */}
      <UpgradePlansModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={data.planTier}
      />
    </div>
  );
}

