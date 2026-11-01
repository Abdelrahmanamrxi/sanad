"use client";

import React from "react";
import { Bot, MessageSquare } from "lucide-react";

import type {
  LauncherStyle,
  WidgetPosition,
  ContainerShape,
  AvatarMode,
} from "@/features/dashboard/widget/types";

export interface WidgetLauncherProps {
  isOpen: boolean;
  onOpen: () => void;
  position?: WidgetPosition;
  launcherStyle?: LauncherStyle;
  launcherText?: string;
  primaryColor: string;
  primaryText: string;
  secondaryColor?: string;
  secondaryText?: string;
  cornerRadius: number;
  borderRadius: number;
  isRtl: boolean;
  containerShape?: ContainerShape;
  avatarMode?: AvatarMode;
  avatarMonogram?: string;
}

export function WidgetLauncher({
  isOpen,
  onOpen,
  position = "bottom-right",
  launcherStyle = "badge",
  launcherText,
  primaryColor,
  primaryText,
  secondaryColor,
  secondaryText,
  cornerRadius,
  borderRadius,
  isRtl,
  containerShape = "arch",
  avatarMode = "monogram",
  avatarMonogram = "س",
}: WidgetLauncherProps) {
  if (isOpen) return null;

  const isCurved = containerShape === "arch" || containerShape === "pill";
  const defaultText = launcherText || (isRtl ? (containerShape === "arch" ? "تحت أمرك، اسألني" : "تحدث معنا") : "Chat with us");

  // Dual-pill launcher for Egyptian Arch style
  if (containerShape === "arch" && launcherStyle === "badge") {
    return (
      <div
        className={`fixed ${
          position === "bottom-left" ? "left-4" : "right-4"
        } bottom-4 z-40 flex items-center gap-2 select-none`}
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        <button
          type="button"
          onClick={onOpen}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer border"
          style={{
            backgroundColor: secondaryColor || "#FAF6EE",
            color: secondaryText || "#0E4741",
            borderColor: `${primaryColor}35`,
          }}
        >
          <span className="size-2 bg-emerald-500 rounded-full animate-pulse shrink-0" />
          <span className="font-heading font-semibold text-xs tracking-tight">
            {defaultText}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpen}
          className="size-12 rounded-full flex items-center justify-center font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
          style={{
            backgroundColor: primaryColor,
            color: primaryText,
          }}
          title={defaultText}
        >
          {avatarMode === "monogram" ? (
            <span className="leading-none">{avatarMonogram || "س"}</span>
          ) : (
            <Bot className="size-5.5" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed ${
        position === "bottom-left" ? "left-4" : "right-4"
      } bottom-4 z-40`}
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {launcherStyle === "badge" ? (
        <button
          type="button"
          onClick={onOpen}
          className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold border shadow-xl transition-transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer ${
            isCurved ? "rounded-full" : containerShape === "square" ? "rounded-none" : ""
          }`}
          style={{
            backgroundColor: primaryColor,
            color: primaryText,
            borderColor: `${primaryText}40`,
            borderRadius: isCurved ? "9999px" : containerShape === "square" ? "0px" : `${cornerRadius}px`,
            borderWidth: `${Math.max(1, borderRadius)}px`,
          }}
        >
          <div className="relative flex items-center justify-center">
            {avatarMode === "monogram" ? (
              <span className="font-bold text-sm leading-none pe-0.5">{avatarMonogram || "س"}</span>
            ) : (
              <Bot className="size-4 shrink-0" />
            )}
            <span
              className="absolute -top-1 -right-1 size-1.5 bg-emerald-400 animate-pulse"
              style={{ borderRadius: isCurved ? "9999px" : containerShape === "square" ? "0px" : `${Math.min(cornerRadius, 4)}px` }}
            />
          </div>
          <span className="tracking-wide">
            {defaultText}
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpen}
          className={`flex items-center justify-center size-13 border shadow-xl transition-transform hover:scale-[1.05] active:scale-[0.98] cursor-pointer ${
            isCurved ? "rounded-full" : containerShape === "square" ? "rounded-none" : ""
          }`}
          style={{
            backgroundColor: primaryColor,
            color: primaryText,
            borderColor: `${primaryText}40`,
            borderRadius: isCurved ? "9999px" : containerShape === "square" ? "0px" : `${cornerRadius}px`,
            borderWidth: `${Math.max(1, borderRadius)}px`,
          }}
          title={defaultText}
        >
          <div className="relative flex items-center justify-center">
            {avatarMode === "monogram" ? (
              <span className="font-bold text-base leading-none">{avatarMonogram || "س"}</span>
            ) : (
              <MessageSquare className="size-5 shrink-0" />
            )}
            <span
              className="absolute -top-1 -right-1 size-2 bg-emerald-400 ring-2 ring-black/30 animate-pulse"
              style={{ borderRadius: isCurved ? "9999px" : containerShape === "square" ? "0px" : `${Math.min(cornerRadius, 4)}px` }}
            />
          </div>
        </button>
      )}
    </div>
  );
}
