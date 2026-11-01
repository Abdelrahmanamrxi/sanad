"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Search, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { ContainerShape } from "@/features/dashboard/widget/types";

export interface ThinkingIndicatorProps {
  isRtl: boolean;
  primaryColor: string;
  secondaryColor?: string;
  surfaceCardBg?: string;
  isDarkBg?: boolean;
  cornerRadius?: number;
  containerShape?: ContainerShape;
  botName?: string;
}

/**
 * High-engagement Thinking Indicator that cycles through intelligent retrieval stages
 * Keeps the customer engaged, reducing bounces while the model grounds the answer.
 */
export function ThinkingIndicator({
  isRtl,
  primaryColor,
  secondaryColor = "#D3E6E2",
  surfaceCardBg,
  isDarkBg = false,
  cornerRadius = 8,
  containerShape = "arch",
  botName,
}: ThinkingIndicatorProps) {
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    {
      badgeEn: "SEARCHING KNOWLEDGE",
      badgeAr: "مراجعة المستندات",
      textEn: "Searching verified store policies & catalog...",
      textAr: "البحث في وثائق وسياسات المتجر المعتمدة...",
      icon: Search,
    },
    {
      badgeEn: "VERIFYING CONTEXT",
      badgeAr: "التحقق والمطابقة",
      textEn: "Grounding facts against store records...",
      textAr: "التحقق من صحة ومطابقة البيانات المعتمدة...",
      icon: ShieldCheck,
    },
    {
      badgeEn: "COMPOSING ANSWER",
      badgeAr: "صياغة الرد",
      textEn: "Crafting accurate, personalized response...",
      textAr: "صياغة الرد الدقيق لاستفسارك الآن...",
      icon: Sparkles,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, 1800);
    return () => clearInterval(timer);
  }, [stages.length]);

  const current = stages[stageIndex];
  const IconComponent = current.icon;

  const isCurved = containerShape === "arch" || containerShape === "pill";
  const bubbleRadius = isCurved
    ? isRtl
      ? "16px 4px 16px 16px"
      : "4px 16px 16px 16px"
    : containerShape === "square"
      ? "0px"
      : `${Math.min(cornerRadius, 12)}px`;

  const badgeRadius = isCurved
    ? "9999px"
    : containerShape === "square"
      ? "0px"
      : `${Math.min(cornerRadius, 4)}px`;

  const fallbackCardBg = isDarkBg
    ? "rgba(255, 255, 255, 0.08)"
    : "#F5F1E8";

  return (
    <div
      className="relative overflow-hidden border shadow-xs p-3 text-xs w-full max-w-[340px] select-none"
      style={{
        backgroundColor: surfaceCardBg || fallbackCardBg,
        borderColor: isDarkBg
          ? "rgba(255, 255, 255, 0.12)"
          : `${primaryColor}25`,
        borderRadius: bubbleRadius,
        borderLeftWidth: isRtl ? "1px" : "3px",
        borderRightWidth: isRtl ? "3px" : "1px",
        borderLeftColor: isRtl
          ? isDarkBg
            ? "rgba(255, 255, 255, 0.12)"
            : `${primaryColor}25`
          : primaryColor,
        borderRightColor: isRtl
          ? primaryColor
          : isDarkBg
            ? "rgba(255, 255, 255, 0.12)"
            : `${primaryColor}25`,
      }}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <style>{`
        @keyframes thinkingShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Shimmer Ambient Sweep Line at the top */}
      <div className="absolute top-0 inset-x-0 h-[2px] overflow-hidden pointer-events-none">
        <div
          className="w-full h-full opacity-75"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent 0%, ${primaryColor} 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
            animation: "thinkingShimmer 1.8s infinite linear",
          }}
        />
      </div>

      <div className="flex items-start gap-3">
        {/* High-Precision AI Orbital Spinner */}
        <div className="relative size-8 shrink-0 flex items-center justify-center mt-0.5">
          {/* Ambient Glow */}
          <div
            className="absolute inset-0 blur-[6px] opacity-25"
            style={{
              backgroundColor: primaryColor,
              borderRadius: isCurved ? "9999px" : "0px",
            }}
          />

          {/* Outer dashed slow orbital track */}
          <div
            className="absolute inset-0 border border-dashed opacity-35 animate-[spin_9s_linear_infinite]"
            style={{
              borderColor: primaryColor,
              borderRadius: isCurved ? "9999px" : "0px",
            }}
          />

          {/* Core Smooth SVG Gradient Spinner */}
          <svg
            className="size-full animate-spin"
            viewBox="0 0 32 32"
            fill="none"
            style={{ animationDuration: "1.25s" }}
          >
            <circle
              cx="16"
              cy="16"
              r="12"
              stroke={primaryColor}
              strokeWidth="2"
              strokeOpacity="0.16"
            />
            <path
              d="M16 4 A 12 12 0 0 1 28 16"
              stroke={primaryColor}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>

          {/* Dynamic Center Stage Icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stageIndex}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <IconComponent
                className="size-3.5"
                style={{ color: primaryColor }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {/* Header Row: Stage Tag + Live Harmonic Wave */}
          <div className="flex items-center justify-between gap-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={stageIndex}
                initial={{ opacity: 0, x: isRtl ? 4 : -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRtl ? -4 : 4 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-1.5"
              >
                <span
                  className="px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider border shrink-0"
                  style={{
                    backgroundColor: `${secondaryColor || primaryColor}20`,
                    borderColor: `${primaryColor}35`,
                    color: primaryColor,
                    borderRadius: badgeRadius,
                  }}
                >
                  {isRtl ? current.badgeAr : current.badgeEn}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Live Harmonic Wave Equalizer Bars */}
            <div className="flex items-end gap-0.5 h-3 shrink-0 select-none">
              <span
                className="w-0.5 bg-primary rounded-none animate-[pulse_0.9s_ease-in-out_infinite]"
                style={{
                  backgroundColor: primaryColor,
                  height: "55%",
                  animationDelay: "0ms",
                }}
              />
              <span
                className="w-0.5 bg-primary rounded-none animate-[pulse_0.9s_ease-in-out_infinite]"
                style={{
                  backgroundColor: primaryColor,
                  height: "100%",
                  animationDelay: "180ms",
                }}
              />
              <span
                className="w-0.5 bg-primary rounded-none animate-[pulse_0.9s_ease-in-out_infinite]"
                style={{
                  backgroundColor: primaryColor,
                  height: "40%",
                  animationDelay: "360ms",
                }}
              />
            </div>
          </div>

          {/* Stage Explanation Text (smooth cross-fade) */}
          <div className="mt-1 min-h-[16px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={stageIndex}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.2 }}
                className="text-xs font-medium leading-snug break-words"
                style={{
                  color: isDarkBg ? "#F3F7F6" : "#10201F",
                }}
              >
                {isRtl ? current.textAr : current.textEn}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Micro Verification Subtext */}
          <div
            className="mt-1 flex items-center gap-1 font-mono text-[9px] opacity-65"
            style={{ color: isDarkBg ? "#8FA3A0" : "#4A5957" }}
          >
            <span
              className="size-1 inline-block shrink-0"
              style={{
                backgroundColor: primaryColor,
                borderRadius: isCurved ? "9999px" : "0px",
              }}
            />
            <span className="truncate">
              {isRtl
                ? "مستند إلى وثائق المتجر المعتمدة"
                : "Grounded in verified store records"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
