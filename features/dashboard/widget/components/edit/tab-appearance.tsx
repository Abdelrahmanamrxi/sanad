"use client";

import React, { useState } from "react";
import {
  Palette,
  Check,
  Paintbrush,
  Square,
  Sparkles,
  Lock,
  Crown,
  Type,
  Layers,
  CircleDot,
  FileText,
  MessageSquare,
} from "lucide-react";
import type {
  WidgetConfig,
  ContainerShape,
  HeaderLayout,
  AvatarMode,
  BorderStrokeStyle,
  CitationStyle,
  WidgetPosition,
  LauncherStyle,
} from "../../types";
import { DESIGN_ARCHETYPES, type StyleArchetype } from "../../constants";
import type { PlanTier } from "@/features/billing/plans";
import type { RestrictedFeatureInfo } from "@/features/billing/components/upgrade-plans-modal";
import { cn } from "@/lib/utils";

interface TabAppearanceProps {
  config: WidgetConfig;
  onChange: (config: WidgetConfig) => void;
  planTier?: PlanTier;
  onUpgrade?: (feature?: RestrictedFeatureInfo) => void;
}

const PRIMARY_COLOR_PRESETS = [
  { name: "Nile Emerald", hex: "#0E4741" },
  { name: "Sanad Teal", hex: "#0F5C55" },
  { name: "Velvet Plum", hex: "#883E4C" },
  { name: "Royal Navy", hex: "#1E3A8A" },
  { name: "Electric Blue", hex: "#2563EB" },
  { name: "Terracotta Red", hex: "#B83A24" },
  { name: "Desert Amber", hex: "#D97706" },
  { name: "Charcoal Obsidian", hex: "#10201F" },
];

const ACCENT_COLOR_PRESETS = [
  { name: "Warm Sand", hex: "#E2D9C8" },
  { name: "Soft Blush", hex: "#FCEEE6" },
  { name: "Ice Blue", hex: "#DBEAFE" },
  { name: "Muted Linen", hex: "#F5E8D3" },
  { name: "Mint Foam", hex: "#D3E6E2" },
  { name: "Soft Amber", hex: "#FDE68A" },
];

const BG_COLOR_PRESETS = [
  { name: "Warm Linen (Egyptian)", hex: "#FAF6EE" },
  { name: "Clean White", hex: "#FFFFFF" },
  { name: "Obsidian Nile Dark", hex: "#0C1615" },
  { name: "Cream Luxury", hex: "#FFFBF5" },
  { name: "Deep Charcoal", hex: "#132322" },
];

