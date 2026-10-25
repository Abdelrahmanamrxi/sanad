import {useState,useEffect} from 'react'
import { Sparkles,Search, ShieldCheck } from 'lucide-react';

/**
 * High-engagement Thinking Indicator that cycles through intelligent retrieval stages
 * Keeps the customer engaged, reducing bounces while the model grounds the answer.
 */

export function ThinkingIndicator({
  isRtl,
  primaryColor,
  secondaryColor,
  surfaceCardBg,
  isDarkBg,
  cornerRadius,
}: {
  isRtl: boolean;
  primaryColor: string;
  secondaryColor: string;
  surfaceCardBg: string;
  isDarkBg: boolean;
  cornerRadius: number;
}) {
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    {
      badgeEn: "SEARCHING POLICIES",
      badgeAr: "مراجعة السياسات",
      textEn: "Checking verified store catalog & documentation...",
      textAr: "البحث في وثائق وسياسات المتجر المعتمدة...",
      icon: Search,
    },
    {
      badgeEn: "VERIFYING CONTEXT",
      badgeAr: "التحقق والتوثيق",
      textEn: "Grounding accurate answer with store records...",
      textAr: "التحقق من صحة ومطابقة البيانات المعتمدة...",
      icon: ShieldCheck,
    },
    {
      badgeEn: "FORMULATING ANSWER",
      badgeAr: "صياغة الرد",
      textEn: "Formulating direct, personalized support response...",
      textAr: "صياغة الرد المخصص لاستفسارك الآن...",
      icon: Sparkles,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [stages.length]);

  const current = stages[stageIndex];
  const IconComponent = current.icon;

  return (
    <div
      className="relative overflow-hidden border shadow-sm p-3 text-xs w-full max-w-[340px]"
      style={{
        backgroundColor: surfaceCardBg,
        borderColor: isDarkBg
          ? "rgba(255, 255, 255, 0.15)"
          : `${primaryColor}30`,
        borderRadius: `${Math.min(cornerRadius, 10)}px`,
      }}
    >
      {/* Dynamic Animated Shimmer Line */}
      <div
        className="absolute top-0 inset-x-0 h-[2px] opacity-80"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent 0%, ${primaryColor} 50%, transparent 100%)`,
          backgroundSize: "200% 100%",
          animation: "shimmerTrack 1.8s infinite linear",
        }}
      />

      <div className="flex items-start gap-2.5">
        <div
          className="size-7 shrink-0 flex items-center justify-center border shadow-2xs mt-0.5"
          style={{
            backgroundColor: `${primaryColor}15`,
            borderColor: `${primaryColor}35`,
            color: primaryColor,
            borderRadius: `${Math.min(cornerRadius, 6)}px`,
          }}
        >
          <IconComponent className="size-3.5 animate-pulse" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="px-1.5 py-0.2 font-mono text-[8px] font-bold uppercase tracking-wider border shrink-0"
              style={{
                backgroundColor: `${secondaryColor}40`,
                borderColor: `${primaryColor}30`,
                color: primaryColor,
                borderRadius: `${Math.min(cornerRadius, 3)}px`,
              }}
            >
              {isRtl ? current.badgeAr : current.badgeEn}
            </span>

            <span className="flex items-center gap-0.5">
              <span
                className="size-1 animate-pulse inline-block"
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: `${Math.min(cornerRadius, 1)}px`,
                }}
              />
              <span
                className="size-1 animate-pulse inline-block [animation-delay:150ms]"
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: `${Math.min(cornerRadius, 1)}px`,
                }}
              />
              <span
                className="size-1 animate-pulse inline-block [animation-delay:300ms]"
                style={{
                  backgroundColor: primaryColor,
                  borderRadius: `${Math.min(cornerRadius, 1)}px`,
                }}
              />
            </span>
          </div>

          <p className="mt-1 text-[11px] leading-tight font-medium opacity-90 truncate">
            {isRtl ? current.textAr : current.textEn}
          </p>
        </div>
      </div>
    </div>
  );
}
