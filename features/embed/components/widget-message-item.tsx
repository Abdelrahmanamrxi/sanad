"use client";

import React from "react";
import { Bot, AlertCircle, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type ChatMessage } from "@/features/embed/types";
import { ThinkingIndicator } from "./thinking-indicator";
import { LeadCaptureCard } from "./lead-capture-card";

export interface WidgetMessageItemProps {
  msg: ChatMessage;
  sessionToken: string | null;
  primaryColor: string;
  primaryText: string;
  secondaryColor: string;
  surfaceCardBg: string;
  bgText: string;
  bgMutedText: string;
  inputBg: string;
  inputTextColor: string;
  isDarkBg: boolean;
  isRtl: boolean;
  cornerRadius: number;
  originPage?: string;
  isStreaming: boolean;
  onRetry?: (text: string, id: string) => void;
  onScrollToBottom: () => void;
}

export function WidgetMessageItem({
  msg,
  sessionToken,
  primaryColor,
  primaryText,
  secondaryColor,
  surfaceCardBg,
  bgText,
  bgMutedText,
  inputBg,
  inputTextColor,
  isDarkBg,
  isRtl,
  cornerRadius,
  originPage,
  isStreaming,
  onRetry,
  onScrollToBottom,
}: WidgetMessageItemProps) {
  const isBot = msg.role === "assistant";
  const isError = Boolean(msg.error);
  const hasContent = Boolean(msg.text && msg.text.trim().length > 0);
  const hasLeadTrigger = msg.text.includes("[[SHOW_LEAD_FORM]]");
  const cleanMarkdownText = msg.text.replace("[[SHOW_LEAD_FORM]]", "").trim();

  return (
    <div
      className={`flex gap-2 items-start ${
        isBot ? "justify-start" : "justify-end"
      }`}
    >
      {isBot && (
        <div
          className={`size-7 shrink-0 flex items-center justify-center text-[10px] border shadow-xs mt-0.5 ${
            isError
              ? "bg-destructive/15 text-destructive border-destructive/40"
              : ""
          }`}
          style={{
            ...(!isError && {
              backgroundColor: primaryColor,
              color: primaryText,
              borderColor: `${primaryColor}40`,
            }),
            borderRadius: `${Math.min(cornerRadius, 6)}px`,
          }}
        >
          {isError ? (
            <AlertCircle className="size-3.5" />
          ) : (
            <Bot className="size-3.5" />
          )}
        </div>
      )}

      <div
        className={`max-w-[85%] flex flex-col ${
          isBot ? "items-start" : "items-end"
        }`}
      >
        {!hasContent && msg.isStreaming ? (
          /* Thinking indicator stage while generating */
          <ThinkingIndicator
            isRtl={isRtl}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            surfaceCardBg={surfaceCardBg}
            isDarkBg={isDarkBg}
            cornerRadius={cornerRadius}
          />
        ) : isError ? (
          /* Dedicated Red Error Bubble */
          <div
            className="p-3 text-xs leading-relaxed border shadow-xs bg-destructive/10 text-destructive border-destructive/40"
            style={{
              borderRadius: `${Math.min(cornerRadius, 12)}px`,
              borderLeftWidth: isRtl ? "1px" : "3px",
              borderRightWidth: isRtl ? "3px" : "1px",
              borderLeftColor: isRtl
                ? "rgba(214, 69, 69, 0.3)"
                : "var(--color-destructive, #D64545)",
              borderRightColor: isRtl
                ? "var(--color-destructive, #D64545)"
                : "rgba(214, 69, 69, 0.3)",
            }}
            dir="auto"
          >
            <div className="space-y-2">
              <p className="font-medium text-xs leading-relaxed select-text">
                {msg.text.trim()}
              </p>
              {msg.retryText && onRetry && (
                <button
                  type="button"
                  disabled={isStreaming}
                  onClick={() => onRetry(msg.retryText!, msg.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-destructive text-white hover:bg-destructive/90 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  style={{
                    borderRadius: `${Math.min(cornerRadius, 4)}px`,
                  }}
                >
                  <RefreshCw className="size-3 shrink-0" />
                  <span>{isRtl ? "إعادة المحاولة" : "Try again"}</span>
                </button>
              )}
            </div>

            {msg.time && (
              <span className="block mt-1.5 font-mono text-[8px] select-none opacity-70">
                {msg.time}
              </span>
            )}
          </div>
        ) : (
          /* Standard Message Bubble */
          <div
            className="p-3 text-xs leading-relaxed border shadow-xs"
            style={{
              backgroundColor: isBot
                ? isDarkBg
                  ? "rgba(255, 255, 255, 0.08)"
                  : surfaceCardBg
                : primaryColor,
              color: isBot ? bgText : primaryText,
              borderColor: isBot
                ? isDarkBg
                  ? "rgba(255, 255, 255, 0.12)"
                  : `${primaryColor}25`
                : `${primaryColor}60`,
              borderRadius: `${Math.min(cornerRadius, 12)}px`,
              borderLeftWidth: isBot ? (isRtl ? "1px" : "3px") : "1px",
              borderRightWidth: isBot ? (isRtl ? "3px" : "1px") : "1px",
              borderLeftColor: isBot
                ? isRtl
                  ? isDarkBg
                    ? "rgba(255,255,255,0.12)"
                    : `${primaryColor}25`
                  : primaryColor
                : `${primaryColor}60`,
              borderRightColor: isBot
                ? isRtl
                  ? primaryColor
                  : isDarkBg
                  ? "rgba(255,255,255,0.12)"
                  : `${primaryColor}25`
                : `${primaryColor}60`,
            }}
            dir="auto"
          >
            {isBot ? (
              <div className="prose prose-xs max-w-none text-xs leading-relaxed break-words">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-1.5 last:mb-0 leading-relaxed">
                        {children}
                      </p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-inherit">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-inherit">{children}</em>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc ps-4 mb-1.5 space-y-0.5">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal ps-4 mb-1.5 space-y-0.5">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    code: ({ children }) => (
                      <code
                        className="px-1 py-0.5 font-mono text-[10px] bg-black/10 dark:bg-white/10"
                        style={{
                          borderRadius: `${Math.min(cornerRadius, 3)}px`,
                        }}
                      >
                        {children}
                      </code>
                    ),
                    a: ({ href, children }) => {
                      const isSafe =
                        href &&
                        (href.startsWith("http://") ||
                          href.startsWith("https://") ||
                          href.startsWith("mailto:") ||
                          href.startsWith("tel:"));
                      if (!isSafe) {
                        return <span>{children}</span>;
                      }
                      return (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline font-medium hover:opacity-80"
                          style={{ color: primaryColor }}
                        >
                          {children}
                        </a>
                      );
                    },
                  }}
                >
                  {cleanMarkdownText}
                </ReactMarkdown>

                {/* Animated Live Streaming Cursor */}
                {msg.isStreaming && (
                  <span
                    className="inline-block ms-1 size-1.5 align-middle bg-primary"
                    style={{
                      backgroundColor: primaryColor,
                      borderRadius: `${Math.min(cornerRadius, 1)}px`,
                      animation: "cursorPulse 0.8s infinite ease-in-out",
                    }}
                  />
                )}

                {/* Inline Lead Capture Card if triggered */}
                {hasLeadTrigger && sessionToken && (
                  <LeadCaptureCard
                    sessionToken={sessionToken}
                    primaryColor={primaryColor}
                    primaryText={primaryText}
                    surfaceCardBg={surfaceCardBg}
                    bgText={bgText}
                    inputBg={inputBg}
                    inputTextColor={inputTextColor}
                    cornerRadius={cornerRadius}
                    isDarkBg={isDarkBg}
                    isRtl={isRtl}
                    originPage={originPage}
                    onSuccess={onScrollToBottom}
                  />
                )}
              </div>
            ) : (
              <p className="whitespace-pre-line break-words leading-relaxed">
                {msg.text.trim()}
              </p>
            )}

            {msg.time && (
              <span
                className="block mt-1 font-mono text-[8px] select-none"
                style={{
                  color: isBot
                    ? bgMutedText
                    : "rgba(255, 255, 255, 0.85)",
                }}
              >
                {msg.time}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
