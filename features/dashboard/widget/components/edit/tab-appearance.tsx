"use client";

import React from "react";
import { Layout, Palette, Check } from "lucide-react";
import type { WidgetConfig, WidgetPosition, LauncherStyle } from "../../types";
import { COLOR_PRESETS } from "../../constants";

interface TabAppearanceProps {
  config: WidgetConfig;
  onChange: (config: WidgetConfig) => void;
}

export default function TabAppearance({ config, onChange }: TabAppearanceProps) {
  return (
    <div className="space-y-6">
      {/* ── Top Helper Banner ── */}
      <div className="flex items-center gap-2.5 border border-amber-500/30 bg-amber-500/10 p-3 rounded-none">
        <Palette className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <p className="text-xs font-sans text-amber-950 dark:text-amber-200 leading-relaxed">
          Customize your brand theme color, screen placement, and floating button format.
        </p>
      </div>

      {/* 1. Brand Accent Color */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Brand Accent Color
          </label>
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-primary">
            <span
              className="size-3 border border-black/20 inline-block shadow-2xs"
              style={{ backgroundColor: config.primaryColor }}
            />
            <span>{config.primaryColor}</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Custom Hex input with live color box */}
          <div className="flex items-center gap-2.5 border border-border bg-background p-2 rounded-none shadow-2xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
            <input
              type="color"
              value={config.primaryColor}
              onChange={(e) => onChange({ ...config, primaryColor: e.target.value })}
              className="size-8 cursor-pointer border border-border bg-transparent p-0 rounded-none shrink-0"
              aria-label="Color input"
            />
            <input
              type="text"
              value={config.primaryColor}
              onChange={(e) => onChange({ ...config, primaryColor: e.target.value })}
              className="flex-1 bg-transparent font-mono text-xs text-foreground uppercase outline-none"
              placeholder="#0F5C55"
            />
            <div
              className="h-6 px-2.5 flex items-center justify-center font-mono text-[10px] font-bold text-white shadow-xs"
              style={{ backgroundColor: config.primaryColor }}
            >
              PREVIEW
            </div>
          </div>

          {/* Preset Swatches with Checkmarks */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = config.primaryColor.toLowerCase() === preset.hex.toLowerCase();
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => onChange({ ...config, primaryColor: preset.hex })}
                  title={`${preset.name} (${preset.hex})`}
                  className={`flex flex-col items-center gap-1.5 border p-2 transition-all rounded-none cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-2 ring-primary/40 shadow-xs"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
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

      {/* 2. Launcher Screen Corner */}
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
                className={`relative border p-3 text-start transition-all rounded-none shadow-2xs cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {/* Mini Wireframe Displaying Corner Dot */}
                <div className="relative h-10 w-full border border-border/80 bg-muted/40 mb-2 p-1">
                  <span className={`absolute size-2.5 rounded-none shadow-xs ${item.cornerDot}`} style={{ backgroundColor: config.primaryColor }} />
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="font-sans text-xs font-bold text-foreground">{item.title}</span>
                </div>
                <span className={`border px-1.5 py-0.2 font-mono text-[9px] inline-block mb-1 ${item.badgeStyle}`}>
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

      {/* 3. Launcher Style */}
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
                className={`border p-3 text-start transition-all rounded-none shadow-2xs cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30 font-semibold"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
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
