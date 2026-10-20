"use client";

import React from "react";
import {
  Palette,
  Check,
  Paintbrush,
  Sliders,
  Square,
  Hash,
} from "lucide-react";
import type { WidgetConfig, WidgetPosition, LauncherStyle } from "../../types";
import { COLOR_PRESETS } from "../../constants";
import { cn } from "@/lib/utils";

interface TabAppearanceProps {
  config: WidgetConfig;
  onChange: (config: WidgetConfig) => void;
}

const ACCENT_PRESETS = [
  { name: "Mint Foam", hex: "#D3E6E2" },
  { name: "Soft Amber", hex: "#FDE68A" },
  { name: "Ice Blue", hex: "#BAE6FD" },
  { name: "Muted Sage", hex: "#D1FAE5" },
  { name: "Rose Silk", hex: "#FFE4E6" },
  { name: "Pearl Ash", hex: "#E2E8F0" },
];

const BG_PRESETS = [
  { name: "Clean White", hex: "#FFFFFF" },
  { name: "Warm Linen", hex: "#F5F1E8" },
  { name: "Obsidian Dark", hex: "#0F1716" },
  { name: "Deep Card", hex: "#132322" },
];

const CORNER_PRESETS = [
  { label: "Sharp", value: 0, sub: "0px · Monolith" },
  { label: "Subtle", value: 6, sub: "6px · Soft" },
  { label: "Medium", value: 12, sub: "12px · Modern" },
  { label: "Curved", value: 18, sub: "18px · Smooth" },
  { label: "Fluid", value: 24, sub: "24px · Rounded" },
];

const THICKNESS_PRESETS = [
  { label: "None", value: 0, sub: "0px" },
  { label: "Hairline", value: 1, sub: "1px" },
  { label: "Regular", value: 2, sub: "2px" },
  { label: "Medium", value: 3, sub: "3px" },
  { label: "Bold", value: 4, sub: "4px" },
];

