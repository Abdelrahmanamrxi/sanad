"use client";

import React from "react";
import { Sparkles, Send } from "lucide-react";

export interface WidgetStarterQuestionsProps {
  questions: string[];
  isStreaming: boolean;
  surfaceCardBg: string;
  bgText: string;
  bgMutedText: string;
  primaryColor: string;
  secondaryColor: string;
  secondaryText: string;
  isDarkBg: boolean;
  isRtl: boolean;
  cornerRadius: number;
  borderRadius: number;
  onSelectQuestion: (question: string) => void;
}

export function WidgetStarterQuestions({
  questions,
  isStreaming,
  surfaceCardBg,
  bgText,
  bgMutedText,
  primaryColor,
  secondaryColor,
  secondaryText,
  isDarkBg,
  isRtl,
  cornerRadius,
  borderRadius,
  onSelectQuestion,
}: WidgetStarterQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="pt-2 space-y-2">
      <div
        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider select-none font-mono"
        style={{ color: bgMutedText }}
      >
        <Sparkles className="size-3" style={{ color: primaryColor }} />
        <span>{isRtl ? "أسئلة مقترحة" : "Suggested inquiries"}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        {questions.map((question, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isStreaming}
            onClick={() => onSelectQuestion(question)}
            className="w-full text-start px-3 py-2 text-xs border transition-all cursor-pointer flex items-center justify-between group hover:border-primary/60 shadow-2xs disabled:opacity-50"
            style={{
              backgroundColor: surfaceCardBg,
              color: bgText,
              borderColor: isDarkBg
                ? "rgba(255, 255, 255, 0.1)"
                : `${primaryColor}25`,
              borderRadius: `${Math.min(cornerRadius, 8)}px`,
              borderWidth: `${Math.max(1, borderRadius)}px`,
            }}
            dir="auto"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="flex size-5 shrink-0 items-center justify-center font-mono text-[10px] font-bold border shadow-2xs"
                style={{
                  backgroundColor: secondaryColor,
                  color: secondaryText,
                  borderColor: `${primaryColor}40`,
                  borderRadius: `${Math.min(cornerRadius, 4)}px`,
                }}
              >
                {idx + 1}
              </span>
              <span className="truncate">{question}</span>
            </div>
            <Send className="size-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ms-1" />
          </button>
        ))}
      </div>
    </div>
  );
}
