"use client";

import React from "react";
import { Monitor, Smartphone, Sun, Moon, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { DevicePreview, StoreTheme } from "../../types";

interface PreviewToolbarProps {
  device: DevicePreview;
  onDeviceChange: (device: DevicePreview) => void;
  storeTheme: StoreTheme;
  onThemeChange: (theme: StoreTheme) => void;
  onResetChat: () => void;
  isMobileModal?: boolean;
}

export default function PreviewToolbar({
  device,
  onDeviceChange,
  storeTheme,
  onThemeChange,
  onResetChat,
  isMobileModal = false,
}: PreviewToolbarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background px-4 py-2.5 shrink-0 rounded-none">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 border border-border bg-card px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground shadow-2xs rounded-none">
          <span className="size-1.5 bg-emerald-500 inline-block animate-pulse" />
          <span>{t("dashboard.widget.preview.sandboxBadge")}</span>
        </div>

        <div className="hidden sm:flex items-center gap-1 border border-border bg-muted/40 px-2.5 py-1 font-mono text-[11px] text-muted-foreground rounded-none" dir="ltr">
          <span className="text-muted-foreground/60 select-none">https://</span>
          <span className="text-foreground font-medium">merchant-store.sa</span>
        </div>
      </div>

      {/* Device & Theme Controls */}
      <div className="flex items-center gap-1.5">
        {/* Device toggle */}
        {!isMobileModal && (
          <div className="flex border border-border bg-background p-0.5 rounded-none shadow-2xs">
            <button
              type="button"
              onClick={() => onDeviceChange("desktop")}
              className={`p-1.5 text-xs transition-colors rounded-none cursor-pointer ${
                device === "desktop"
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={t("dashboard.widget.preview.desktopTooltip")}
              aria-label={t("dashboard.widget.preview.desktopTooltip")}
            >
              <Monitor className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDeviceChange("mobile")}
              className={`p-1.5 text-xs transition-colors rounded-none cursor-pointer ${
                device === "mobile"
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={t("dashboard.widget.preview.mobileTooltip")}
              aria-label={t("dashboard.widget.preview.mobileTooltip")}
            >
              <Smartphone className="size-3.5" />
            </button>
          </div>
        )}

        {/* Theme toggle */}
        <div className="flex border border-border bg-background p-0.5 rounded-none shadow-2xs">
          <button
            type="button"
            onClick={() => onThemeChange("light")}
            className={`p-1.5 text-xs transition-colors rounded-none cursor-pointer ${
              storeTheme === "light"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={t("dashboard.widget.preview.lightTooltip")}
            aria-label={t("dashboard.widget.preview.lightTooltip")}
          >
            <Sun className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onThemeChange("dark")}
            className={`p-1.5 text-xs transition-colors rounded-none cursor-pointer ${
              storeTheme === "dark"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={t("dashboard.widget.preview.darkTooltip")}
            aria-label={t("dashboard.widget.preview.darkTooltip")}
          >
            <Moon className="size-3.5" />
          </button>
        </div>

        {/* Reset conversation */}
        <button
          type="button"
          onClick={onResetChat}
          className="flex items-center gap-1 border border-border bg-background px-2.5 py-1.5 font-sans text-xs text-muted-foreground hover:text-foreground transition-colors rounded-none shadow-2xs cursor-pointer"
          title={t("dashboard.widget.preview.resetChatTooltip")}
        >
          <RotateCcw className="size-3" />
          <span className="hidden sm:inline">{t("dashboard.widget.preview.resetChat")}</span>
        </button>
      </div>
    </div>
  );
}