export default function TabAppearance({
  config,
  onChange,
  planTier = "free",
  onUpgrade,
}: TabAppearanceProps) {
  const isStarterOrAbove = planTier === "starter" || planTier === "pro";
  const isPro = planTier === "pro";

  const primaryColor = config.primaryColor || "#0E4741";
  const secondaryColor = config.secondaryColor || "#E2D9C8";
  const backgroundColor = config.backgroundColor || "#FAF6EE";
  const containerShape: ContainerShape = config.containerShape || "arch";
  const headerLayout: HeaderLayout = config.headerLayout || "hero";
  const avatarMode: AvatarMode = config.avatarMode || "monogram";
  const avatarMonogram = config.avatarMonogram || "س";
  const borderStyle: BorderStrokeStyle = config.borderStyle || "hairline";
  const citationStyle: CitationStyle =
    config.citationStyle || "document-snippet";
  const position: WidgetPosition = config.position || "bottom-right";
  const launcherStyle: LauncherStyle = config.launcherStyle || "badge";

  const [activeArchetypeId, setActiveArchetypeId] = useState<string | null>(
    containerShape === "arch" && headerLayout === "hero"
      ? "egyptian-concierge"
      : null,
  );

  const handleApplyArchetype = (archetype: StyleArchetype) => {
    setActiveArchetypeId(archetype.id);
    onChange({
      ...config,
      ...archetype.config,
    });
  };

  const isCompactHeader = headerLayout === "docked";

  return (
    <div className="space-y-6">
      {/* ── Top Helper Banner ── */}
      <div className="flex items-center gap-2.5 border border-primary/25 bg-primary/5 p-3 text-xs font-sans text-foreground leading-relaxed shadow-2xs">
        <Sparkles className="size-4 text-primary shrink-0" />
        <p>
          Customize your brand identity, colors, typography, container shapes,
          and header layouts. All appearance options are fully included for all
          plans.
        </p>
      </div>

      {/* ── 1. STYLE ARCHETYPES (1-CLICK GALLERY) ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-3 text-amber-500" />
            <span>Brand Style Archetypes</span>
          </label>
          <span className="font-mono text-[10px] text-muted-foreground">
            1-Click Styling
          </span>
        </div>

        <p className="text-[11px] text-muted-foreground font-sans mb-3 leading-relaxed">
          Select a pre-tuned brand archetype suited for your store or clinic.
          Each preset sets the silhouette, palette, header, and fonts in one
          click.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DESIGN_ARCHETYPES.map((arch) => {
            const isSelected =
              activeArchetypeId === arch.id ||
              (arch.id === "egyptian-concierge" &&
                containerShape === "arch" &&
                headerLayout === "hero");

            return (
              <button
                key={arch.id}
                type="button"
                onClick={() => handleApplyArchetype(arch)}
                className={cn(
                  "relative text-start p-3 border transition-all cursor-pointer flex flex-col justify-between group shadow-2xs",
                  isSelected
                    ? "border-primary bg-primary/[0.06] ring-1 ring-primary shadow-xs"
                    : "border-border bg-card hover:border-primary/50",
                )}
              >
                {/* Header row: Badge and Live Color Swatches */}
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-1">
                    <span
                      className="size-3.5 border border-black/15 shadow-2xs inline-block"
                      style={{
                        backgroundColor: arch.previewColors.primary,
                        borderRadius:
                          arch.id === "velvet-salon" ? "9999px" : "0px",
                      }}
                    />
                    <span
                      className="size-3.5 border border-black/15 shadow-2xs inline-block"
                      style={{
                        backgroundColor: arch.previewColors.bg,
                        borderRadius:
                          arch.id === "velvet-salon" ? "9999px" : "0px",
                      }}
                    />
                    <span
                      className="size-3.5 border border-black/15 shadow-2xs inline-block"
                      style={{
                        backgroundColor: arch.previewColors.accent,
                        borderRadius:
                          arch.id === "velvet-salon" ? "9999px" : "0px",
                      }}
                    />
                  </div>

                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 bg-primary/10 text-primary border border-primary/30">
                    {arch.badge}
                  </span>
                </div>

                {/* Archetype Titles */}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-foreground font-heading">
                      {arch.name}
                    </h4>
                    <span className="text-[11px] font-medium text-muted-foreground font-sans">
                      • {arch.nameAr}
                    </span>
                  </div>
                  <p className="font-sans text-[10.5px] text-muted-foreground mt-1 leading-snug">
                    {arch.tagline}
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute top-2.5 end-2.5 text-primary">
                    <Check className="size-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. CONTAINER SILHOUETTE (SHAPE ARCHITECTURE) ── */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="size-3 text-primary" />
            <span>Container Silhouette (Shape Architecture)</span>
          </label>
          <span className="font-mono text-[10px] text-primary font-bold uppercase">
            {containerShape}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Arch Dome (Default / Free) - Disabled when header is docked/compact */}
          <button
            type="button"
            disabled={isCompactHeader}
            onClick={() => {
              if (isCompactHeader) return;
              setActiveArchetypeId(null);
              onChange({ ...config, containerShape: "arch" });
            }}
            className={cn(
              "p-3 border text-start transition-all flex flex-col justify-between gap-2 shadow-2xs",
              isCompactHeader
                ? "opacity-40 cursor-not-allowed bg-muted/40 border-dashed border-border"
                : containerShape === "arch"
                  ? "border-primary bg-primary/[0.08] ring-1 ring-primary font-semibold cursor-pointer"
                  : "border-border bg-card hover:border-primary/40 cursor-pointer",
            )}
            title={
              isCompactHeader
                ? "Arch Dome requires Centered Hero layout and cannot be selected with Compact Docked Bar"
                : "Arch Dome"
            }
          >
            <div className="flex items-center justify-between w-full">
              <div
                className={cn(
                  "w-8 h-10 border-2 bg-primary/20 rounded-t-[16px] rounded-b-[4px]",
                  isCompactHeader
                    ? "border-muted-foreground/40"
                    : "border-primary",
                )}
              />
              {isCompactHeader ? (
                <span className="font-mono text-[9px] font-bold text-muted-foreground px-1 py-0.2 bg-muted border border-border">
                  REQUIRES HERO
                </span>
              ) : (
                <span className="font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                  FREE
                </span>
              )}
            </div>
            <div>
              <p className="font-heading text-xs font-bold">Arch Dome</p>
              <p className="text-[10px] text-muted-foreground font-sans leading-tight mt-0.5">
                {isCompactHeader
                  ? "Requires Centered Hero (disabled in Compact Docked)"
                  : "Authentic Andalusian / Egyptian arch dome"}
              </p>
            </div>
          </button>

          {/* Soft Pill */}
          <button
            type="button"
            onClick={() => {
              setActiveArchetypeId(null);
              onChange({ ...config, containerShape: "pill" });
            }}
            className={cn(
              "p-3 border text-start transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs",
              containerShape === "pill"
                ? "border-primary bg-primary/[0.08] ring-1 ring-primary font-semibold"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-10 border-2 border-primary bg-primary/20 rounded-[12px]" />
              <span className="font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                FREE
              </span>
            </div>
            <div>
              <p className="font-heading text-xs font-bold">Soft Pill</p>
              <p className="text-[10px] text-muted-foreground font-sans leading-tight mt-0.5">
                Smooth rounded capsule for beauty, salons & boutiques
              </p>
            </div>
          </button>

          {/* Sharp Square */}
          <button
            type="button"
            onClick={() => {
              setActiveArchetypeId(null);
              onChange({ ...config, containerShape: "square" });
            }}
            className={cn(
              "p-3 border text-start transition-all cursor-pointer flex flex-col justify-between gap-2 shadow-2xs",
              containerShape === "square"
                ? "border-primary bg-primary/[0.08] ring-1 ring-primary font-semibold"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-10 border-2 border-primary bg-primary/20 rounded-none" />
              <span className="font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                FREE
              </span>
            </div>
            <div>
              <p className="font-heading text-xs font-bold">Sharp Square</p>
              <p className="text-[10px] text-muted-foreground font-sans leading-tight mt-0.5">
                Architectural zero-radius brutalist frame
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ── 3. HEADER LAYOUT ── */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Layers className="size-3 text-primary" />
            <span>Header Layout Architecture</span>
          </label>
          <span className="font-mono text-[10px] text-primary font-bold uppercase">
            {headerLayout}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Centered Concierge Hero (Default / Free) */}
          <button
            type="button"
            onClick={() => onChange({ ...config, headerLayout: "hero" })}
            className={cn(
              "p-3 border text-start transition-all cursor-pointer flex flex-col gap-2 shadow-2xs",
              headerLayout === "hero"
                ? "border-primary bg-primary/[0.08] ring-1 ring-primary font-semibold"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                FREE
              </span>
              <CircleDot className="size-3.5 text-primary" />
            </div>
            <div>
              <p className="font-heading text-xs font-bold">
                Centered Hero Concierge
              </p>
              <p className="text-[10px] text-muted-foreground font-sans leading-relaxed mt-0.5">
                Prominent center monogram avatar, real-time response indicator,
                and friendly greeting.
              </p>
            </div>
          </button>

          {/* Compact Docked Bar */}
          <button
            type="button"
            onClick={() => {
              onChange({
                ...config,
                headerLayout: "docked",
                ...(containerShape === "arch"
                  ? { containerShape: "square" }
                  : {}),
              });
            }}
            className={cn(
              "p-3 border text-start transition-all cursor-pointer flex flex-col gap-2 shadow-2xs",
              headerLayout === "docked"
                ? "border-primary bg-primary/[0.08] ring-1 ring-primary font-semibold"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                FREE
              </span>
              <Square className="size-3.5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-heading text-xs font-bold">
                Compact Docked Bar
              </p>
              <p className="text-[10px] text-muted-foreground font-sans leading-relaxed mt-0.5">
                Streamlined horizontal top bar. (Note: Arch Dome is disabled in
                this layout).
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* ── 4. BRAND MONOGRAM & IDENTITY ── */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Type className="size-3 text-primary" />
            <span>Brand Letter Monogram (Avatar Stamp)</span>
          </label>
          <span className="font-mono text-[10px] text-primary font-bold">
            {avatarMonogram.length} / 4 chars
          </span>
        </div>

        <div className="border border-border bg-card p-3.5 flex items-center gap-3.5 shadow-2xs">
          {/* Live Monogram Badge Preview */}
          <div
            className={cn(
              "flex size-12 items-center justify-center font-bold text-lg border shadow-xs shrink-0 select-none",
              containerShape === "square" ? "rounded-none" : "rounded-full",
            )}
            style={{
              backgroundColor: primaryColor,
              color: "#FFFFFF",
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            {avatarMonogram || "س"}
          </div>

          <div className="flex-1 min-w-0">
            <input
              type="text"
              maxLength={4}
              value={avatarMonogram}
              onChange={(e) =>
                onChange({
                  ...config,
                  avatarMonogram: e.target.value.trim() || "س",
                  avatarMode: "monogram",
                })
              }
              placeholder="e.g. S, TZ, CLINIC"
              className="w-full border border-border bg-background px-3 py-1.5 font-sans font-bold text-xs text-foreground uppercase tracking-widest outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 rounded-none shadow-2xs"
            />
            <p className="text-[10.5px] text-muted-foreground font-sans mt-1">
              Enter 1–3 characters to represent your brand across the widget
              header and floating launcher button.
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. BORDER STROKE & TACTILE PERSONALITY ── */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Square className="size-3 text-primary" />
            <span>Border Stroke & Tactile Edge</span>
          </label>
          <span className="font-mono text-[10px] text-primary font-bold uppercase">
            {borderStyle}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Hairline 1px */}
          <button
            type="button"
            onClick={() => onChange({ ...config, borderStyle: "hairline" })}
            className={cn(
              "p-2.5 border text-center transition-all cursor-pointer flex flex-col items-center gap-1 shadow-2xs",
              borderStyle === "hairline"
                ? "border-primary bg-primary/[0.08] ring-1 ring-primary font-semibold"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <div className="w-full h-1 border-b border-foreground/60" />
            <span className="text-xs font-sans font-medium">
              Hairline Luxury
            </span>
            <span className="text-[9px] font-mono text-muted-foreground">
              1px Stroke
            </span>
          </button>

          {/* Hard Brutalist 2px */}
          <button
            type="button"
            onClick={() =>
              onChange({ ...config, borderStyle: "hard-brutalist" })
            }
            className={cn(
              "p-2.5 border text-center transition-all cursor-pointer flex flex-col items-center gap-1 shadow-2xs",
              borderStyle === "hard-brutalist"
                ? "border-primary bg-primary/[0.08] ring-1 ring-primary font-semibold"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <div className="w-full h-1 border-b-2 border-foreground" />
            <span className="text-xs font-sans font-medium">
              Bold Brutalist
            </span>
            <span className="text-[9px] font-mono text-muted-foreground">
              2px Ink Stroke
            </span>
          </button>

          {/* Accent Gold */}
          <button
            type="button"
            onClick={() => onChange({ ...config, borderStyle: "accent-gold" })}
            className={cn(
              "p-2.5 border text-center transition-all cursor-pointer flex flex-col items-center gap-1 shadow-2xs",
              borderStyle === "accent-gold"
                ? "border-primary bg-primary/[0.08] ring-1 ring-primary font-semibold"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <div className="w-full h-1 border-b-2 border-amber-400" />
            <span className="text-xs font-sans font-medium">Accent Gold</span>
            <span className="text-[9px] font-mono text-muted-foreground">
              Gold Metallic
            </span>
          </button>

          {/* Borderless */}
          <button
            type="button"
            onClick={() => onChange({ ...config, borderStyle: "none" })}
            className={cn(
              "p-2.5 border text-center transition-all cursor-pointer flex flex-col items-center gap-1 shadow-2xs",
              borderStyle === "none"
                ? "border-primary bg-primary/[0.08] ring-1 ring-primary font-semibold"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <div className="w-full h-1 border-b border-transparent" />
            <span className="text-xs font-sans font-medium">Subtle Soft</span>
            <span className="text-[9px] font-mono text-muted-foreground">
              0px Border
            </span>
          </button>
        </div>
      </div>

      {/* ── 6. PRIMARY BRAND COLOR (FULL CONTROLS RESTORED) ── */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Palette className="size-3 text-primary" />
            <span>Primary Brand Color (Header & Buttons)</span>
          </label>
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
            <span
              className="size-3 border border-black/20 inline-block shadow-2xs"
              style={{ backgroundColor: primaryColor }}
            />
            <span>{primaryColor}</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Custom Hex input with live color box */}
          <div className="flex items-center gap-2.5 border border-border bg-background p-2 shadow-2xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) =>
                onChange({ ...config, primaryColor: e.target.value })
              }
              className="size-8 cursor-pointer border border-border bg-transparent p-0 shrink-0"
              aria-label="Primary color input"
            />
            <div className="relative flex-1 flex items-center">
              <span className="font-mono text-xs text-muted-foreground ps-1 pe-0.5 select-none">
                #
              </span>
              <input
                type="text"
                value={primaryColor.replace(/^#/, "")}
                onChange={(e) => {
                  const val = e.target.value
                    .replace(/[^0-9A-Fa-f]/g, "")
                    .slice(0, 6);
                  onChange({ ...config, primaryColor: `#${val}` });
                }}
                className="flex-1 bg-transparent font-mono text-xs text-foreground uppercase outline-none"
                placeholder="0E4741"
                maxLength={6}
              />
            </div>
            <div
              className="h-6 px-2.5 flex items-center justify-center font-mono text-[10px] font-bold text-white shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              PREVIEW
            </div>
          </div>

          {/* Preset Swatches with Checkmarks */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRIMARY_COLOR_PRESETS.map((preset) => {
              const isSelected =
                primaryColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() =>
                    onChange({ ...config, primaryColor: preset.hex })
                  }
                  title={`${preset.name} (${preset.hex})`}
                  className={cn(
                    "flex flex-col items-center gap-1.5 border p-2 transition-all cursor-pointer shadow-2xs",
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                      : "border-border bg-card hover:border-primary/50",
                  )}
                >
                  <span
                    className="relative flex size-6 items-center justify-center border border-black/15 shadow-2xs"
                    style={{ backgroundColor: preset.hex }}
                  >
                    {isSelected && (
                      <Check className="size-3.5 text-white stroke-[3]" />
                    )}
                  </span>
                  <span className="font-mono text-[9px] font-medium text-foreground truncate w-full text-center">
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 7. SECONDARY / ACCENT COLOR (FULL CONTROLS RESTORED) ── */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Palette className="size-3 text-secondary-foreground" />
            <span>Secondary / Accent Color (Badges & Chips)</span>
          </label>
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
            <span
              className="size-3 border border-black/20 inline-block shadow-2xs"
              style={{ backgroundColor: secondaryColor }}
            />
            <span>{secondaryColor}</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Custom Hex input with live color box */}
          <div className="flex items-center gap-2.5 border border-border bg-background p-2 shadow-2xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) =>
                onChange({ ...config, secondaryColor: e.target.value })
              }
              className="size-8 cursor-pointer border border-border bg-transparent p-0 shrink-0"
              aria-label="Secondary color input"
            />
            <div className="relative flex-1 flex items-center">
              <span className="font-mono text-xs text-muted-foreground ps-1 pe-0.5 select-none">
                #
              </span>
              <input
                type="text"
                value={secondaryColor.replace(/^#/, "")}
                onChange={(e) => {
                  const val = e.target.value
                    .replace(/[^0-9A-Fa-f]/g, "")
                    .slice(0, 6);
                  onChange({ ...config, secondaryColor: `#${val}` });
                }}
                className="flex-1 bg-transparent font-mono text-xs text-foreground uppercase outline-none"
                placeholder="E2D9C8"
                maxLength={6}
              />
            </div>
            <div
              className="h-6 px-2.5 flex items-center justify-center font-mono text-[10px] font-bold text-foreground shadow-xs border border-border"
              style={{ backgroundColor: secondaryColor }}
            >
              PREVIEW
            </div>
          </div>

          {/* Preset Accent Swatches */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ACCENT_COLOR_PRESETS.map((preset) => {
              const isSelected =
                secondaryColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() =>
                    onChange({ ...config, secondaryColor: preset.hex })
                  }
                  title={`${preset.name} (${preset.hex})`}
                  className={cn(
                    "flex flex-col items-center gap-1.5 border p-2 transition-all cursor-pointer shadow-2xs",
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                      : "border-border bg-card hover:border-primary/50",
                  )}
                >
                  <span
                    className="relative flex size-6 items-center justify-center border border-black/15 shadow-2xs"
                    style={{ backgroundColor: preset.hex }}
                  >
                    {isSelected && (
                      <Check className="size-3.5 text-foreground stroke-[3]" />
                    )}
                  </span>
                  <span className="font-mono text-[9px] font-medium text-foreground truncate w-full text-center">
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 8. CHAT CONTAINER BACKGROUND SURFACE COLOR (RESTORED) ── */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Paintbrush className="size-3 text-primary" />
            <span>Chat Container Surface Color (Canvas)</span>
          </label>
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
            <span
              className="size-3 border border-black/20 inline-block shadow-2xs"
              style={{ backgroundColor }}
            />
            <span>{backgroundColor}</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Custom Hex input with live color box */}
          <div className="flex items-center gap-2.5 border border-border bg-background p-2 shadow-2xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) =>
                onChange({ ...config, backgroundColor: e.target.value })
              }
              className="size-8 cursor-pointer border border-border bg-transparent p-0 shrink-0"
              aria-label="Background surface color input"
            />
            <div className="relative flex-1 flex items-center">
              <span className="font-mono text-xs text-muted-foreground ps-1 pe-0.5 select-none">
                #
              </span>
              <input
                type="text"
                value={backgroundColor.replace(/^#/, "")}
                onChange={(e) => {
                  const val = e.target.value
                    .replace(/[^0-9A-Fa-f]/g, "")
                    .slice(0, 6);
                  onChange({ ...config, backgroundColor: `#${val}` });
                }}
                className="flex-1 bg-transparent font-mono text-xs text-foreground uppercase outline-none"
                placeholder="FAF6EE"
                maxLength={6}
              />
            </div>
            <div
              className="h-6 px-2.5 flex items-center justify-center font-mono text-[10px] font-bold text-foreground shadow-xs border border-border"
              style={{ backgroundColor }}
            >
              PREVIEW
            </div>
          </div>

          {/* Preset Swatches with Checkmarks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BG_COLOR_PRESETS.map((preset) => {
              const isSelected =
                backgroundColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() =>
                    onChange({ ...config, backgroundColor: preset.hex })
                  }
                  title={`${preset.name} (${preset.hex})`}
                  className={cn(
                    "flex flex-col items-center gap-1.5 border p-2 transition-all cursor-pointer shadow-2xs",
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                      : "border-border bg-card hover:border-primary/50",
                  )}
                >
                  <span
                    className="relative flex size-6 items-center justify-center border border-black/15 shadow-2xs"
                    style={{ backgroundColor: preset.hex }}
                  >
                    {isSelected && (
                      <Check className="size-3.5 text-foreground stroke-[3]" />
                    )}
                  </span>
                  <span className="font-mono text-[9px] font-medium text-foreground truncate w-full text-center">
                    {preset.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 9. RAG CITATION PRESENTATION ── */}
      <div className="border-t border-border pt-4">
        <div className="flex mb-5 items-center justify-between ">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <FileText className="size-3 text-primary" />
            <span>Grounded Source Citation Display</span>
          </label>
          {citationStyle === "document-snippet" ? (
            isPro ? (
              <span className="font-sans text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase flex items-center gap-1">
                <Crown className="size-3" />
                PRO ACTIVE
              </span>
            ) : (
              <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase flex items-center gap-1">
                <Crown className="size-3" />
                PRO PLAN REQUIRED
              </span>
            )
          ) : (
            <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
              FREE / ACTIVE
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Option 1: Normal Message (No Document Part) */}
          <button
            type="button"
            onClick={() => onChange({ ...config, citationStyle: "none" })}
            className={cn(
              "p-3 border text-start transition-all cursor-pointer flex flex-col gap-1.5 shadow-2xs rounded-none",
              citationStyle === "none"
                ? "border-primary bg-primary/[0.08] ring-1 ring-primary font-semibold"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <div className="flex items-center flex-col justify-center gap-1">
              <span className="font-heading text-xs font-bold flex items-center gap-1.5">
                <MessageSquare className="size-3 text-primary" />
                Normal Message
              </span>
              <span className="font-mono text-[9px] text-emerald-600 font-bold">
                DEFAULT
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-sans leading-relaxed">
              Standard conversational message without attaching source snippet
              cards or citation tags.
            </p>
          </button>

          {/* Option 3: Document Highlight Card (PRO Only) */}
          <button
            type="button"
            onClick={() => {
              if (!isPro) {
                onUpgrade?.({
                  featureName: "Document Highlight Cards",
                  requiredTier: "pro",
                  reason:
                    "Displaying rich Document Highlight Cards with verified marker excerpts requires the Growth (Pro) plan.",
                });
              }
              onChange({ ...config, citationStyle: "document-snippet" });
            }}
            className={cn(
              "relative p-3 border text-start transition-all cursor-pointer flex flex-col gap-1.5 shadow-2xs rounded-none",
              citationStyle === "document-snippet"
                ? isPro
                  ? "border-primary bg-primary/[0.08] ring-1 ring-primary font-semibold"
                  : "border-amber-500 bg-amber-500/[0.06] ring-1 ring-amber-500 font-semibold"
                : "border-border bg-card hover:border-primary/40",
            )}
          >
            <div className="flex items-center justify-center flex-col gap-1">
              <span className="font-heading text-xs font-bold flex items-center gap-1.5">
                <Crown
                  className={cn(
                    "size-3",
                    isPro ? "text-primary" : "text-amber-500",
                  )}
                />
                Verified Document Badge
              </span>
              <span
                className={cn(
                  "font-mono text-[9px] font-bold flex items-center gap-0.5",
                  isPro ? "text-primary" : "text-amber-600 dark:text-amber-400",
                )}
              >
                {!isPro && <Lock className="size-2.5" />}
                PRO PLAN
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-sans leading-relaxed">
              Compact verified source badge showing official document name
              anchored neatly under the message.
            </p>
          </button>
        </div>
      </div>

      {/* ── 10. LAUNCHER SCREEN CORNER POSITION (RESTORED) ── */}
      <div className="border-t border-border pt-4">
        <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Launcher Screen Position
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {[
            {
              id: "bottom-right",
              title: "Bottom Right",
              badge: "Standard (Recommended)",
              badgeStyle:
                "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold",
              desc: "Standard e-commerce placement, maximizing visitor discovery and ease of interaction.",
              cornerDot: "right-2 bottom-2",
            },
            {
              id: "bottom-left",
              title: "Bottom Left",
              badge: "Alternate Corner",
              badgeStyle: "border-border bg-muted text-muted-foreground",
              desc: "Alternate corner, leaving the right side clear for existing WhatsApp or quick-checkout buttons.",
              cornerDot: "left-2 bottom-2",
            },
          ].map((item) => {
            const isSelected = position === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onChange({ ...config, position: item.id as WidgetPosition })
                }
                className={cn(
                  "relative border p-3 text-start transition-all rounded-none shadow-2xs cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                {/* Mini Wireframe Displaying Corner Dot */}
                <div className="relative h-10 w-full border border-border/80 bg-background/50 mb-2 p-1">
                  <span
                    className={cn(
                      "absolute size-2.5 rounded-none shadow-xs",
                      item.cornerDot,
                    )}
                    style={{ backgroundColor: primaryColor }}
                  />
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="font-sans text-xs font-bold text-foreground">
                    {item.title}
                  </span>
                </div>
                <span
                  className={cn(
                    "border px-1.5 py-0.2 font-mono text-[9px] inline-block mb-1",
                    item.badgeStyle,
                  )}
                >
                  {item.badge}
                </span>
                <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 11. LAUNCHER BUTTON FORMAT (RESTORED) ── */}
      <div className="border-t border-border pt-4">
        <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Launcher Button Format & CTA Text
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          {[
            {
              id: "badge",
              title: "Icon + Text Badge (Dual-Pill in Arch)",
              desc: "Highest conversion format, pairing your monogram stamp with an inviting greeting.",
            },
            {
              id: "icon",
              title: "Minimal Icon / Monogram Only",
              desc: "Compact floating circular or square launcher for minimalist aesthetics.",
            },
          ].map((item) => {
            const isSelected = launcherStyle === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onChange({
                    ...config,
                    launcherStyle: item.id as LauncherStyle,
                  })
                }
                className={cn(
                  "border p-3 text-start transition-all rounded-none shadow-2xs cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30 font-semibold"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
                )}
              >
                <span className="font-sans text-xs font-bold text-foreground block mb-1">
                  {item.title}
                </span>
                <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>

        {launcherStyle === "badge" && (
          <div className="border border-border bg-card p-3 rounded-none shadow-2xs">
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Badge Call-to-Action Text
            </label>
            <input
              type="text"
              maxLength={28}
              value={config.launcherText || ""}
              onChange={(e) =>
                onChange({ ...config, launcherText: e.target.value })
              }
              placeholder={
                containerShape === "arch"
                  ? "At your help, ask me"
                  : "Chat with us"
              }
              className="w-full border border-border bg-background px-3 py-1.5 font-sans text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all rounded-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
