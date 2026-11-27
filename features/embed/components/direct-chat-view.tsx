"use client";

import React, { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import type { EmbedChatWidgetProps } from "@/features/embed/types";
import { isDarkColor, getContrastTextColor } from "@/features/embed/utils";
import { useWidgetChat } from "@/features/embed/hooks/use-widget-chat";
import { WidgetHeader } from "@/features/embed/components/widget-header";
import { WidgetMessageItem } from "@/features/embed/components/widget-message-item";
import { WidgetStarterQuestions } from "@/features/embed/components/widget-starter-questions";
import { WidgetInputBar } from "@/features/embed/components/widget-input-bar";
import { WidgetFooter } from "@/features/embed/components/widget-footer";

export function DirectChatView({
  widgetKey,
  config,
  showBranding = true,
  planTier = "free",
  originPage = "/chat",
}: Omit<EmbedChatWidgetProps, "initialOpen" | "hostDomain">) {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const isRtl = config.defaultLanguage === "ar";
  const primaryColor = config.primaryColor || "#0F5C55";
  const secondaryColor = config.secondaryColor || "#D3E6E2";
  const backgroundColor = config.backgroundColor || "#FFFFFF";

  const containerShape = config.containerShape || "arch";
  const headerLayout = config.headerLayout || "hero";
  const avatarMode = config.avatarMode || "monogram";
  const avatarMonogram = config.avatarMonogram || "س";
  const borderStyle = config.borderStyle || "hairline";

  const isPro = planTier === "pro";
  const isFree = planTier === "free";
  const effectiveBotName = isFree
    ? "AI Assistant"
    : config.botName?.trim() || "AI Assistant";

  const rawCitationStyle = config.citationStyle || "none";
  const citationStyle =
    rawCitationStyle === "document-snippet" && !isPro
      ? "none"
      : rawCitationStyle;

  const cornerRadius =
    typeof config.cornerRadius === "number" ? config.cornerRadius : 0;
  const borderRadius =
    typeof config.borderRadius === "number" ? config.borderRadius : 1;

  const primaryText = getContrastTextColor(primaryColor);
  const secondaryText = getContrastTextColor(secondaryColor);
  const isDarkBg = isDarkColor(backgroundColor);
  const bgText = isDarkBg ? "#F3F7F6" : "#10201F";
  const bgMutedText = isDarkBg
    ? "rgba(243, 247, 246, 0.65)"
    : "rgba(16, 32, 31, 0.65)";

  const surfaceCardBg = isDarkBg ? "rgba(255, 255, 255, 0.08)" : "#FFFFFF";
  const inputBg = isDarkBg ? "rgba(255, 255, 255, 0.08)" : "#FFFFFF";
  const inputTextColor = isDarkBg ? "#F3F7F6" : "#10201F";

  const inputBorderAbove = isDarkBg ? `${primaryColor}45` : `${primaryColor}30`;
  const inputBorderBelow = isDarkBg ? `${primaryColor}35` : `${primaryColor}20`;
  const inputBarBorder = isInputFocused
    ? primaryColor
    : isDarkBg
      ? `${primaryColor}60`
      : `${primaryColor}35`;

  const {
    sessionToken,
    isInitializing,
    sessionError,
    brandingEnabled,
    inputText,
    setInputText,
    isStreaming,
    chatHistory,
    messages,
    messagesEndRef,
    inputRef,
    scrollToBottom,
    initSession,
    sendMessage,
    requestHumanSupport,
    clearChat,
  } = useWidgetChat({
    widgetKey,
    welcomeMessage: config.welcomeMessage,
    isRtl,
    showBranding,
    originPage,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const starterQuestions = Array.isArray(config.starterQuestions)
    ? config.starterQuestions
    : [];
  const showStarterQuestions =
    chatHistory.length === 0 && starterQuestions.length > 0;

  return (
    <main
      className="relative min-h-dvh w-full flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 bg-background font-sans select-none overflow-hidden"
      style={{
        direction: isRtl ? "rtl" : "ltr",
        backgroundImage: `radial-gradient(circle at 50% 0%, ${primaryColor}18 0%, transparent 60%)`,
      }}
    >
      <style>{`
        @keyframes cursorPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col w-full sm:max-w-[480px] md:max-w-[520px] h-dvh sm:h-[min(740px,calc(100dvh-3rem))] border overflow-hidden"
        style={{
          backgroundColor,
          color: bgText,
          borderColor:
            borderStyle === "hard-brutalist"
              ? isDarkBg
                ? "#334E4C"
                : "#1E1E1E"
              : borderStyle === "accent-gold"
                ? isDarkBg
                  ? "#6E5B37"
                  : "#E5D5B8"
                : isDarkBg
                  ? `${primaryColor}55`
                  : `${primaryColor}35`,
          borderRadius:
            containerShape === "arch"
              ? "195px 195px 28px 28px"
              : containerShape === "pill"
                ? "28px"
                : "0px",
          borderWidth:
            borderStyle === "none"
              ? "0px"
              : borderStyle === "hard-brutalist"
                ? "2px"
                : `${Math.max(1, borderRadius)}px`,
          boxShadow:
            borderStyle === "hard-brutalist"
              ? isDarkBg
                ? "5px 5px 0px #334E4C"
                : "5px 5px 0px #1E1E1E"
              : isDarkBg
                ? "0 25px 50px -12px rgba(0,0,0,0.65)"
                : "0 25px 50px -12px rgba(0,0,0,0.2)",
        }}
      >
        {containerShape === "arch" && (
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

        <WidgetHeader
          botName={effectiveBotName}
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
          hasMessages={chatHistory.length > 0}
          hideWindowControls
          onRequestHumanSupport={requestHumanSupport}
          onClearChat={clearChat}
        />

        {sessionError && sessionToken && (
          <div className="flex items-center justify-between gap-2 px-3 py-2 bg-destructive/10 text-destructive text-xs border-b border-destructive/20">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="size-3.5 shrink-0" />
              <span className="truncate">{sessionError}</span>
            </div>
            <button
              type="button"
              onClick={initSession}
              style={{ borderRadius: `${Math.min(cornerRadius, 4)}px` }}
              className="p-1 hover:bg-destructive/15 cursor-pointer"
              title={isRtl ? "إعادة المحاولة" : "Retry"}
            >
              <RefreshCw className="size-3" />
            </button>
          </div>
        )}

        <div
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3.5 select-text"
          style={{ backgroundColor }}
        >
          {isInitializing && messages.length <= 1 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4 my-auto">
              <div
                className="size-12 flex items-center justify-center border shadow-xs"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: `${primaryColor}35`,
                  borderRadius: `${Math.min(cornerRadius, 10)}px`,
                }}
              >
                <div
                  className="size-5 rounded-full"
                  style={{
                    backgroundColor: primaryColor,
                    animation: "cursorPulse 1.2s infinite ease-in-out",
                  }}
                />
              </div>
              <div className="text-center">
                <p
                  className="font-heading text-xs font-bold"
                  style={{ color: bgText }}
                >
                  {effectiveBotName}
                </p>
                <p
                  className="font-mono text-[9px] mt-0.5 opacity-70"
                  style={{ color: bgMutedText }}
                >
                  {isRtl
                    ? "جاري الاتصال بقاعدة بيانات المتجر..."
                    : "Connecting to store verified database..."}
                </p>
              </div>
            </div>
          ) : sessionError && !sessionToken && messages.length <= 1 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-3.5 my-auto">
              <div
                className="size-10 flex items-center justify-center border text-destructive bg-destructive/10 border-destructive/30"
                style={{ borderRadius: `${Math.min(cornerRadius, 6)}px` }}
              >
                <AlertCircle className="size-5" />
              </div>
              <div className="space-y-1">
                <h3
                  className="font-heading font-semibold text-xs"
                  style={{ color: bgText }}
                >
                  {isRtl
                    ? "المساعد غير متوفر حالياً"
                    : "Assistant Currently Unavailable"}
                </h3>
                <p
                  className="text-[11px] leading-relaxed max-w-xs"
                  style={{ color: bgMutedText }}
                >
                  {sessionError}
                </p>
              </div>
              <button
                type="button"
                onClick={initSession}
                style={{
                  backgroundColor: primaryColor,
                  color: primaryText,
                  borderRadius: `${Math.min(cornerRadius, 4)}px`,
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium cursor-pointer shadow-xs hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="size-3" />
                <span>{isRtl ? "إعادة المحاولة" : "Try Again"}</span>
              </button>
            </div>
          ) : (
            messages.map((msg) => (
              <WidgetMessageItem
                key={msg.id}
                msg={msg}
                sessionToken={sessionToken}
                primaryColor={primaryColor}
                primaryText={primaryText}
                secondaryColor={secondaryColor}
                surfaceCardBg={surfaceCardBg}
                bgText={bgText}
                bgMutedText={bgMutedText}
                inputBg={inputBg}
                inputTextColor={inputTextColor}
                isDarkBg={isDarkBg}
                isRtl={isRtl}
                cornerRadius={cornerRadius}
                containerShape={containerShape}
                citationStyle={citationStyle}
                avatarMode={avatarMode}
                avatarMonogram={avatarMonogram}
                originPage={originPage}
                isStreaming={isStreaming}
                onRetry={(txt, id) => sendMessage(txt, id)}
                onScrollToBottom={scrollToBottom}
              />
            ))
          )}

          {showStarterQuestions && (
            <WidgetStarterQuestions
              questions={starterQuestions}
              isStreaming={isStreaming}
              surfaceCardBg={surfaceCardBg}
              bgText={bgText}
              bgMutedText={bgMutedText}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              secondaryText={secondaryText}
              isDarkBg={isDarkBg}
              isRtl={isRtl}
              cornerRadius={cornerRadius}
              borderRadius={borderRadius}
              onSelectQuestion={(q) => sendMessage(q)}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        <WidgetInputBar
          inputText={inputText}
          onInputChange={setInputText}
          onSend={() => sendMessage()}
          inputRef={inputRef}
          isInputFocused={isInputFocused}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          onKeyDown={handleKeyDown}
          isStreaming={isStreaming}
          backgroundColor={backgroundColor}
          primaryColor={primaryColor}
          primaryText={primaryText}
          secondaryColor={secondaryColor}
          bgMutedText={bgMutedText}
          inputBg={inputBg}
          inputTextColor={inputTextColor}
          inputBarBorder={inputBarBorder}
          inputBorderAbove={inputBorderAbove}
          isDarkBg={isDarkBg}
          isRtl={isRtl}
          cornerRadius={cornerRadius}
          borderRadius={borderRadius}
          containerShape={containerShape}
        />

        <WidgetFooter
          brandingEnabled={brandingEnabled}
          backgroundColor={backgroundColor}
          inputBorderBelow={inputBorderBelow}
          bgText={bgText}
          bgMutedText={bgMutedText}
          primaryColor={primaryColor}
          cornerRadius={cornerRadius}
          borderRadius={borderRadius}
          isRtl={isRtl}
        />
      </motion.div>
    </main>
  );
}
