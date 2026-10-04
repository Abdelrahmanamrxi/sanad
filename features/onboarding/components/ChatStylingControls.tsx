"use client";

import { COLOR_PRESETS } from "../constants";
import { ColorPreset } from "../types";
import { cn } from "@/lib/utils";
import {
  Palette,
  Sparkles,
  Check,
  Hash,
  Paintbrush,
  Sliders,
  Square,
  CircleDot,
} from "lucide-react";

interface ChatStylingControlsProps {
  primaryColor: string;
  secondaryColor: string;
  chatBgColor: string;
  borderRadius: number;
  onChangePrimary: (color: string) => void;
  onChangeSecondary: (color: string) => void;
  onChangeChatBg: (color: string) => void;
  onChangeBorderRadius: (radius: number) => void;
  onApplyPreset: (preset: ColorPreset) => void;
}

const BG_PRESETS = [
  { name: "Clean White", hex: "#FFFFFF" },
  { name: "Warm Linen", hex: "#F5F1E8" },
  { name: "Obsidian Dark", hex: "#0F1716" },
  { name: "Deep Card", hex: "#132322" },
];

const RADIUS_PRESETS = [
  { label: "Sharp", value: 0, sub: "0px · Monolith" },
  { label: "Subtle", value: 6, sub: "6px · Soft" },
  { label: "Medium", value: 12, sub: "12px · Modern" },
  { label: "Curved", value: 18, sub: "18px · Smooth" },
  { label: "Fluid", value: 24, sub: "24px · Rounded" },
];

