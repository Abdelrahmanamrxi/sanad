"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Scissors,
  ShoppingBag,
  UtensilsCrossed,
  Stethoscope,
  MapPin,
  Sparkles,
  Sun,
  Moon,
  ExternalLink,
  ShieldCheck,
  Clock,
  Calendar,
} from "lucide-react";
import { BUSINESS_SECTORS } from "../constants";
import { BusinessType } from "../types";
import { cn } from "@/lib/utils";

interface LiveStudioPreviewProps {
  businessNameEn: string;
  businessNameAr: string;
  businessType: BusinessType;
  city: string;
  country: string;
  district?: string;
  primaryColor: string;
  secondaryColor: string;
}

// Function to calculate readable text color (white or dark) based on background hex
function getContrastTextColor(hex: string): string {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? "#0C1615" : "#FFFFFF";
}

export function LiveStudioPreview({
  businessNameEn,
  businessNameAr,
  businessType,
  city,
  country,
  district,
  primaryColor,
  secondaryColor,
}: LiveStudioPreviewProps) {
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");

  const sectorMeta =
    BUSINESS_SECTORS.find((s) => s.id === businessType) || BUSINESS_SECTORS[0];

  const primaryText = getContrastTextColor(primaryColor);
  const secondaryText = getContrastTextColor(secondaryColor);

  const displayEn = businessNameEn.trim() || "Your Business Name";
  const displayAr = businessNameAr.trim() || "اسم منشأتك هنا";
  const displayLocation = `${city || "Riyadh"}, ${country || "Saudi Arabia"}${
    district ? ` · ${district}` : ""
  }`;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 overflow-hidden select-none">
      {/* Blueprint Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                            linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top Studio Control Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-border/80 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="size-2 bg-primary" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground">
            LIVE STUDIO // REAL-TIME STOREFRONT PREVIEW
          </span>
        </div>

        {/* Preview Light / Dark Mode Toggle */}
        <div className="flex items-center gap-1 border border-border bg-card p-0.5 rounded-none">
          <button
            type="button"
            onClick={() => setPreviewTheme("light")}
            className={cn(
              "px-2 py-1 text-[10px] font-mono uppercase flex items-center gap-1 transition-colors rounded-none",
              previewTheme === "light"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sun className="size-3" />
            <span>LIGHT</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewTheme("dark")}
            className={cn(
              "px-2 py-1 text-[10px] font-mono uppercase flex items-center gap-1 transition-colors rounded-none",
              previewTheme === "dark"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Moon className="size-3" />
            <span>DARK</span>
          </button>
        </div>
      </div>

      {/* Center Simulated Device / Brand Surface */}
      <div className="relative z-10 flex-1 flex items-center justify-center my-auto">
        <motion.div
          layout
          className={cn(
            "w-full max-w-md border transition-colors duration-300 shadow-xl rounded-none",
            previewTheme === "dark"
              ? "bg-[#111C1B] border-[#22383A] text-[#E8EFEE]"
              : "bg-[#FFFFFF] border-border text-[#10201F]"
          )}
        >
          {/* Mock Browser Header / Top Banner */}
          <div
            className="px-4 py-2 border-b flex items-center justify-between text-[11px] font-mono"
            style={{
              borderColor: previewTheme === "dark" ? "#22383A" : "var(--border)",
              backgroundColor: previewTheme === "dark" ? "#162524" : "#F8F6F0",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="size-2 bg-foreground/20 block" />
              <span className="size-2 bg-foreground/20 block" />
              <span className="size-2 bg-foreground/20 block" />
            </div>

            <div className="truncate px-2 text-[10px] opacity-70">
              portal.sanad.app/{businessNameEn ? businessNameEn.toLowerCase().replace(/\s+/g, "-") : "my-brand"}
            </div>

            <ExternalLink className="size-3 opacity-50" />
          </div>

          {/* Business Hero Strip */}
          <div className="p-5 sm:p-6 space-y-4">
            {/* Top row: Sector badge & Secondary Highlight pill */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 border border-border/80 bg-background/50 text-muted-foreground">
                {sectorMeta.badgeEn}
              </span>

              {/* Secondary color accent tag */}
              <span
                className="text-[10px] font-mono font-medium px-2 py-0.5 uppercase tracking-wider flex items-center gap-1"
                style={{
                  backgroundColor: secondaryColor,
                  color: secondaryText,
                }}
              >
                <Sparkles className="size-2.5" />
                <span>VERIFIED MERCHANT</span>
              </span>
            </div>

            {/* Business Titles (EN + AR) */}
            <div className="space-y-1">
              <h2 className="font-heading font-bold text-2xl tracking-tight leading-snug">
                {displayEn}
              </h2>
              <div
                className="font-sans text-lg font-medium opacity-80 dir-rtl text-end"
                dir="rtl"
              >
                {displayAr}
              </div>
            </div>

            {/* Location & Metadata Row */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/40">
              <MapPin className="size-3.5 shrink-0 text-primary" />
              <span className="truncate">{displayLocation}</span>
            </div>

            {/* Dynamic Sector Sample Card */}
            <div
              className="p-3.5 border space-y-3"
              style={{
                borderColor: previewTheme === "dark" ? "#243D3B" : "var(--border)",
                backgroundColor: previewTheme === "dark" ? "#142423" : "#FBF9F5",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground block mb-0.5">
                    {sectorMeta.sampleItem.tagEn}
                  </span>
                  <div className="font-heading font-semibold text-sm leading-tight">
                    {sectorMeta.sampleItem.titleEn}
                  </div>
                  <div className="text-[11px] opacity-75 dir-rtl text-end mt-0.5" dir="rtl">
                    {sectorMeta.sampleItem.titleAr}
                  </div>
                </div>

                <div className="text-end shrink-0">
                  <span className="font-mono text-xs font-bold block">
                    {sectorMeta.sampleItem.price}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/30">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>{sectorMeta.sampleItem.subEn}</span>
                </span>
                <span className="dir-rtl text-[10px]" dir="rtl">
                  {sectorMeta.sampleItem.subAr}
                </span>
              </div>

              {/* Primary Color CTA Button */}
              <button
                type="button"
                className="w-full py-2.5 px-4 font-heading text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-transform active:translate-y-px cursor-pointer rounded-none border border-transparent"
                style={{
                  backgroundColor: primaryColor,
                  color: primaryText,
                }}
              >
                <span>{sectorMeta.sampleItem.actionEn}</span>
                <span className="opacity-50">/</span>
                <span className="dir-rtl" dir="rtl">{sectorMeta.sampleItem.actionAr}</span>
              </button>
            </div>
          </div>

          {/* Micro Footer inside simulated screen */}
          <div
            className="px-5 py-2.5 border-t flex items-center justify-between text-[10px] font-mono text-muted-foreground"
            style={{
              borderColor: previewTheme === "dark" ? "#22383A" : "var(--border)",
              backgroundColor: previewTheme === "dark" ? "#0D1817" : "#F4EFE5",
            }}
          >
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3 text-primary" />
              <span>POWERED BY SANAD ENGINE</span>
            </span>
            <span>RTL // LTR READY</span>
          </div>
        </motion.div>
      </div>

      {/* Bottom Live Color Token Matrix */}
      <div className="relative z-10 pt-4 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className="size-4 border border-border inline-block shrink-0"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="text-muted-foreground">
              PRIMARY: <span className="text-foreground uppercase">{primaryColor}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="size-4 border border-border inline-block shrink-0"
              style={{ backgroundColor: secondaryColor }}
            />
            <span className="text-muted-foreground">
              SECONDARY: <span className="text-foreground uppercase">{secondaryColor}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
          <span className="size-1.5 bg-success inline-block" />
          <span>REAL-TIME DYNAMIC STYLING</span>
        </div>
      </div>
    </div>
  );
}
