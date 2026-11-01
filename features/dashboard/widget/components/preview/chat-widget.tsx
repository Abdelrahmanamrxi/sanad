"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FileText,
  Sparkles,
  ArrowUpRight,
  Bot,
  MessageSquare,
  X,
} from "lucide-react";
import type { WidgetConfig, DevicePreview } from "../../types";
import { WidgetHeader } from "@/features/embed/components/widget-header";
import { WidgetInputBar } from "@/features/embed/components/widget-input-bar";
import { ThinkingIndicator } from "@/features/embed/components/thinking-indicator";
import { isDarkColor, getContrastTextColor } from "@/features/embed/utils";

interface ChatWidgetProps {
  config: WidgetConfig;
  device: DevicePreview;
}

interface SimulatedMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  time: string;
  citation?: {
    documentTitle: string;
    page?: number | string;
    highlightedExcerpt: string;
  };
}

export default function ChatWidget({ config, device }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isRtl = config.defaultLanguage === "ar";
  const isMobile = device === "mobile";

  const primaryColor = config.primaryColor || "#0E4741";
  const secondaryColor = config.secondaryColor || "#E2D9C8";
  const backgroundColor = config.backgroundColor || "#FAF6EE";
  const cornerRadius = config.cornerRadius ?? 24;
  const borderRadius = config.borderRadius ?? 1;

  // New archetype customization fields
  const containerShape = config.containerShape || "arch";
  const headerLayout = config.headerLayout || "hero";
  const avatarMode = config.avatarMode || "monogram";
  const avatarMonogram = config.avatarMonogram || "س";
  const borderStyle = config.borderStyle || "hairline";
  const citationStyle = config.citationStyle || "document-snippet";

  const isDarkBg = isDarkColor(backgroundColor);
  const bgText = isDarkBg ? "#F3F7F6" : "#10201F";
  const bgMutedText = isDarkBg
    ? "rgba(243, 247, 246, 0.65)"
    : "rgba(16, 32, 31, 0.65)";

  const primaryText = getContrastTextColor(primaryColor);
  const secondaryText = getContrastTextColor(secondaryColor);

  const surfaceCardBg = isDarkBg
    ? "rgba(255, 255, 255, 0.08)"
    : containerShape === "arch"
      ? "#F1ECE0"
      : "#FFFFFF";
  const inputBg = isDarkBg ? "rgba(255, 255, 255, 0.06)" : "#FFFFFF";

  const inputBorderAbove = isDarkBg ? `${primaryColor}45` : `${primaryColor}30`;
  const inputBorderBelow = isDarkBg ? `${primaryColor}35` : `${primaryColor}20`;
  const inputBarBorder = isInputFocused
    ? primaryColor
    : isDarkBg
      ? `${primaryColor}60`
      : `${primaryColor}35`;

  const isCurved = containerShape === "arch" || containerShape === "pill";

  // Pre-loaded realistic concierge sample messages demonstrating RAG highlight citations
  const initialDefaultMessages: SimulatedMessage[] = useMemo(() => {
    return [
      {
        id: "msg-welcome",
        role: "assistant",
        text:
          config.welcomeMessage ||
          (isRtl
            ? "أهلاً بك في عيادة النور التخصصية.. تحت أمرك في أي استفسار عن المواعيد والخدمات."
            : "Welcome to Al-Noor Clinic! How may I assist you with services and appointments today?"),
        time: isRtl ? "الآن" : "Just now",
      },
      {
        id: "msg-sample-user",
        role: "user",
        text: isRtl
          ? "بكام الكشف وهل فيه حجز مسبق؟"
          : "What are your consultation fees and do I need to book in advance?",
        time: isRtl ? "الآن" : "Just now",
      },
      {
        id: "msg-sample-bot",
        role: "assistant",
        text: isRtl
          ? "أهلاً بك! الكشف ٣٠٠ جنيه شامل الاستشارة والإعادة مجاناً خلال ١٤ يوم، والمواعيد يومياً من ٤ إلى ١٠ مساءً بحجز مسبق."
          : "Consultation is 300 EGP including a free follow-up within 14 days. We are open daily from 4 PM to 10 PM by reservation.",
        time: isRtl ? "الآن" : "Just now",
        citation: {
          documentTitle: isRtl
            ? "لائحة الأسعار والخدمات ٢٠٢٦.pdf"
            : "Services_Price_List_2026.pdf",
          page: 4,
          highlightedExcerpt: isRtl
            ? "الكشف العام: ٣٠٠ جنيه (شامل الإعادة والاستشارة مجاناً خلال أسبوعين)"
            : "General Consultation: 300 EGP (Includes free follow-up within 14 days)",
        },
      },
    ];
  }, [config.welcomeMessage, isRtl]);

  const [chatHistory, setChatHistory] = useState<SimulatedMessage[]>([]);

  const messages: SimulatedMessage[] = useMemo(() => {
    if (chatHistory.length === 0) {
      return initialDefaultMessages;
    }
    return [initialDefaultMessages[0], ...chatHistory];
  }, [chatHistory, initialDefaultMessages]);

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
      time: isRtl ? "الآن" : "Just now",
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let simulatedReply = isRtl
        ? "بناءً على وثائق المتجر المعتمدة: يمكنك استرجاع أو استبدال أي طلب خلال ١٤ يوماً من الاستلام بحالته الأصلية."
        : "According to our verified store policies: Items can be returned or exchanged within 14 days in original packaging.";

      let citation = {
        documentTitle: isRtl
          ? "سياسة الاستبدال والضمان.pdf"
          : "Return_Policy_2026.pdf",
        page: 2,
        highlightedExcerpt: isRtl
          ? "الاسترجاع متاح مجاناً خلال ١٤ يوم للمنتجات غير المستخدمة"
          : "Free returns available within 14 days for eligible unused products",
      };

      const lower = text.toLowerCase();
      if (
        lower.includes("shipping") ||
        lower.includes("delivery") ||
        text.includes("شحن") ||
        text.includes("توصيل")
      ) {
        simulatedReply = isRtl
          ? "التوصيل يستغرق من يومين إلى ٤ أيام عمل لجميع المحافظات، والشحن مجاني للطلبات فوق ٢٠٠ جنيه."
          : "Standard delivery takes 2 to 4 business days nationwide. Shipping is free for orders over 200 SAR.";
        citation = {
          documentTitle: isRtl
            ? "دليل الشحن والتوصيل.pdf"
            : "Shipping_Guide.pdf",
          page: 1,
          highlightedExcerpt: isRtl
            ? "الشحن مجاني لجميع الطلبات أكثر من ٢٠٠ جنيه"
            : "Free shipping for all orders over 200 SAR",
        };
      } else if (
        lower.includes("payment") ||
        lower.includes("installment") ||
        text.includes("دفع") ||
        text.includes("تقسيط")
      ) {
        simulatedReply = isRtl
          ? "نقبل الدفع عند الاستلام، البطاقات البنكية، والمحافظ الإلكترونية (فودافون كاش، إنستاباي) بدون رسوم إضافية."
          : "We accept credit cards, Apple Pay, and Tamara 4-installment plans with 0% interest.";
        citation = {
          documentTitle: isRtl
            ? "طرق الدفع والتقسيط.pdf"
            : "Payment_Methods.pdf",
          page: 3,
          highlightedExcerpt: isRtl
            ? "الدفع متاح عبر فودافون كاش وإنستاباي بدون أي عمولة"
            : "Installments available with 0% interest via approved gateways",
        };
      }

      messageCounterRef.current += 1;
      const botReply: SimulatedMessage = {
        id: `bot-${messageCounterRef.current}`,
        role: "assistant",
        text: simulatedReply,
        time: isRtl ? "الآن" : "Just now",
        citation,
      };

      setChatHistory((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 2000);
  };

  // Determine container shape curvature
  const containerBorderRadius = isMobile
    ? "0px"
    : containerShape === "arch"
      ? "195px 195px 28px 28px"
      : containerShape === "pill"
        ? "28px"
        : "0px";

  // Determine container border & shadow based on borderStyle
  const isBrutalist = borderStyle === "hard-brutalist";
  const isGold = borderStyle === "accent-gold";
  const isNone = borderStyle === "none";

  const containerBorderColor = isBrutalist
    ? isDarkBg
      ? "#334E4C"
      : "#1E1E1E"
    : isGold
      ? isDarkBg
        ? "#6E5B37"
        : "#E5D5B8"
      : isDarkBg
        ? `${primaryColor}55`
        : `${primaryColor}35`;

  const containerBorderWidth = isNone
    ? "0px"
    : isBrutalist
      ? "2px"
      : `${Math.max(1, borderRadius)}px`;

  const containerBoxShadow = isBrutalist
    ? isDarkBg
      ? "5px 5px 0px #334E4C"
      : "5px 5px 0px #1E1E1E"
    : isDarkBg
      ? "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
      : "0 25px 50px -12px rgba(0, 0, 0, 0.25)";

  const launcherText =
    config.launcherText ||
    (isRtl
      ? containerShape === "arch"
        ? "تحت أمرك، اسألني"
        : "تحدث معنا"
      : "Chat with us");

  return (
    <>
      {/* ──────────────── 1. OPEN CHAT DRAWER PREVIEW ──────────────── */}
      {isOpen && (
        <div
          className={`z-50 flex flex-col transition-all overflow-hidden ${
            isMobile
              ? "absolute inset-0 h-full w-full border-none"
              : `absolute bottom-5 ${
                  config.position === "bottom-left" ? "left-5" : "right-5"
                } w-[390px] h-[580px]`
          }`}
          style={{
            direction: isRtl ? "rtl" : "ltr",
            borderRadius: containerBorderRadius,
            borderWidth: containerBorderWidth,
            borderColor: containerBorderColor,
            borderStyle: isNone ? "none" : "solid",
            boxShadow: containerBoxShadow,
            backgroundColor,
            color: bgText,
          }}
        >
          {/* ── Inner Hairline Contour for Egyptian/Andalusian Arch ── */}
          {containerShape === "arch" && !isMobile && (
            <div
              className="pointer-events-none absolute inset-1.5 transition-all select-none z-10"
              style={{
                borderRadius: "188px 188px 24px 24px",
                border: `1px solid ${
                  isDarkBg ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"
                }`,
              }}
            />
          )}

          {/* ── Widget Header ── */}
          <WidgetHeader
            botName={config.botName}
            subtitle={config.subtitle}
            primaryColor={primaryColor}
            primaryText={primaryText}
            secondaryColor={secondaryColor}
            secondaryText={secondaryText}
            backgroundColor={backgroundColor}
            isDarkBg={isDarkBg}
            cornerRadius={cornerRadius}
            containerShape={containerShape}
            headerLayout={headerLayout}
            avatarMode={avatarMode}
            avatarMonogram={avatarMonogram}
            isRtl={isRtl}
            hasMessages={messages.length > 1}
            onRequestHumanSupport={() => {
              const userMsg: SimulatedMessage = {
                id: `usr-${Date.now()}`,
                role: "user",
                text: isRtl
                  ? "ممكن أكلم حد من خدمة العملاء؟"
                  : "Can I speak to someone from support?",
                time: isRtl ? "الآن" : "Just now",
              };
              const botMsg: SimulatedMessage = {
                id: `bot-${Date.now()}`,
                role: "assistant",
                text: isRtl
                  ? "تحت أمرك! يسعدنا تواصلك، سيتواصل معك أحد ممثلينا خلال دقائق معدودة."
                  : "Certainly! One of our team specialists will reach out to you within minutes.",
                time: isRtl ? "الآن" : "Just now",
              };
              setChatHistory((prev) => [...prev, userMsg, botMsg]);
            }}
            onClearChat={() => setChatHistory([])}
            onMinimize={() => setIsOpen(false)}
            onClose={() => setIsOpen(false)}
          />

          {/* ── Messages Scroll Body ── */}
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3.5 select-text"
            style={{
              backgroundColor,
              color: bgText,
            }}
          >
            {messages.map((msg) => {
              const isBot = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 items-start min-w-0 ${
                    isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  {isBot && (
                    <div
                      className={`size-7 shrink-0 flex items-center justify-center font-bold text-xs shadow-xs mt-0.5 border ${
                        isCurved ? "rounded-full" : containerShape === "square" ? "rounded-none" : ""
                      }`}
                      style={{
                        backgroundColor: primaryColor,
                        color: primaryText,
                        borderColor: `${primaryColor}40`,
                        borderRadius: isCurved ? "9999px" : containerShape === "square" ? "0px" : `${Math.min(cornerRadius, 6)}px`,
                      }}
                    >
                      {avatarMode === "monogram" ? (
                        <span className="text-[11px] leading-none select-none">
                          {avatarMonogram || "س"}
                        </span>
                      ) : (
                        <Bot className="size-3.5" />
                      )}
                    </div>
                  )}

                  <div
                    className="max-w-[85%] min-w-0 p-3 text-xs font-sans leading-relaxed shadow-2xs border overflow-hidden"
                    style={
                      isBot
                        ? {
                            backgroundColor: surfaceCardBg,
                            color: bgText,
                            borderColor: isDarkBg
                              ? "rgba(255, 255, 255, 0.12)"
                              : `${primaryColor}25`,
                            borderRadius: isCurved
                              ? isRtl
                                ? "18px 4px 18px 18px"
                                : "4px 18px 18px 18px"
                              : containerShape === "square"
                                ? "0px"
                                : `${Math.min(cornerRadius, 12)}px`,
                            borderLeftWidth: isRtl ? "1px" : "3px",
                            borderRightWidth: isRtl ? "3px" : "1px",
                            borderLeftColor: isRtl
                              ? isDarkBg
                                ? "rgba(255,255,255,0.12)"
                                : `${primaryColor}25`
                              : secondaryColor || primaryColor,
                            borderRightColor: isRtl
                              ? secondaryColor || primaryColor
                              : isDarkBg
                                ? "rgba(255,255,255,0.12)"
                                : `${primaryColor}25`,
                          }
                        : {
                            backgroundColor: primaryColor,
                            color: primaryText,
                            borderColor: `${primaryColor}60`,
                            borderRadius: isCurved
                              ? isRtl
                                ? "18px 18px 4px 18px"
                                : "18px 18px 18px 4px"
                              : containerShape === "square"
                                ? "0px"
                                : `${Math.min(cornerRadius, 12)}px`,
                          }
                    }
                    dir="auto"
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                    {/* Verified Document Name Badge (PRO - when citationStyle is document-snippet) */}
                    {isBot && msg.citation && citationStyle === "document-snippet" && (
                      <div className="mt-2.5 pt-2 border-t border-black/10 dark:border-white/10 w-full min-w-0 overflow-hidden not-prose select-none">
                        <div
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 border text-[11px] font-sans font-medium min-w-0 max-w-full shadow-2xs"
                          style={{
                            backgroundColor: isDarkBg ? "rgba(255, 255, 255, 0.06)" : `${primaryColor}0D`,
                            borderColor: isDarkBg ? "rgba(255, 255, 255, 0.12)" : `${primaryColor}25`,
                            color: isDarkBg ? "#F3F7F6" : "#10201F",
                            borderRadius: isCurved ? "4px" : "0px",
                          }}
                          title={msg.citation.documentTitle}
                        >
                          <FileText
                            className="size-3.5 shrink-0"
                            style={{ color: primaryColor }}
                          />
                          <span className="truncate min-w-0">
                            {msg.citation.documentTitle}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Compact Citation footer (when citationStyle is compact) */}
                    {isBot && msg.citation && citationStyle === "compact" && (
                      <div className="mt-2 pt-1.5 border-t border-black/10 dark:border-white/10 flex items-center gap-1.5 text-[11px] font-sans text-muted-foreground not-prose select-none min-w-0 max-w-full overflow-hidden">
                        <FileText className="size-3 shrink-0" style={{ color: primaryColor }} />
                        <span className="truncate min-w-0" title={msg.citation.documentTitle}>
                          {isRtl ? "المصدر:" : "Source:"} {msg.citation.documentTitle}
                        </span>
                      </div>
                    )}

                    <span
                      className="block mt-1.5 font-mono text-[8px] select-none"
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

            {/* AI Responding / Thinking Indicator */}
            {isTyping && (
              <div className="flex gap-2 items-start justify-start">
                <div
                  className="size-7 shrink-0 flex items-center justify-center text-xs font-bold border shadow-xs mt-0.5"
                  style={{
                    backgroundColor: primaryColor,
                    color: primaryText,
                    borderColor: `${primaryColor}40`,
                    borderRadius: isCurved
                      ? "9999px"
                      : containerShape === "square"
                        ? "0px"
                        : `${Math.min(cornerRadius, 6)}px`,
                  }}
                >
                  {avatarMode === "monogram" ? (
                    <span className="text-[11px] leading-none select-none">
                      {avatarMonogram || "س"}
                    </span>
                  ) : (
                    <Bot className="size-3.5" />
                  )}
                </div>

                <div className="max-w-[85%] flex flex-col items-start">
                  <ThinkingIndicator
                    isRtl={isRtl}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    surfaceCardBg={surfaceCardBg}
                    isDarkBg={isDarkBg}
                    cornerRadius={cornerRadius}
                    containerShape={containerShape}
                    botName={config.botName}
                  />
                </div>
              </div>
            )}

            {/* Quick Starter Question Chips */}
            {config.starterQuestions.length > 0 && messages.length <= 2 && (
              <div className="pt-2 space-y-2">
                <div
                  className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider select-none"
                  style={{ color: bgMutedText }}
                >
                  <Sparkles className="size-3" style={{ color: primaryColor }} />
                  <span>{isRtl ? "أسئلة مقترحة:" : "Suggested Inquiries:"}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {config.starterQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(question)}
                      style={{
                        borderRadius: isCurved ? "14px" : containerShape === "square" ? "0px" : `${Math.min(cornerRadius, 8)}px`,
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
                            borderRadius: isCurved ? "9999px" : containerShape === "square" ? "0px" : `${Math.min(cornerRadius, 4)}px`,
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

          {/* ── Input Bar ── */}
          <WidgetInputBar
            inputText={inputText}
            onInputChange={setInputText}
            onSend={() => handleSendMessage()}
            inputRef={inputRef}
            isInputFocused={isInputFocused}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            isStreaming={isTyping}
            backgroundColor={backgroundColor}
            primaryColor={primaryColor}
            primaryText={primaryText}
            secondaryColor={secondaryColor}
            bgMutedText={bgMutedText}
            inputBg={inputBg}
            inputTextColor={bgText}
            inputBarBorder={inputBarBorder}
            inputBorderAbove={inputBorderAbove}
            isDarkBg={isDarkBg}
            isRtl={isRtl}
            cornerRadius={cornerRadius}
            borderRadius={borderRadius}
            containerShape={containerShape}
          />

          {/* ── Brand Attribution Footer ── */}
          <div
            className="border-t py-1.5 text-center font-mono text-[9px] select-none"
            style={{
              backgroundColor,
              borderTopColor: inputBorderBelow,
              borderTopWidth: `${Math.max(1, borderRadius)}px`,
              color: bgMutedText,
            }}
          >
            {isRtl ? "مدعوم بـ سند للذكاء الاصطناعي" : "Powered by Sanad AI Platform"}
          </div>
        </div>
      )}

      {/* ──────────────── 2. FLOATING LAUNCHER TRIGGER PREVIEW ──────────────── */}
      {(!isOpen || !isMobile) && (
        <div
          className={`absolute bottom-5 z-40 ${
            config.position === "bottom-left" ? "left-5" : "right-5"
          }`}
          style={{ direction: isRtl ? "rtl" : "ltr" }}
        >
          {containerShape === "arch" && config.launcherStyle === "badge" ? (
            /* Arched Dual-Pill Launcher */
            <div className="flex items-center gap-2 select-none">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer border"
                style={{
                  backgroundColor: secondaryColor,
                  color: secondaryText,
                  borderColor: `${primaryColor}35`,
                }}
              >
                <span className="size-2 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                <span className="font-heading font-semibold text-xs tracking-tight">
                  {launcherText}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="size-12 rounded-full flex items-center justify-center font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/20"
                style={{
                  backgroundColor: primaryColor,
                  color: primaryText,
                }}
                title={launcherText}
              >
                {avatarMode === "monogram" ? (
                  <span className="leading-none">{avatarMonogram || "س"}</span>
                ) : (
                  <Bot className="size-5.5" />
                )}
              </button>
            </div>
          ) : (
            /* Standard / Pill / Square Launcher */
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className={`group flex items-center gap-2.5 px-4 py-3 shadow-2xl hover:brightness-110 active:scale-95 transition-all cursor-pointer border ring-2 ring-black/10 ${
                isCurved ? "rounded-full" : containerShape === "square" ? "rounded-none" : ""
              }`}
              style={{
                backgroundColor: primaryColor,
                color: primaryText,
                borderRadius: isCurved ? "9999px" : containerShape === "square" ? "0px" : `${cornerRadius}px`,
                borderWidth: `${Math.max(1, borderRadius)}px`,
                borderColor: "rgba(255,255,255,0.25)",
              }}
              aria-label="Toggle Sanad Chat Widget"
            >
              <div className="relative flex items-center justify-center">
                {isOpen ? (
                  <X className="size-4" />
                ) : avatarMode === "monogram" ? (
                  <span className="font-bold text-base leading-none">
                    {avatarMonogram || "س"}
                  </span>
                ) : (
                  <MessageSquare className="size-4" />
                )}
                {!isOpen && (
                  <span
                    style={{
                      backgroundColor: secondaryColor,
                      borderRadius: isCurved ? "9999px" : containerShape === "square" ? "0px" : `${Math.min(cornerRadius, 4)}px`,
                    }}
                    className="absolute -top-1.5 -right-1.5 size-2.5 ring-2 ring-white/50 animate-pulse"
                  />
                )}
              </div>

              {config.launcherStyle === "badge" && (
                <span className="font-sans text-xs font-bold tracking-wide">
                  {launcherText}
                </span>
              )}
            </button>
          )}
        </div>
      )}
    </>
  );
}
