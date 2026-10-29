"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";

export interface WidgetFooterProps {
  brandingEnabled: boolean;
  backgroundColor: string;
  inputBorderBelow: string;
  bgText: string;
  bgMutedText: string;
  primaryColor: string;
  cornerRadius: number;
  borderRadius: number;
  isRtl: boolean;
}

export function WidgetFooter({
  brandingEnabled,
  backgroundColor,
  inputBorderBelow,
  bgText,
  bgMutedText,
  primaryColor,
  cornerRadius,
  borderRadius,
  isRtl,
}: WidgetFooterProps) {
  if (brandingEnabled) {
    // Free Plan: Required "Powered by Sanad" attribution
    return (
      <div
        className="border-t py-1.5 text-center font-mono text-[9px] select-none"
        style={{
          backgroundColor,
          borderTopColor: inputBorderBelow,
          borderTopWidth: `${Math.max(1, borderRadius)}px`,
          color: bgMutedText,
          borderBottomLeftRadius: `${cornerRadius}px`,
          borderBottomRightRadius: `${cornerRadius}px`,
        }}
      >
        <a
          href="https://sanad.app"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity hover:underline"
          style={{ color: bgMutedText }}
        >
          <span>Powered by</span>
          <span className="font-bold tracking-wide" style={{ color: bgText }}>
            Sanad
          </span>
          <span
            className="px-1 py-0.2 font-bold text-[8px] border uppercase"
            style={{
              backgroundColor: `${primaryColor}20`,
              borderColor: `${primaryColor}40`,
              color: primaryColor,
              borderRadius: `${Math.min(cornerRadius, 3)}px`,
            }}
          >
            AI
          </span>
        </a>
      </div>
    );
  }

  // Paid Plans: White-labeled / Verified Store Assistant badge
  return (
    <div
      className="border-t py-1.5 px-3 flex items-center justify-between font-mono text-[9px] select-none"
      style={{
        backgroundColor,
        borderTopColor: inputBorderBelow,
        borderTopWidth: `${Math.max(1, borderRadius)}px`,
        color: bgMutedText,
        borderBottomLeftRadius: `${cornerRadius}px`,
        borderBottomRightRadius: `${cornerRadius}px`,
      }}
    >
      <span className="flex items-center gap-1.5">
        <CheckCircle2 className="size-3 text-emerald-500" />
        <span>
          {isRtl ? "مساعد رسمي للمتجر" : "Verified Store Assistant"}
        </span>
      </span>
      <span className="opacity-80">
        {isRtl ? "دعم متواصل 24/7" : "24/7 Live Support"}
      </span>
    </div>
  );
}
