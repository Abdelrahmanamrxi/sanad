"use client";

import React from "react";
import { Bot, MessageSquare } from "lucide-react";

import type { LauncherStyle, WidgetPosition } from "@/features/dashboard/widget/types";

export interface WidgetLauncherProps {
  isOpen: boolean;
  onOpen: () => void;
  position?: WidgetPosition;
  launcherStyle?: LauncherStyle;
  launcherText?: string;
  primaryColor: string;
  primaryText: string;
  cornerRadius: number;
  borderRadius: number;
  isRtl: boolean;
}

export function WidgetLauncher({
  isOpen,
  onOpen,
  position = "bottom-right",
  launcherStyle = "badge",
  launcherText,
  primaryColor,
  primaryText,
  cornerRadius,
  borderRadius,
  isRtl,
}: WidgetLauncherProps) {
  if (isOpen) return null;

  return (
    <div
      className={`fixed ${
        position === "bottom-left" ? "left-4" : "right-4"
      } bottom-4 z-40`}
    >
      {launcherStyle === "badge" ? (
        <button
          type="button"
          onClick={onOpen}
          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold border shadow-xl transition-transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          style={{
            backgroundColor: primaryColor,
            color: primaryText,
            borderColor: `${primaryText}40`,
            borderRadius: `${cornerRadius}px`,
            borderWidth: `${Math.max(1, borderRadius)}px`,
          }}
        >
          <div className="relative">
            <Bot className="size-4 shrink-0" />
            <span
              className="absolute -top-1 -right-1 size-1.5 bg-emerald-400 animate-pulse"
              style={{ borderRadius: `${Math.min(cornerRadius, 4)}px` }}
            />
          </div>
          <span className="tracking-wide">
            {launcherText || (isRtl ? "تحدث معنا" : "Chat with us")}
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpen}
          className="flex items-center justify-center size-13 border shadow-xl transition-transform hover:scale-[1.05] active:scale-[0.98] cursor-pointer"
          style={{
            backgroundColor: primaryColor,
            color: primaryText,
            borderColor: `${primaryText}40`,
            borderRadius: `${cornerRadius}px`,
            borderWidth: `${Math.max(1, borderRadius)}px`,
          }}
          title={launcherText || (isRtl ? "تحدث معنا" : "Chat with us")}
        >
          <div className="relative">
            <MessageSquare className="size-5 shrink-0" />
            <span
              className="absolute -top-1 -right-1 size-2 bg-emerald-400 ring-2 ring-black/30 animate-pulse"
              style={{ borderRadius: `${Math.min(cornerRadius, 4)}px` }}
            />
          </div>
        </button>
      )}
    </div>
  );
}
