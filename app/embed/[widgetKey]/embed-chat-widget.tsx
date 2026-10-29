"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  type SessionResponseData,
  type EmbedChatWidgetProps,
  type ChatMessage,
} from "@/features/embed/types";
import {
  isDarkColor,
  getContrastTextColor,
  getOrCreateAnonId,
  getFriendlyErrorMessage,
} from "@/features/embed/utils";

import { WidgetHeader } from "@/features/embed/components/widget-header";
import { WidgetMessageItem } from "@/features/embed/components/widget-message-item";
import { WidgetStarterQuestions } from "@/features/embed/components/widget-starter-questions";
import { WidgetInputBar } from "@/features/embed/components/widget-input-bar";
import { WidgetFooter } from "@/features/embed/components/widget-footer";
import { WidgetLauncher } from "@/features/embed/components/widget-launcher";

export function EmbedChatWidget({
  widgetKey,
  config,
  initialOpen = false,
  showBranding = true,
  hostDomain,
  originPage,
}: EmbedChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Dynamic branding permission from subscription
  const [brandingEnabled, setBrandingEnabled] = useState(showBranding);

  const [inputText, setInputText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isRtl = config.defaultLanguage === "ar";
  const primaryColor = config.primaryColor || "#0F5C55";
  const secondaryColor = config.secondaryColor || "#D3E6E2";
  const backgroundColor = config.backgroundColor || "#FFFFFF";

  // Dynamic corner curvature and stroke thickness configured by merchant in Database
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

  // Surface and Input Colors
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

  // Full message feed combining initial welcome message with conversation history
  const messages: ChatMessage[] = useMemo(
    () => [
      {
        id: "initial-welcome",
        role: "assistant",
        text: config.welcomeMessage || "Hello! How can I assist you today?",
        time: isRtl ? "الآن" : "Just now",
      },
      ...chatHistory.filter(
        (m) =>
          m.role === "user" ||
          Boolean(m.text && m.text.trim().length > 0) ||
          m.isStreaming ||
          m.error,
      ),
    ],
    [config.welcomeMessage, isRtl, chatHistory],
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, isOpen, scrollToBottom]);

  // Notify parent window (for dynamic iframe resizing)
  const notifyParent = useCallback(
    (open: boolean) => {
      try {
        if (
          typeof window !== "undefined" &&
          window.parent &&
          window.parent !== window
        ) {
          window.parent.postMessage(
            {
              type: "sanad:resize",
              isOpen: open,
              position: config.position || "bottom-right",
              launcherStyle: config.launcherStyle || "badge",
            },
            "*",
          );
        }
      } catch {
        // Suppress cross-origin messaging error
      }
    },
    [config.position, config.launcherStyle],
  );

  // In-flight promise lock and initialization guard
  const sessionPromiseRef = useRef<Promise<SessionResponseData | null> | null>(
    null,
  );
  const hasInitializedRef = useRef(false);
  const messageCounterRef = useRef(0);
  const streamingContentRef = useRef("");

  const toggleOpen = useCallback(
    (action?: boolean | ((prev: boolean) => boolean)) => {
      setIsOpen((prev) => {
        return typeof action === "function"
          ? action(prev)
          : action !== undefined
            ? action
            : !prev;
      });
    },
    [],
  );

  // Automatically focus input when drawer opens
  useEffect(() => {
    notifyParent(isOpen);
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, notifyParent]);

  // Initialize session handshake
  const initSession = useCallback(async () => {
    if (sessionPromiseRef.current) {
      return sessionPromiseRef.current;
    }

    setIsInitializing(true);
    setSessionError(null);

    const anonId = getOrCreateAnonId();
    let effectiveHost = hostDomain || "";
    if (
      !effectiveHost &&
      typeof document !== "undefined" &&
      document.referrer
    ) {
      try {
        effectiveHost = new URL(document.referrer).origin;
      } catch {
        effectiveHost = "";
      }
    }

    const promise = (async () => {
      try {
        const res = await fetch("/api/widget/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            widgetKey,
            anonId,
            hostDomain: effectiveHost || undefined,
            originPage: originPage || "/",
          }),
        });

        if (!res.ok) {
          throw new Error(
            isRtl
              ? "تعذر الاتصال بالمساعد حالياً. يرجى إعادة المحاولة."
              : "Unable to connect to assistant. Please try again.",
          );
        }

        const data = await res.json();
        setSessionToken(data.sessionToken);
        sessionTokenRef.current = data.sessionToken;

        if (typeof data.showBranding === "boolean") {
          setBrandingEnabled(data.showBranding);
        }

        // If prior messages exist for this visitor, load them into state
        if (Array.isArray(data.history) && data.history.length > 0) {
          const loaded: ChatMessage[] = data.history.map(
            (m: {
              id: string;
              role: "user" | "assistant";
              content: string;
              created_at: string;
            }) => ({
              id: m.id,
              role: m.role,
              text: m.content,
              time: new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }),
          );
          setChatHistory(loaded);
        }
        return data;
      } catch (err) {
        setSessionError(
          isRtl
            ? "تعذر الاتصال بالمساعد حالياً. يرجى إعادة المحاولة."
            : "Unable to connect to assistant. Please try again.",
        );
        throw err;
      } finally {
        setIsInitializing(false);
        sessionPromiseRef.current = null;
      }
    })();

    sessionPromiseRef.current = promise;
    return promise;
  }, [widgetKey, hostDomain, isRtl, originPage]);

  // Trigger initialization once on component mount
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      initSession().catch(() => {});
    }
  }, [initSession]);

  // Listen to postMessage events from host page
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "sanad:cmd_open" || e.data?.type === "sanad:open") {
        toggleOpen(true);
      } else if (
        e.data?.type === "sanad:cmd_close" ||
        e.data?.type === "sanad:close"
      ) {
        toggleOpen(false);
      } else if (e.data?.type === "sanad:cmd_toggle") {
        toggleOpen((prev) => !prev);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [toggleOpen]);

  // Main chat sending handler
  const handleSendMessage = useCallback(
    async (textToSend?: string, retryAssistantMsgId?: string) => {
      const text = (textToSend ?? inputText).trim();
      if (!text || isStreaming) return;

      let currentToken = sessionTokenRef.current;
      if (!currentToken) {
        try {
          const sessionData = await initSession();
          currentToken = sessionData?.sessionToken || null;
        } catch {
          currentToken = null;
        }

        if (!currentToken) {
          const errorMsg = isRtl
            ? "تعذر الاتصال بالمساعد حالياً. يرجى إعادة المحاولة."
            : "Unable to connect to assistant. Please retry.";

          const userMsgId = `usr-${Date.now()}`;
          const errBotId = `bot-${Date.now() + 1}`;

          setChatHistory((prev) => [
            ...prev,
            {
              id: userMsgId,
              role: "user",
              text,
              time: isRtl ? "الآن" : "Just now",
            },
            {
              id: errBotId,
              role: "assistant",
              text: errorMsg,
              time: isRtl ? "الآن" : "Just now",
              error: true,
              retryText: text,
            },
          ]);
          setInputText("");
          return;
        }
      }

      let assistantMsgId: string;

      if (retryAssistantMsgId) {
        assistantMsgId = retryAssistantMsgId;
        setChatHistory((prev) =>
          prev.map((m) =>
            m.id === retryAssistantMsgId
              ? {
                  ...m,
                  text: "",
                  error: false,
                  isStreaming: true,
                  retryText: text,
                }
              : m,
          ),
        );
      } else {
        messageCounterRef.current += 1;
        const userMsgId = `usr-${Date.now()}-${messageCounterRef.current}`;
        assistantMsgId = `bot-${Date.now()}-${messageCounterRef.current}`;

        const newUserMessage: ChatMessage = {
          id: userMsgId,
          role: "user",
          text,
          time: isRtl ? "الآن" : "Just now",
        };

        const initialAssistantMessage: ChatMessage = {
          id: assistantMsgId,
          role: "assistant",
          text: "",
          time: isRtl ? "الآن" : "Just now",
          isStreaming: true,
        };

        setChatHistory((prev) => [
          ...prev,
          newUserMessage,
          initialAssistantMessage,
        ]);
        setInputText("");
      }

      setIsStreaming(true);

      const recentContext = chatHistory
        .filter((m) => m.text && !m.error && m.id !== retryAssistantMsgId)
        .slice(-4)
        .map((m) => ({
          role: m.role,
          content: m.text,
        }));

      try {
        const res = await fetch("/api/widget/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify({
            message: text,
            messages: recentContext,
          }),
        });

        if (!res.ok) {
          if (res.status === 401) {
            sessionTokenRef.current = null;
            setSessionToken(null);
          }
          const errorMsg = getFriendlyErrorMessage(null, res.status, isRtl);
          throw new Error(errorMsg);
        }

        if (!res.body) {
          throw new Error(
            isRtl
              ? "تعذر استقبال رد المساعد. يرجى إعادة المحاولة."
              : "Unable to receive assistant response. Please retry.",
          );
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        streamingContentRef.current = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          streamingContentRef.current = streamingContentRef.current + chunk;
          const currentText = streamingContentRef.current;

          setChatHistory((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? { ...m, text: currentText, isStreaming: true, error: false }
                : m,
            ),
          );
        }

        const finalText = streamingContentRef.current.trim();
        streamingContentRef.current = "";

        if (!finalText) {
          throw new Error(
            isRtl
              ? "تعذر استقبال رد المساعد. يرجى إعادة المحاولة."
              : "Unable to receive assistant response. Please retry.",
          );
        }

        setChatHistory((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, text: finalText, isStreaming: false, error: false }
              : m,
          ),
        );
      } catch (err) {
        const errorMsg = getFriendlyErrorMessage(err, undefined, isRtl);
        setChatHistory((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  text: errorMsg,
                  isStreaming: false,
                  error: true,
                  retryText: text,
                }
              : m,
          ),
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [chatHistory, inputText, isRtl, isStreaming, initSession],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRequestHumanSupport = useCallback(() => {
    const leadMsgId = `human-req-${Date.now()}`;
    const promptText = isRtl
      ? "مرحباً بك! يسعدنا تواصلك مع فريقنا مباشرة. يرجى تزويدنا ببيانات التواصل وسيتواصل معك أحد ممثلينا في أقرب وقت:"
      : "Hello! We would be glad to connect you with our team. Please leave your contact details below and a specialist will reach out shortly:";

    setChatHistory((prev) => [
      ...prev,
      {
        id: leadMsgId,
        role: "assistant",
        text: `${promptText}\n\n[[SHOW_LEAD_FORM]]`,
        time: isRtl ? "الآن" : "Just now",
      },
    ]);

    setTimeout(() => {
      scrollToBottom();
    }, 60);
  }, [isRtl, scrollToBottom]);

  const handleClearChat = useCallback(async () => {
    if (isStreaming) return;

    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("sanad_visitor_anon_id");
      }
    } catch {}

    setChatHistory([]);
    setInputText("");
    sessionTokenRef.current = null;
    setSessionToken(null);
    hasInitializedRef.current = false;

    try {
      await initSession();
    } catch (e) {
      console.error("[Widget] Failed to reinitialize after clear:", e);
    }
  }, [isStreaming, initSession]);

  const starterQuestions = Array.isArray(config.starterQuestions)
    ? config.starterQuestions
    : [];
  const showStarterQuestions =
    chatHistory.length === 0 && starterQuestions.length > 0;

  return (
    <div
      className="relative w-full h-full font-sans select-none"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      <style>{`
        @keyframes shimmerTrack {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes cursorPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>

      {/* ──────────────── 1. EXPANDABLE CHAT DRAWER ──────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed ${
              config.position === "bottom-left" ? "left-4" : "right-4"
            } bottom-4 z-50 flex flex-col w-[385px] max-w-[calc(100vw-32px)] h-[620px] max-h-[calc(100vh-32px)] shadow-2xl border overflow-hidden`}
            style={{
              backgroundColor,
              color: bgText,
              borderColor: isDarkBg ? `${primaryColor}55` : `${primaryColor}35`,
              borderRadius: `${cornerRadius}px`,
              borderWidth: `${Math.max(1, borderRadius)}px`,
            }}
          >
            {/* Header */}
            <WidgetHeader
              botName={config.botName}
              subtitle={config.subtitle}
              primaryColor={primaryColor}
              primaryText={primaryText}
              secondaryColor={secondaryColor}
              secondaryText={secondaryText}
              cornerRadius={cornerRadius}
              isRtl={isRtl}
              hasMessages={chatHistory.length > 0}
              onRequestHumanSupport={handleRequestHumanSupport}
              onClearChat={handleClearChat}
              onMinimize={() => toggleOpen(false)}
              onClose={() => toggleOpen(false)}
            />

            {/* Error Banner (if session error occurs while open) */}
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
                  title="Retry"
                >
                  <RefreshCw className="size-3" />
                </button>
              </div>
            )}

            {/* Scrollable Message Feed */}
            <div
              className="flex-1 overflow-y-auto p-3.5 space-y-3.5 select-text"
              style={{ backgroundColor }}
            >
              {isInitializing && messages.length <= 1 ? (
                /* Shimmer skeleton during initial connect */
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
                      {config.botName || "Sanad AI Assistant"}
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
                /* Error view when session handshake fails completely */
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
                    originPage={originPage}
                    isStreaming={isStreaming}
                    onRetry={(txt, id) => handleSendMessage(txt, id)}
                    onScrollToBottom={scrollToBottom}
                  />
                ))
              )}

              {/* Starter Questions Chips */}
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
                  onSelectQuestion={(q) => handleSendMessage(q)}
                />
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <WidgetInputBar
              inputText={inputText}
              onInputChange={setInputText}
              onSend={() => handleSendMessage()}
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
            />

            {/* Brand Attribution Footer */}
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
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <WidgetLauncher
        isOpen={isOpen}
        onOpen={() => toggleOpen(true)}
        position={config.position}
        launcherStyle={config.launcherStyle}
        launcherText={config.launcherText}
        primaryColor={primaryColor}
        primaryText={primaryText}
        cornerRadius={cornerRadius}
        borderRadius={borderRadius}
        isRtl={isRtl}
      />
    </div>
  );
}