export default function TabAppearance({ config, onChange }: TabAppearanceProps) {
  const primaryColor = config.primaryColor || "#0F5C55";
  const secondaryColor = config.secondaryColor || "#D3E6E2";
  const backgroundColor = config.backgroundColor || "#FFFFFF";
  const cornerRadius = config.cornerRadius ?? 0;
  const borderRadius = config.borderRadius ?? 0;

  return (
    <div className="space-y-6">
      {/* ── Top Helper Banner ── */}
      <div className="flex items-center gap-2.5 border border-amber-500/30 bg-amber-500/10 p-3 rounded-none">
        <Palette className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <p className="text-xs font-sans text-amber-950 dark:text-amber-200 leading-relaxed">
          Customize your storefront brand colors, container roundness, stroke thickness, and placement.
        </p>
      </div>

      {/* ── 1. Primary Color ── */}
      <div>
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
          <div className="flex items-center gap-2.5 border border-border bg-background p-2 rounded-none shadow-2xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => onChange({ ...config, primaryColor: e.target.value })}
              className="size-8 cursor-pointer border border-border bg-transparent p-0 rounded-none shrink-0"
              aria-label="Primary color input"
            />
            <div className="relative flex-1 flex items-center">
              <span className="font-mono text-xs text-muted-foreground ps-1 pe-0.5 select-none">#</span>
              <input
                type="text"
                value={primaryColor.replace(/^#/, "")}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
                  onChange({ ...config, primaryColor: `#${val}` });
                }}
                className="flex-1 bg-transparent font-mono text-xs text-foreground uppercase outline-none"
                placeholder="0F5C55"
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
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = primaryColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => onChange({ ...config, primaryColor: preset.hex })}
                  title={`${preset.name} (${preset.hex})`}
                  className={cn(
                    "flex flex-col items-center gap-1.5 border p-2 transition-all rounded-none cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-xs"
                      : "border-border bg-background hover:border-primary/50"
                  )}
                >
                  <span
                    className="relative flex size-6 items-center justify-center border border-black/15 rounded-none shadow-2xs"
                    style={{ backgroundColor: preset.hex }}
                  >
                    {isSelected && <Check className="size-3.5 text-white stroke-[3]" />}
                  </span>
                  <span className="font-mono text-[9px] font-medium text-foreground truncate w-full text-center">
                    {preset.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 2. Secondary / Accent Color ── */}
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
          <div className="flex items-center gap-2.5 border border-border bg-background p-2 rounded-none shadow-2xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => onChange({ ...config, secondaryColor: e.target.value })}
              className="size-8 cursor-pointer border border-border bg-transparent p-0 rounded-none shrink-0"
              aria-label="Secondary color input"
            />
            <div className="relative flex-1 flex items-center">
              <span className="font-mono text-xs text-muted-foreground ps-1 pe-0.5 select-none">#</span>
              <input
                type="text"
                value={secondaryColor.replace(/^#/, "")}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
                  onChange({ ...config, secondaryColor: `#${val}` });
                }}
                className="flex-1 bg-transparent font-mono text-xs text-foreground uppercase outline-none"
                placeholder="D3E6E2"
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
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {ACCENT_PRESETS.map((preset) => {
              const isSelected = secondaryColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => onChange({ ...config, secondaryColor: preset.hex })}
                  title={`${preset.name} (${preset.hex})`}
                  className={cn(
                    "flex flex-col items-center gap-1.5 border p-2 transition-all rounded-none cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-xs"
                      : "border-border bg-background hover:border-primary/50"
                  )}
                >
                  <span
                    className="relative flex size-6 items-center justify-center border border-black/15 rounded-none shadow-2xs"
                    style={{ backgroundColor: preset.hex }}
                  >
                    {isSelected && <Check className="size-3.5 text-foreground stroke-[3]" />}
                  </span>
                  <span className="font-mono text-[9px] font-medium text-foreground truncate w-full text-center">
                    {preset.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. Chat Background Color ── */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Paintbrush className="size-3 text-primary" />
            <span>Chat Container Background Color</span>
          </label>
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
            <span
              className="size-3 border border-black/20 inline-block shadow-2xs"
              style={{ backgroundColor: backgroundColor }}
            />
            <span>{backgroundColor}</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Quick theme pill presets */}
          <div className="flex flex-wrap items-center gap-2">
            {BG_PRESETS.map((bg) => {
              const isSelected = backgroundColor.toLowerCase() === bg.hex.toLowerCase();
              return (
                <button
                  key={bg.hex}
                  type="button"
                  onClick={() => onChange({ ...config, backgroundColor: bg.hex })}
                  className={cn(
                    "px-2.5 py-1 text-xs border flex items-center gap-1.5 transition-all rounded-none cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary/10 font-semibold ring-1 ring-primary text-foreground"
                      : "border-border bg-background hover:border-foreground/30 text-muted-foreground"
                  )}
                >
                  <span
                    className="size-3 border border-border/80 inline-block shadow-2xs"
                    style={{ backgroundColor: bg.hex }}
                  />
                  <span>{bg.name}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Hex input with live color box */}
          <div className="flex items-center gap-2.5 border border-border bg-background p-2 rounded-none shadow-2xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => onChange({ ...config, backgroundColor: e.target.value })}
              className="size-8 cursor-pointer border border-border bg-transparent p-0 rounded-none shrink-0"
              aria-label="Background color input"
            />
            <div className="relative flex-1 flex items-center">
              <span className="font-mono text-xs text-muted-foreground ps-1 pe-0.5 select-none">#</span>
              <input
                type="text"
                value={backgroundColor.replace(/^#/, "")}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
                  onChange({ ...config, backgroundColor: `#${val}` });
                }}
                className="flex-1 bg-transparent font-mono text-xs text-foreground uppercase outline-none"
                placeholder="FFFFFF"
                maxLength={6}
              />
            </div>
            <div
              className="h-6 px-2.5 flex items-center justify-center font-mono text-[10px] font-bold text-foreground shadow-xs border border-border"
              style={{ backgroundColor: backgroundColor }}
            >
              PREVIEW
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. Corner Roundness (Corner Radius) ── */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2.5">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sliders className="size-3 text-primary" />
            <span>Chat Corner Roundness (Curvature in px)</span>
          </label>
          <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 border border-primary/30 bg-primary/10">
            {cornerRadius}px
          </span>
        </div>

        <div className="border border-border bg-card p-3.5 space-y-4 rounded-none shadow-2xs">
          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CORNER_PRESETS.map((preset) => {
              const isSelected = cornerRadius === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onChange({ ...config, cornerRadius: preset.value })}
                  className={cn(
                    "p-2 border text-center transition-all cursor-pointer rounded-none flex flex-col items-center justify-center gap-1.5",
                    isSelected
                      ? "border-primary bg-primary/[0.08] ring-1 ring-primary text-primary font-semibold"
                      : "border-border bg-background hover:border-foreground/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "size-5 border-2 transition-all",
                      isSelected ? "border-primary bg-primary/20" : "border-muted-foreground/40"
                    )}
                    style={{ borderRadius: `${preset.value / 2}px` }}
                  />
                  <span className="text-xs font-sans">{preset.label}</span>
                  <span className="text-[9px] font-mono opacity-70">{preset.value}px</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Range Slider */}
          <div className="pt-2 border-t border-border/40 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>0px (Sharp)</span>
              <span>12px (Smooth)</span>
              <span>24px (Pill)</span>
            </div>

            <input
              type="range"
              min="0"
              max="24"
              step="2"
              value={cornerRadius}
              onChange={(e) => onChange({ ...config, cornerRadius: Number(e.target.value) })}
              className="w-full accent-primary cursor-pointer h-1.5 bg-muted rounded-none"
            />
          </div>
        </div>
      </div>

      {/* ── 5. Border Thickness (Stroke Width) ── */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2.5">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Square className="size-3 text-primary" />
            <span>Chat Border Thickness (Stroke Width in px)</span>
          </label>
          <span className="font-mono text-xs font-bold text-primary px-2 py-0.5 border border-primary/30 bg-primary/10">
            {borderRadius}px
          </span>
        </div>

        <div className="border border-border bg-card p-3.5 space-y-4 rounded-none shadow-2xs">
          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {THICKNESS_PRESETS.map((preset) => {
              const isSelected = borderRadius === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onChange({ ...config, borderRadius: preset.value })}
                  className={cn(
                    "p-2 border text-center transition-all cursor-pointer rounded-none flex flex-col items-center justify-center gap-1.5",
                    isSelected
                      ? "border-primary bg-primary/[0.08] ring-1 ring-primary text-primary font-semibold"
                      : "border-border bg-background hover:border-foreground/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "size-5 border-primary/40 transition-all",
                      preset.value === 0 ? "border-dashed border" : "border-solid"
                    )}
                    style={{ borderWidth: `${Math.max(1, preset.value)}px` }}
                  />
                  <span className="text-xs font-sans">{preset.label}</span>
                  <span className="text-[9px] font-mono opacity-70">{preset.value}px</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Range Slider */}
          <div className="pt-2 border-t border-border/40 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>0px (None)</span>
              <span>2px (Regular)</span>
              <span>6px (Bold)</span>
            </div>

            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={borderRadius}
              onChange={(e) => onChange({ ...config, borderRadius: Number(e.target.value) })}
              className="w-full accent-primary cursor-pointer h-1.5 bg-muted rounded-none"
            />
          </div>
        </div>
      </div>

      {/* ── 6. Launcher Screen Corner Position ── */}
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
              badgeStyle: "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold",
              desc: "Standard floating trigger location familiar to most online shoppers and international stores.",
              cornerDot: "right-2 bottom-2",
            },
            {
              id: "bottom-left",
              title: "Bottom Left",
              badge: "Alternate Corner",
              badgeStyle: "border-border bg-muted text-muted-foreground",
              desc: "Leaves the bottom-right clear for store quick-checkout bars or WhatsApp action buttons.",
              cornerDot: "left-2 bottom-2",
            },
          ].map((item) => {
            const isSelected = config.position === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ ...config, position: item.id as WidgetPosition })}
                className={cn(
                  "relative border p-3 text-start transition-all rounded-none shadow-2xs cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                {/* Mini Wireframe Displaying Corner Dot */}
                <div className="relative h-10 w-full border border-border/80 bg-muted/40 mb-2 p-1">
                  <span
                    className={cn("absolute size-2.5 rounded-none shadow-xs", item.cornerDot)}
                    style={{ backgroundColor: primaryColor }}
                  />
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="font-sans text-xs font-bold text-foreground">{item.title}</span>
                </div>
                <span className={cn("border px-1.5 py-0.2 font-mono text-[9px] inline-block mb-1", item.badgeStyle)}>
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

      {/* ── 7. Launcher Button Format ── */}
      <div className="border-t border-border pt-4">
        <label className="block font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Launcher Button Format
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
          {[
            {
              id: "badge",
              title: "Icon + Text Badge",
              desc: "Highest engagement. Displays your customized call-to-action text beside the icon.",
            },
            {
              id: "icon",
              title: "Minimal Icon Only",
              desc: "Compact, discreet floating action trigger for minimalist storefront layouts.",
            },
          ].map((item) => {
            const isSelected = config.launcherStyle === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ ...config, launcherStyle: item.id as LauncherStyle })}
                className={cn(
                  "border p-3 text-start transition-all rounded-none shadow-2xs cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30 font-semibold"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                )}
              >
                <span className="font-sans text-xs font-bold text-foreground block mb-1">{item.title}</span>
                <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </button>
            );
          })}
        </div>

        {config.launcherStyle === "badge" && (
          <div className="border border-border bg-background p-3 rounded-none shadow-2xs">
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Badge Call-to-Action Text
            </label>
            <input
              type="text"
              maxLength={24}
              value={config.launcherText}
              onChange={(e) => onChange({ ...config, launcherText: e.target.value })}
              placeholder="e.g. Chat with us"
              className="w-full border border-border bg-card px-3 py-1.5 font-sans text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all rounded-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
