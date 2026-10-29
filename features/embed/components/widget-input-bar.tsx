"use client";

import React from "react";
import { Send, Loader2 } from "lucide-react";

export interface WidgetInputBarProps {
  inputText: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isInputFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isStreaming: boolean;
  placeholder?: string;
  backgroundColor: string;
  primaryColor: string;
  primaryText: string;
  secondaryColor: string;
  bgMutedText: string;
  inputBg: string;
  inputTextColor: string;
  inputBarBorder: string;
  inputBorderAbove: string;
  isDarkBg: boolean;
  isRtl: boolean;
  cornerRadius: number;
  borderRadius: number;
}

export function WidgetInputBar({
  inputText,
  onInputChange,
  onSend,
  inputRef,
  isInputFocused,
  onFocus,
  onBlur,
  onKeyDown,
  isStreaming,
  placeholder,
  backgroundColor,
  primaryColor,
  primaryText,
  secondaryColor,
  bgMutedText,
  inputBg,
  inputTextColor,
  inputBarBorder,
  inputBorderAbove,
  isDarkBg,
  isRtl,
  cornerRadius,
  borderRadius,
}: WidgetInputBarProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
      className="p-3 flex flex-col gap-2 shrink-0 border-t"
      style={{
        backgroundColor,
        borderTopColor: inputBorderAbove,
        borderTopWidth: `${Math.max(1, borderRadius)}px`,
      }}
    >
      <div
        style={{
          borderRadius: `${Math.min(cornerRadius, 8)}px`,
          borderWidth: `${Math.max(1, borderRadius)}px`,
          borderColor: inputBarBorder,
          boxShadow: isInputFocused
            ? `0 0 0 2px ${primaryColor}30`
            : isDarkBg
              ? "0 1px 3px rgba(0,0,0,0.3)"
              : "0 1px 3px rgba(0,0,0,0.05)",
          backgroundColor: inputBg,
        }}
        className="flex items-center gap-2 border transition-all p-1.5 shadow-2xs"
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          disabled={isStreaming}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={
            placeholder ||
            (isRtl ? "اكتب سؤالك هنا..." : "Type your question...")
          }
          dir="auto"
          style={{
            color: inputTextColor,
          }}
          className="flex-1 bg-transparent px-2.5 py-1.5 font-sans text-xs outline-none"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isStreaming}
          className="flex size-8 items-center justify-center transition-all disabled:opacity-40 shrink-0 cursor-pointer shadow-xs hover:brightness-110 active:scale-95"
          style={{
            backgroundColor: primaryColor,
            color: primaryText,
            borderRadius: `${Math.min(cornerRadius, 6)}px`,
          }}
          title={isRtl ? "إرسال" : "Send message"}
        >
          {isStreaming ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Send className="size-3.5" />
          )}
        </button>
      </div>

      {/* Status Bar below input with Secondary Color Pill Badge */}
      <div className="flex items-center justify-between px-1 text-[10px] font-mono select-none">
        <span style={{ color: bgMutedText }}>
          {isRtl ? "اضغط Enter للإرسال" : "Enter to send"}
        </span>
        <span
          className="font-medium flex items-center gap-1.5 px-2 py-0.5 border"
          style={{
            backgroundColor: `${secondaryColor}30`,
            borderColor: `${secondaryColor}70`,
            color: isDarkBg ? "#FFFFFF" : primaryColor,
            borderRadius: `${Math.min(cornerRadius, 4)}px`,
          }}
        >
          <span
            className="size-1.5 inline-block"
            style={{
              backgroundColor: primaryColor,
              borderRadius: `${Math.min(cornerRadius, 2)}px`,
            }}
          />
          {isRtl ? "إجابات فورية موثقة" : "Verified Instant Response"}
        </span>
      </div>
    </form>
  );
}
