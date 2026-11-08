"use client";

import React from "react";
import { COLOR_PRESETS } from "../constants";
import { ColorPreset } from "../types";
import { cn } from "@/lib/utils";
import { Palette, Sparkles, Check, Hash } from "lucide-react";

interface ColorPalettePickerProps {
  primaryColor: string;
  secondaryColor: string;
  onChangePrimary: (color: string) => void;
  onChangeSecondary: (color: string) => void;
  onApplyPreset: (preset: ColorPreset) => void;
}

export function ColorPalettePicker({
  primaryColor,
  secondaryColor,
  onChangePrimary,
  onChangeSecondary,
  onApplyPreset,
}: ColorPalettePickerProps) {
  // Check which preset is active if exact match
  const activePreset = COLOR_PRESETS.find(
    (p) =>
      p.primary.toLowerCase() === primaryColor.toLowerCase() &&
      p.secondary.toLowerCase() === secondaryColor.toLowerCase()
  );

  return (
    <div className="space-y-6">
      {/* Presets header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-3 text-highlight" />
            <span>Curated Architectural Palettes</span>
          </label>
          <span className="text-[11px] font-mono text-muted-foreground">5 Presets</span>
        </div>

        {/* Preset Cards Grid */}
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
                  {/* Swatches side-by-side */}
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

      {/* Custom HEX Pickers */}
      <div className="pt-4 border-t border-border/60">
        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-3">
          <Palette className="size-3 text-primary" />
          <span>Custom Brand Palette (HEX Values)</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Primary Color Picker */}
          <div className="border border-border bg-card p-3 space-y-2 rounded-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Primary Accent</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Dominant UI
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Native color picker masked in sharp box */}
              <div
                className="relative size-9 shrink-0 border border-border overflow-hidden cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => onChangePrimary(e.target.value)}
                  className="absolute -inset-2 size-16 opacity-0 cursor-pointer"
                  title="Pick primary color"
                />
              </div>

              {/* Text HEX Input */}
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

          {/* Secondary Color Picker */}
          <div className="border border-border bg-card p-3 space-y-2 rounded-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">Secondary / Highlight</span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Badges & Tags
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Native color picker masked in sharp box */}
              <div
                className="relative size-9 shrink-0 border border-border overflow-hidden cursor-pointer"
                style={{ backgroundColor: secondaryColor }}
              >
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => onChangeSecondary(e.target.value)}
                  className="absolute -inset-2 size-16 opacity-0 cursor-pointer"
                  title="Pick secondary color"
                />
              </div>

              {/* Text HEX Input */}
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
    </div>
  );
}
