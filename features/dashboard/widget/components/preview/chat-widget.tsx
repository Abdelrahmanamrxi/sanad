"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Minus,
  Send,
  MessageCircle,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import type { WidgetConfig, DevicePreview } from "../../types";

interface ChatWidgetProps {
  config: WidgetConfig;
  device: DevicePreview;
}

interface SimulatedMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  time: string;
}

// Function to calculate whether a color is perceptually dark
function isDarkColor(hex: string): boolean {
  if (!hex || hex === "transparent") return false;
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 140;
}

// Function to calculate readable text color based on background hex
function getContrastTextColor(hex: string): string {
  return isDarkColor(hex) ? "#FFFFFF" : "#10201F";
}

export default function ChatWidget({ config, device }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(0);

  // Chat conversation state (only user/bot messages added during interaction)
  const [chatHistory, setChatHistory] = useState<SimulatedMessage[]>([]);

  // The full message feed derives the initial welcome message directly during render.
  // This eliminates the cascading-render useEffect anti-pattern when config.welcomeMessage changes.
  const messages: SimulatedMessage[] = [
    {
      id: "initial-welcome",
      role: "assistant",
      text: config.welcomeMessage,
      time: "Just now",
    },
    ...chatHistory,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    messageCounterRef.current += 1;
    const userMsg: SimulatedMessage = {
      id: `user-${messageCounterRef.current}`,
      role: "user",
      text,
      time: "Just now",
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate smart grounded RAG response
    setTimeout(() => {
      let simulatedReply =
        "According to our verified store policies: Items can be returned or exchanged within 14 days of delivery. Free returns are available for eligible orders in original packaging.";

      const lower = text.toLowerCase();
      if (
        lower.includes("shipping") ||
        lower.includes("delivery") ||
        text.includes("شحن") ||
        text.includes("توصيل")
      ) {
        simulatedReply =
          "Standard delivery takes 2 to 4 business days nationwide. Shipping is free for all orders over 200 SAR.";
      } else if (
        lower.includes("payment") ||
        lower.includes("installment") ||
        text.includes("دفع") ||
        text.includes("تقسيط")
      ) {
        simulatedReply =
          "We accept all major credit cards, Mada, Apple Pay, Tabby, and Tamara 4-installment plans with 0% interest.";
      } else if (
        lower.includes("track") ||
        lower.includes("order") ||
        text.includes("تتبع") ||
        text.includes("طلب")
      ) {
        simulatedReply =
          "You can track your order in real-time by clicking the tracking link sent to your SMS or entering your order ID on our tracking page.";
      }

      messageCounterRef.current += 1;
      const botReply: SimulatedMessage = {
        id: `bot-${messageCounterRef.current}`,
        role: "assistant",
        text: simulatedReply,
        time: "Just now",
      };

      setChatHistory((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 700);
  };

  const isRtl = config.defaultLanguage === "ar";
  const isMobile = device === "mobile";

  const primaryColor = config.primaryColor || "#0F5C55";
  const secondaryColor = config.secondaryColor || "#D3E6E2";
  const backgroundColor = config.backgroundColor || "#FFFFFF";
  const cornerRadius = config.cornerRadius ?? 0;
  const borderRadius = config.borderRadius ?? 1;

  const isDarkBg = isDarkColor(backgroundColor);
  const bgText = isDarkBg ? "#F3F7F6" : "#10201F";
  const bgMutedText = isDarkBg
    ? "rgba(243, 247, 246, 0.65)"
    : "rgba(16, 32, 31, 0.65)";

  const primaryText = getContrastTextColor(primaryColor);
  const secondaryText = getContrastTextColor(secondaryColor);

  // Surface colors that harmonize with backgroundColor
  const surfaceCardBg = isDarkBg ? "rgba(255, 255, 255, 0.08)" : "#FFFFFF";
  const inputBg = isDarkBg ? "rgba(255, 255, 255, 0.06)" : "#FFFFFF";

  // Dynamic borders above, below, and around the input bar
  const inputBorderAbove = isDarkBg ? `${primaryColor}45` : `${primaryColor}30`;
  const inputBorderBelow = isDarkBg ? `${primaryColor}35` : `${primaryColor}20`;
  const inputBarBorder = isInputFocused
    ? primaryColor
    : isDarkBg
      ? `${primaryColor}60`
      : `${primaryColor}35`;

  return (
    <>
      {/* ──────────────── 1. OPEN CHAT DRAWER ──────────────── */}
      {isOpen && (
        <div
          className={`z-50 flex flex-col shadow-2xl transition-all ${
            isMobile
              ? "absolute inset-0 h-full w-full border-none"
              : `absolute bottom-5 ${
                  config.position === "bottom-left" ? "left-5" : "right-5"
                } w-[390px] h-[560px] border ring-1 ring-black/10 dark:ring-white/10`
          }`}
          style={{
            direction: isRtl ? "rtl" : "ltr",
            borderRadius: isMobile ? 0 : `${cornerRadius}px`,
            borderWidth: isMobile ? 0 : `${borderRadius}px`,
            borderColor: isDarkBg ? `${primaryColor}50` : `${primaryColor}30`,
            backgroundColor: backgroundColor,
            color: bgText,
            overflow: "hidden",
          }}
        >
          {/* ── Widget Header ── */}
          <div
            className="flex items-center justify-between p-3.5 shrink-0 shadow-md transition-colors select-none"
            style={{
              backgroundColor: primaryColor,
              color: primaryText,
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.15) 100%)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                style={{
                  borderRadius: `${Math.min(cornerRadius, 8)}px`,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderColor: "rgba(255,255,255,0.3)",
                  color: primaryText,
                }}
                className="relative flex size-9 items-center justify-center border shrink-0 shadow-xs"
              >
                <Bot className="size-4" />
                <span
                  style={{ borderRadius: `${Math.min(cornerRadius, 4)}px` }}
                  className="absolute -top-1 -right-1 size-2 bg-emerald-400 ring-2 ring-black/40 animate-pulse"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span
                    className="font-heading text-xs font-bold tracking-tight leading-tight"
                    style={{ color: primaryText }}
                  >
                    {config.botName || "Sanad AI Support"}
                  </span>
                  <span
                    className="px-1.5 py-0.2 font-mono text-[9px] uppercase tracking-wider font-bold shrink-0 border shadow-2xs"
                    style={{
                      backgroundColor: secondaryColor,
                      color: secondaryText,
                      borderColor: `${primaryText}30`,
                      borderRadius: `${Math.min(cornerRadius, 4)}px`,
                    }}
                  >
                    AI AGENT
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    style={{ borderRadius: `${Math.min(cornerRadius, 2)}px` }}
                    className="size-1.5 bg-emerald-400 inline-block"
                  />
                  <p
                    className="font-sans text-[10px] truncate max-w-[210px] leading-none opacity-90"
                    style={{ color: primaryText }}
                  >
                    {config.subtitle || "Instant verified answers"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {!isMobile && (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    borderRadius: `${Math.min(cornerRadius, 4)}px`,
                    color: primaryText,
                  }}
                  className="p-1 hover:bg-black/10 transition-colors cursor-pointer opacity-85 hover:opacity-100"
                  title="Minimize Chat"
                >
                  <Minus className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                style={{
                  borderRadius: `${Math.min(cornerRadius, 4)}px`,
                  color: primaryText,
                }}
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-black/10 transition-colors cursor-pointer opacity-85 hover:opacity-100"
                title="Close Chat"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* ── Messages Scroll Body ── */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{
              backgroundColor: backgroundColor,
              color: bgText,
            }}
          >
            {messages.map((msg) => {
              const isBot = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 items-start ${
                    isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  {isBot && (
                    <div
                      className="size-7 shrink-0 flex items-center justify-center text-[10px] shadow-xs mt-0.5"
                      style={{
                        backgroundColor: primaryColor,
                        color: primaryText,
                        borderRadius: `${Math.min(cornerRadius, 6)}px`,
                      }}
                    >
                      <Bot className="size-4" />
                    </div>
                  )}

                  <div
                    className="max-w-[85%] p-3 text-xs font-sans leading-relaxed shadow-2xs border"
                    style={
                      isBot
                        ? {
                            borderRadius: `${Math.min(cornerRadius, 12)}px`,
                            backgroundColor: surfaceCardBg,
                            color: bgText,
                            borderColor: isDarkBg
                              ? "rgba(255, 255, 255, 0.12)"
                              : "rgba(0, 0, 0, 0.08)",
                            borderLeftColor: isRtl
                              ? isDarkBg
                                ? "rgba(255,255,255,0.12)"
                                : "rgba(0,0,0,0.08)"
                              : primaryColor,
                            borderRightColor: isRtl
                              ? primaryColor
                              : isDarkBg
                                ? "rgba(255,255,255,0.12)"
                                : "rgba(0,0,0,0.08)",
                            borderLeftWidth: isRtl ? "1px" : "3px",
                            borderRightWidth: isRtl ? "3px" : "1px",
                          }
                        : {
                            backgroundColor: primaryColor,
                            color: primaryText,
                            borderRadius: `${Math.min(cornerRadius, 12)}px`,
                          }
                    }
                    dir="auto"
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    <span
                      className="block mt-1.5 font-mono text-[8px]"
                      style={{
                        color: isBot ? bgMutedText : "rgba(255,255,255,0.85)",
                      }}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div
                className="flex gap-2 items-center font-mono text-[10px] p-2 border w-fit"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  borderColor: `${primaryColor}30`,
                  color: primaryColor,
                  borderRadius: `${Math.min(cornerRadius, 6)}px`,
                }}
              >
                <span
                  className="size-1.5 animate-ping inline-block"
                  style={{ backgroundColor: primaryColor }}
                />
                <span>{config.botName} is reviewing...</span>
              </div>
            )}

            {/* Quick Starter Question Chips */}
            {config.starterQuestions.length > 0 && messages.length <= 2 && (
              <div className="pt-2 space-y-2">
                <div
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider select-none"
                  style={{ color: bgMutedText }}
                >
                  <Sparkles
                    className="size-3"
                    style={{ color: primaryColor }}
                  />
                  <span>Suggested Inquiries:</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {config.starterQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(question)}
                      style={{
                        borderRadius: `${Math.min(cornerRadius, 8)}px`,
                        borderColor: isDarkBg
                          ? "rgba(255, 255, 255, 0.12)"
                          : "rgba(0, 0, 0, 0.08)",
                        backgroundColor: surfaceCardBg,
                        color: bgText,
                      }}
                      className="group flex items-center justify-between text-start border hover:border-primary/60 p-2.5 font-sans text-xs hover:translate-x-0.5 transition-all shadow-2xs cursor-pointer"
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
                      <ArrowUpRight
                        className="size-3.5 transition-colors shrink-0 ms-1"
                        style={{ color: bgMutedText }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input Bar (with explicit borders above and below) ── */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 flex flex-col gap-2 shrink-0 border-t"
            style={{
              backgroundColor: backgroundColor,
              borderTopColor: inputBorderAbove,
              borderTopWidth: `${Math.max(1, borderRadius)}px`,
            }}
          >
            {/* The input's bar around div */}
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
                type="text"
                value={inputText}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your question here..."
                dir="auto"
                style={{ color: bgText }}
                className="flex-1 bg-transparent px-2.5 py-1.5 font-sans text-xs outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="flex size-8 items-center justify-center transition-all disabled:opacity-40 shrink-0 cursor-pointer shadow-xs hover:brightness-110 active:scale-95"
                style={{
                  backgroundColor: primaryColor,
                  color: primaryText,
                  borderRadius: `${Math.min(cornerRadius, 6)}px`,
                }}
                title="Send message"
              >
                <Send className="size-3.5" />
              </button>
            </div>

            {/* Status Bar below input with Secondary Color Pill Badge */}
            <div className="flex items-center justify-between px-1 text-[10px] font-mono">
              <span style={{ color: bgMutedText }}>Enter to send</span>
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
                  className="size-1.5 rounded-full inline-block"
                  style={{ backgroundColor: primaryColor }}
                />
                Verified Instant Response
              </span>
            </div>
          </form>

          {/* ── Brand Attribution Footer (with border below input bar) ── */}
          <div
            className="border-t py-1.5 text-center font-mono text-[9px] select-none"
            style={{
              backgroundColor: backgroundColor,
              borderTopColor: inputBorderBelow,
              borderTopWidth: `${Math.max(1, borderRadius)}px`,
              color: bgMutedText,
            }}
          >
            Powered by Sanad AI Platform
          </div>
        </div>
      )}

      {/* ──────────────── 2. FLOATING LAUNCHER TRIGGER ──────────────── */}
      {(!isOpen || !isMobile) && (
        <div
          className={`absolute bottom-5 z-40 ${
            config.position === "bottom-left" ? "left-5" : "right-5"
          }`}
        >
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="group flex items-center gap-2.5 px-4 py-3 shadow-2xl hover:brightness-110 active:scale-95 transition-all cursor-pointer border ring-2 ring-black/10"
            style={{
              backgroundColor: primaryColor,
              color: primaryText,
              borderRadius: `${cornerRadius}px`,
              borderWidth: `${borderRadius}px`,
              borderColor: "rgba(255,255,255,0.25)",
            }}
            aria-label="Toggle Sanad Chat Widget"
          >
            <div className="relative flex items-center justify-center">
              {isOpen ? (
                <X className="size-4" />
              ) : (
                <MessageCircle className="size-4" />
              )}
              {!isOpen && (
                <span
                  style={{
                    backgroundColor: secondaryColor,
                    borderRadius: `${Math.min(cornerRadius, 4)}px`,
                  }}
                  className="absolute -top-1.5 -right-1.5 size-2.5 ring-2 ring-white/50 animate-pulse"
                />
              )}
            </div>

            {config.launcherStyle === "badge" && (
              <span className="font-sans text-xs font-bold tracking-wide">
                {config.launcherText || "Chat with us"}
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
}
