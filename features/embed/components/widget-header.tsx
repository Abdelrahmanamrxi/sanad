"use client";

import React from "react";
import { Bot, Headphones, RotateCcw, Minus, X, ChevronDown } from "lucide-react";
import type { ContainerShape, HeaderLayout, AvatarMode } from "@/features/dashboard/widget/types";
import { cn } from "@/lib/utils";

export interface WidgetHeaderProps {
  botName?: string;
  subtitle?: string;
  primaryColor: string;
  primaryText: string;
  secondaryColor?: string;
  secondaryText?: string;
  backgroundColor?: string;
  isDarkBg?: boolean;
  cornerRadius?: number;
  containerShape?: ContainerShape;
  headerLayout?: HeaderLayout;
  avatarMode?: AvatarMode;
  avatarMonogram?: string;
  isRtl?: boolean;
  hasMessages: boolean;
  onRequestHumanSupport: () => void;
  onClearChat: () => void;
  onMinimize: () => void;
  onClose: () => void;
}

export function WidgetHeader({
  botName,
  subtitle,
  primaryColor,
  primaryText,
  secondaryColor,
  secondaryText,
  backgroundColor,
  isDarkBg = false,
  cornerRadius = 24,
  containerShape = "arch",
  headerLayout = "hero",
  avatarMode = "monogram",
  avatarMonogram = "س",
  isRtl = true,
  hasMessages,
  onRequestHumanSupport,
  onClearChat,
  onMinimize,
  onClose,
}: WidgetHeaderProps) {
  const headerText = isDarkBg ? "#F3F7F6" : "#10201F";
  const headerMuted = isDarkBg
    ? "rgba(243, 247, 246, 0.7)"
    : "rgba(16, 32, 31, 0.7)";
  const headerBorder = isDarkBg
    ? "rgba(255, 255, 255, 0.08)"
    : "rgba(0, 0, 0, 0.08)";

  // ─────────────────── 1. HERO CONCIERGE HEADER (DEFAULT / EGYPTIAN CLINIC) ───────────────────
  if (headerLayout === "hero") {
    const isArch = containerShape === "arch";
    return (
      <div
        className={cn(
          "relative flex flex-col items-center text-center shrink-0 select-none border-b transition-all",
          isArch ? "pt-7 pb-3.5 px-4" : "pt-4 pb-3 px-4"
        )}
        style={{
          borderColor: headerBorder,
        }}
      >
        {/* Shoulder Bar: Minimize on left shoulder, Monogram centered, Close on right shoulder */}
        <div
          className={cn(
            "flex items-center justify-between mb-1.5 transition-all",
            isArch ? "w-full max-w-[210px] mx-auto px-1" : "w-full max-w-[340px] px-2"
          )}
        >
          {/* Left Shoulder: Minimize caret button */}
          <button
            type="button"
            onClick={onMinimize}
            className="size-8 flex items-center justify-center rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/10 dark:hover:bg-white/15 transition-colors cursor-pointer text-muted-foreground hover:text-foreground shrink-0 shadow-2xs"
            title={isRtl ? "تصغير" : "Minimize"}
          >
            <ChevronDown className="size-4.5" />
          </button>

          {/* Center Apex: Prominent Letter Monogram Stamp */}
          <div
            className={cn(
              "relative flex size-14 items-center justify-center font-bold text-2xl select-none shadow-md transition-transform hover:scale-105 shrink-0",
              containerShape === "square" ? "rounded-none" : "rounded-full"
            )}
            style={{
              backgroundColor: primaryColor,
              color: primaryText,
              border: "2px solid rgba(255, 255, 255, 0.25)",
            }}
          >
            {avatarMode === "monogram" ? (
              <span className="leading-none">{avatarMonogram || "س"}</span>
            ) : (
              <Bot className="size-6" />
            )}
          </div>

          {/* Right Shoulder: Close button */}
          <button
            type="button"
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-rose-500/15 hover:text-rose-500 text-muted-foreground transition-colors cursor-pointer shrink-0 shadow-2xs"
            title={isRtl ? "إغلاق" : "Close"}
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Brand Title (e.g. عيادة النور) */}
        <h3
          className="font-heading text-base font-bold tracking-tight leading-tight mt-1"
          style={{ color: headerText }}
        >
          {botName || (isRtl ? "عيادة النور" : "Sanad Concierge")}
        </h3>

        {/* Status Dot & Timing ("بترد في ثواني") */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="size-1.5 bg-emerald-500 rounded-full inline-block animate-pulse shrink-0" />
          <span className="font-sans text-[11px] font-medium" style={{ color: headerMuted }}>
            {subtitle || (isRtl ? "بترد في ثواني" : "Responds in seconds")}
          </span>
        </div>

        {/* Action Controls Row (Human Support & Clear Chat) */}
        <div className="flex items-center justify-center gap-2 mt-2.5">
          <button
            type="button"
            onClick={onRequestHumanSupport}
            className="h-7 px-3 text-[11px] font-sans font-medium border transition-all cursor-pointer rounded-full flex items-center gap-1.5 shadow-2xs hover:brightness-105"
            style={{
              backgroundColor: secondaryColor ? `${secondaryColor}30` : "rgba(0,0,0,0.04)",
              borderColor: secondaryColor ? `${secondaryColor}80` : "rgba(0,0,0,0.12)",
              color: headerText,
            }}
            title={isRtl ? "تحدث مع موظف دعم بشري" : "Talk to human support"}
          >
            <Headphones className="size-3 shrink-0" style={{ color: secondaryColor || primaryColor }} />
            <span>{isRtl ? "تحدث مع موظف" : "Talk to Human"}</span>
          </button>

          {hasMessages && (
            <button
              type="button"
              onClick={onClearChat}
              className="size-7 flex items-center justify-center rounded-full border border-border/70 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer text-muted-foreground hover:text-foreground shadow-2xs"
              title={isRtl ? "مسح المحادثة" : "Clear chat"}
            >
              <RotateCcw className="size-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────── 2. DOCKED COMPACT BAR (TECH / SALON / RESTAURANT) ───────────────────
  const isArch = containerShape === "arch";
  return (
    <div
      className={cn(
        "relative flex items-center justify-between shrink-0 border-b select-none backdrop-blur-md",
        isArch ? "pt-7 pb-3 px-6" : "px-3.5 py-3"
      )}
      style={{
        borderColor: headerBorder,
      }}
    >
      {/* Bot Identity & Status */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1 me-2">
        <div
          className={cn(
            "relative flex size-8.5 items-center justify-center shrink-0 border shadow-xs font-bold text-xs",
            containerShape === "square" ? "rounded-none" : "rounded-full"
          )}
          style={{
            backgroundColor: primaryColor,
            borderColor: `${primaryColor}40`,
            color: primaryText,
          }}
        >
          {avatarMode === "monogram" ? (
            <span>{avatarMonogram || "س"}</span>
          ) : (
            <Bot className="size-4.5" />
          )}
          <span className="absolute -top-0.5 -right-0.5 size-2 bg-emerald-400 ring-2 ring-black/70 animate-pulse rounded-full" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className="font-heading text-xs font-bold tracking-tight leading-tight truncate"
              style={{ color: headerText }}
              title={botName}
            >
              {botName || "Sanad Support"}
            </span>
            <span
              className="px-1.5 py-0.2 font-mono text-[9px] uppercase tracking-wider font-semibold shrink-0 border"
              style={{
                backgroundColor: secondaryColor || "rgba(255,255,255,0.06)",
                color: secondaryText || (secondaryColor ? "#FFFFFF" : primaryColor),
                borderColor: `${primaryColor}40`,
                borderRadius: containerShape === "square" ? "0px" : "4px",
              }}
            >
              {isRtl ? "مساعد ذكي" : "AI AGENT"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="size-1.5 bg-emerald-400 inline-block shrink-0 rounded-full" />
            <p
              className="font-sans text-[10.5px] truncate max-w-[190px] leading-none"
              style={{ color: headerMuted }}
            >
              {subtitle || (isRtl ? "إجابات فورية وموثقة" : "Instant verified answers")}
            </p>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onRequestHumanSupport}
          className="px-2.5 py-1 text-[10.5px] font-mono font-medium border hover:border-primary/50 bg-white/[0.04] hover:bg-white/[0.08] transition-all cursor-pointer flex items-center gap-1.5 me-1 shadow-2xs rounded-sm"
          title={isRtl ? "تحدث مع موظف دعم بشري" : "Talk to human support"}
        >
          <Headphones className="size-3 shrink-0" style={{ color: primaryColor }} />
          <span style={{ color: headerText }}>
            {isRtl ? "تحدث مع موظف" : "Talk to Human"}
          </span>
        </button>

        <button
          type="button"
          onClick={onClearChat}
          disabled={!hasMessages}
          className="size-7 flex items-center justify-center hover:bg-white/[0.08] transition-colors cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed rounded-sm"
          title={isRtl ? "مسح المحادثة وبدء محادثة جديدة" : "Clear conversation"}
        >
          <RotateCcw className="size-3.5" style={{ color: headerMuted }} />
        </button>

        <button
          type="button"
          onClick={onMinimize}
          className="size-7 flex items-center justify-center hover:bg-white/[0.08] transition-colors cursor-pointer rounded-sm"
          title={isRtl ? "تصغير" : "Minimize"}
        >
          <Minus className="size-3.5" style={{ color: headerMuted }} />
        </button>

        <button
          type="button"
          onClick={onClose}
          className="size-7 flex items-center justify-center hover:bg-rose-500/15 hover:text-rose-400 transition-colors cursor-pointer rounded-sm"
          title={isRtl ? "إغلاق" : "Close"}
        >
          <X className="size-4" style={{ color: headerMuted }} />
        </button>
      </div>
    </div>
  );
}
