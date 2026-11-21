"use client";

import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function DailyTrafficLocked() {
  const { t } = useTranslation();

  return (
    <div className="border border-dashed border-border bg-card/60 p-8 flex flex-col items-center justify-center text-center min-h-[280px] rounded-none">
      <div className="size-10 border border-border bg-background flex items-center justify-center mb-3 rounded-none">
        <Lock className="size-4 text-highlight" />
      </div>
      <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
        {t("dashboard.overview.dailyTraffic.lockedTitle")}
      </h3>
      <p className="font-sans text-xs text-muted-foreground max-w-sm mt-1 mb-4">
        {t("dashboard.overview.dailyTraffic.lockedDesc")}
      </p>
      <Button
        variant="outline"
        size="sm"
        render={<Link href="/dashboard/billing" />}
        nativeButton={false}
        className="font-sans text-xs font-semibold rounded-none cursor-pointer"
      >
        <Sparkles className="size-3.5 text-highlight" />
        <span>{t("dashboard.overview.dailyTraffic.upgradePro")}</span>
      </Button>
    </div>
  );
}
