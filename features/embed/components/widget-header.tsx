"use client";

import React from "react";
import { Bot, Headphones, RotateCcw, Minus, X } from "lucide-react";

export interface WidgetHeaderProps {
  botName?: string;
  subtitle?: string;
  primaryColor: string;
  primaryText: string;
  secondaryColor: string;
  secondaryText: string;
  cornerRadius: number;
  isRtl: boolean;
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
  cornerRadius,
  isRtl,
  hasMessages,
  onRequestHumanSupport,
  onClearChat,
  onMinimize,
  onClose,
}: WidgetHeaderProps) {
  return (
    <div
      className="flex items-center justify-between p-3.5 shrink-0 shadow-sm border-b select-none"
      style={{
        backgroundColor: primaryColor,
        color: primaryText,
        borderColor: `${primaryText}20`,
        borderTopLeftRadius: `${cornerRadius}px`,
        borderTopRightRadius: `${cornerRadius}px`,
      }}
    >
      {/* Bot Identity & Status */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="relative flex size-9 items-center justify-center border shrink-0"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.18)",
            borderColor: "rgba(255, 255, 255, 0.35)",
            color: primaryText,
            borderRadius: `${Math.min(cornerRadius, 8)}px`,
          }}
        >
          <Bot className="size-4.5" />
          <span
            className="absolute -top-1 -right-1 size-2 bg-emerald-400 ring-2 ring-black/40 animate-pulse"
            style={{ borderRadius: `${Math.min(cornerRadius, 4)}px` }}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="font-heading text-xs font-bold tracking-tight leading-tight truncate"
              style={{ color: primaryText }}
            >
              {botName || "Sanad AI Support"}
            </span>
            <span
              className="px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider font-bold shrink-0 border"
              style={{
                backgroundColor: secondaryColor,
                color: secondaryText,
                borderColor: `${primaryText}30`,
                borderRadius: `${Math.min(cornerRadius, 4)}px`,
              }}
            >
              {isRtl ? "مساعد ذكي" : "AI AGENT"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="size-1.5 bg-emerald-400 inline-block shrink-0"
              style={{ borderRadius: `${Math.min(cornerRadius, 2)}px` }}
            />
            <p
              className="font-sans text-[10px] truncate max-w-[210px] leading-none opacity-90"
              style={{ color: primaryText }}
            >
              {subtitle ||
                (isRtl
                  ? "إجابات فورية وموثقة من وثائق المتجر"
                  : "Instant verified answers")}
            </p>
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onRequestHumanSupport}
          style={{
            color: primaryText,
            borderColor: `${primaryText}40`,
            borderRadius: `${Math.min(cornerRadius, 4)}px`,
          }}
          className="px-2.5 py-1 text-[10px] font-medium border hover:bg-black/15 transition-colors cursor-pointer opacity-95 hover:opacity-100 flex items-center gap-1.5 me-0.5 shadow-2xs"
          title={isRtl ? "تحدث مع موظف دعم بشري" : "Talk to human support"}
        >
          <Headphones className="size-3 shrink-0" />
          <span>{isRtl ? "تحدث مع موظف" : "Talk to Human"}</span>
        </button>

        <button
          type="button"
          onClick={onClearChat}
          disabled={!hasMessages}
          style={{
            color: primaryText,
            borderRadius: `${Math.min(cornerRadius, 4)}px`,
          }}
          className="p-1 hover:bg-black/15 transition-colors cursor-pointer opacity-85 hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title={isRtl ? "مسح المحادثة وبدء محادثة جديدة" : "Clear conversation"}
        >
          <RotateCcw className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={onMinimize}
          style={{
            color: primaryText,
            borderRadius: `${Math.min(cornerRadius, 4)}px`,
          }}
          className="p-1 hover:bg-black/15 transition-colors cursor-pointer opacity-85 hover:opacity-100"
          title={isRtl ? "تصغير" : "Minimize"}
        >
          <Minus className="size-3.5" />
        </button>

        <button
          type="button"
          onClick={onClose}
          style={{
            color: primaryText,
            borderRadius: `${Math.min(cornerRadius, 4)}px`,
          }}
          className="p-1 hover:bg-black/15 transition-colors cursor-pointer opacity-85 hover:opacity-100"
          title={isRtl ? "إغلاق" : "Close"}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
