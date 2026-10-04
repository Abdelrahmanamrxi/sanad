"use client";

import React from "react";
import { Scissors, ShoppingBag, UtensilsCrossed, Stethoscope, Check } from "lucide-react";
import { BusinessSectorMeta } from "../types";
import { cn } from "@/lib/utils";

interface SectorCardProps {
  sector: BusinessSectorMeta;
  isSelected: boolean;
  onSelect: (id: BusinessSectorMeta["id"]) => void;
}

const ICONS = {
  scissors: Scissors,
  "shopping-bag": ShoppingBag,
  utensils: UtensilsCrossed,
  stethoscope: Stethoscope,
};

export function SectorCard({ sector, isSelected, onSelect }: SectorCardProps) {
  const IconComponent = ICONS[sector.iconName];

  return (
    <button
      type="button"
      onClick={() => onSelect(sector.id)}
      className={cn(
        "group relative flex flex-col text-start p-4 transition-all duration-150 cursor-pointer rounded-none border",
        isSelected
          ? "border-primary bg-primary/[0.04] dark:bg-primary/[0.08] shadow-[inset_0_0_0_1px_var(--primary)]"
          : "border-border bg-card hover:border-foreground/30 hover:bg-muted/30"
      )}
    >
      {/* Top row: Icon & Status square */}
      <div className="flex items-center justify-between w-full mb-3">
        <div
          className={cn(
            "flex items-center justify-center size-9 border transition-colors rounded-none",
            isSelected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground group-hover:text-foreground group-hover:border-foreground/40"
          )}
        >
          <IconComponent className="size-4" strokeWidth={1.75} />
        </div>

        <div
          className={cn(
            "size-4 border flex items-center justify-center transition-all rounded-none",
            isSelected
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-transparent opacity-40 group-hover:opacity-100"
          )}
        >
          {isSelected && <Check className="size-3 stroke-[3]" />}
        </div>
      </div>

      {/* Title & Badge */}
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="font-heading font-semibold text-sm text-foreground">
          {sector.titleEn}
        </span>
        <span className="font-sans text-xs text-muted-foreground dir-rtl" dir="rtl">
          {sector.titleAr}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {sector.descriptionEn}
      </p>

      {/* Bottom technical tag */}
      <div className="mt-3 pt-2 border-t border-border/50 flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-muted-foreground">
        <span>{sector.badgeEn}</span>
        <span className="dir-rtl" dir="rtl">{sector.badgeAr}</span>
      </div>
    </button>
  );
}