export function ChatStylingControls({
  primaryColor,
  secondaryColor,
  chatBgColor,
  borderRadius,
  onChangePrimary,
  onChangeSecondary,
  onChangeChatBg,
  onChangeBorderRadius,
  onApplyPreset,
}: ChatStylingControlsProps) {
  const activePreset = COLOR_PRESETS.find(
    (p) =>
      p.primary.toLowerCase() === primaryColor.toLowerCase() &&
      p.secondary.toLowerCase() === secondaryColor.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* 1. Curated Palette Presets */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-3 text-highlight" />
            <span>Curated Brand Presets</span>
          </label>
          <span className="text-[11px] font-mono text-muted-foreground">5 Presets</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COLOR_PRESETS.map((preset) => {
            const isSelected = activePreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className={cn(
                  "p-2.5 border text-start transition-all cursor-pointer flex items-center justify-between rounded-none",
                  isSelected
                    ? "border-primary bg-primary/[0.05] ring-1 ring-primary"
                    : "border-border bg-card hover:border-foreground/30 hover:bg-muted/30"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex items-center shrink-0 border border-border">
                    <span
                      className="size-5 block"
                      style={{ backgroundColor: preset.primary }}
                      title={`Primary: ${preset.primary}`}
                    />
                    <span
                      className="size-5 block"
                      style={{ backgroundColor: preset.secondary }}
                      title={`Secondary: ${preset.secondary}`}
                    />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-foreground truncate">
                      {preset.name}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {preset.primary} · {preset.secondary}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 ms-2">
                  <div
                    className={cn(
                      "size-3.5 border flex items-center justify-center rounded-none",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-transparent opacity-30"
                    )}
                  >
                    {isSelected && <Check className="size-2.5 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Primary & Secondary Color Pickers */}
      <div className="pt-4 border-t border-border/60">
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
          <Palette className="size-3 text-primary" />
          <span>Brand Primary & Accent Colors</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Primary */}
          <div className="border border-border bg-card p-3 space-y-2 rounded-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Primary (Bot / Buttons)</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Dominant
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="relative size-9 shrink-0 border border-border overflow-hidden cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => onChangePrimary(e.target.value)}
                  className="absolute -inset-2 size-16 opacity-0 cursor-pointer"
                />
              </div>

              <div className="relative flex-1">
                <span className="absolute inset-y-0 start-2.5 flex items-center text-muted-foreground pointer-events-none">
                  <Hash className="size-3.5" />
                </span>
                <input
                  type="text"
                  value={primaryColor.replace(/^#/, "")}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
                    onChangePrimary(`#${val}`);
                  }}
                  className="w-full bg-background border border-border h-9 ps-8 pe-3 text-xs font-mono uppercase text-foreground focus:border-primary focus:outline-none rounded-none"
                  placeholder="0F5C55"
                  maxLength={6}
                />
              </div>
            </div>
          </div>

          {/* Secondary */}
          <div className="border border-border bg-card p-3 space-y-2 rounded-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Secondary (Badges / Tags)</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Accent
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="relative size-9 shrink-0 border border-border overflow-hidden cursor-pointer"
                style={{ backgroundColor: secondaryColor }}
              >
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => onChangeSecondary(e.target.value)}
                  className="absolute -inset-2 size-16 opacity-0 cursor-pointer"
                />
              </div>

              <div className="relative flex-1">
                <span className="absolute inset-y-0 start-2.5 flex items-center text-muted-foreground pointer-events-none">
                  <Hash className="size-3.5" />
                </span>
                <input
                  type="text"
                  value={secondaryColor.replace(/^#/, "")}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
                    onChangeSecondary(`#${val}`);
                  }}
                  className="w-full bg-background border border-border h-9 ps-8 pe-3 text-xs font-mono uppercase text-foreground focus:border-primary focus:outline-none rounded-none"
                  placeholder="E8A33D"
                  maxLength={6}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Chat Background Color Input */}
      <div className="pt-4 border-t border-border/60">
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2.5">
          <Paintbrush className="size-3 text-primary" />
          <span>Chat Container Background Color</span>
        </label>

        <div className="border border-border bg-card p-3.5 space-y-3 rounded-none">
          <div className="flex flex-wrap items-center gap-2">
            {BG_PRESETS.map((bg) => (
              <button
                key={bg.hex}
                type="button"
                onClick={() => onChangeChatBg(bg.hex)}
                className={cn(
                  "px-2.5 py-1 text-xs border flex items-center gap-1.5 transition-all rounded-none cursor-pointer",
                  chatBgColor.toLowerCase() === bg.hex.toLowerCase()
                    ? "border-primary bg-primary/10 font-semibold ring-1 ring-primary"
                    : "border-border bg-background hover:border-foreground/30 text-muted-foreground"
                )}
              >
                <span
                  className="size-3 border border-border/80 inline-block"
                  style={{ backgroundColor: bg.hex }}
                />
                <span>{bg.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-border/40">
            <div
              className="relative size-9 shrink-0 border border-border overflow-hidden cursor-pointer"
              style={{ backgroundColor: chatBgColor }}
            >
              <input
                type="color"
                value={chatBgColor}
                onChange={(e) => onChangeChatBg(e.target.value)}
                className="absolute -inset-2 size-16 opacity-0 cursor-pointer"
                title="Custom Background Color"
              />
            </div>

            <div className="relative flex-1">
              <span className="absolute inset-y-0 start-2.5 flex items-center text-muted-foreground pointer-events-none">
                <Hash className="size-3.5" />
              </span>
              <input
                type="text"
                value={chatBgColor.replace(/^#/, "")}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6);
                  onChangeChatBg(`#${val}`);
                }}
                className="w-full bg-background border border-border h-9 ps-8 pe-3 text-xs font-mono uppercase text-foreground focus:border-primary focus:outline-none rounded-none"
                placeholder="FFFFFF"
                maxLength={6}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Chat Border Roundness (Corner Radius) */}
      <div className="pt-4 border-t border-border/60">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sliders className="size-3 text-primary" />
            <span>Chat Border Roundness (Corner Curvature)</span>
          </label>
          <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 border border-primary/30 bg-primary/10">
            {borderRadius}px
          </span>
        </div>

        <div className="border border-border bg-card p-3.5 space-y-4 rounded-none">
          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {RADIUS_PRESETS.map((preset) => {
              const isSelected = borderRadius === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onChangeBorderRadius(preset.value)}
                  className={cn(
                    "p-2 border text-center transition-all cursor-pointer rounded-none flex flex-col items-center justify-center gap-1",
                    isSelected
                      ? "border-primary bg-primary/[0.08] ring-1 ring-primary text-primary"
                      : "border-border bg-background hover:border-foreground/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* Dynamic mini preview box showing actual roundness */}
                  <div
                    className={cn(
                      "size-5 border-2 transition-all",
                      isSelected ? "border-primary bg-primary/20" : "border-muted-foreground/40"
                    )}
                    style={{ borderRadius: `${preset.value / 2}px` }}
                  />
                  <span className="text-xs font-semibold">{preset.label}</span>
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
              value={borderRadius}
              onChange={(e) => onChangeBorderRadius(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer h-1.5 bg-muted rounded-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
