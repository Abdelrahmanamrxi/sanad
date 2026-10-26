 "use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Bot,
  Send,
  X,
  Minus,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Loader2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { type SessionResponseData, type EmbedChatWidgetProps, type ChatMessage } from "@/features/embed/types";
import { isDarkColor, getContrastTextColor, getOrCreateAnonId } from "@/features/embed/utils";
import { ThinkingIndicator } from "@/features/embed/components/thinking-indicator";
import { getFriendlyErrorMessage } from "@/features/embed/utils";



export function EmbedChatWidget({
  widgetKey,
  config,
  initialOpen = false,
  showBranding = true,
  hostDomain,
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
  const cornerRadius = typeof config.cornerRadius === "number" ? config.cornerRadius : 0;
  const borderRadius = typeof config.borderRadius === "number" ? config.borderRadius : 1;

  const primaryText = getContrastTextColor(primaryColor);
  const secondaryText = getContrastTextColor(secondaryColor);
  const isDarkBg = isDarkColor(backgroundColor);
  const bgText = isDarkBg ? "#F3F7F6" : "#10201F";
  const bgMutedText = isDarkBg
    ? "rgba(243, 247, 246, 0.65)"
    : "rgba(16, 32, 31, 0.65)";

  // Surface and Input Colors (guarantees high contrast text input)
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

  // Full message feed combining initial welcome message with conversation history (memoized to prevent cascading effect triggers)
  const messages: ChatMessage[] = useMemo(
    () => [
      {
        id: "initial-welcome",
        role: "assistant",
        text: config.welcomeMessage || "Hello! How can I assist you today?",
        time: isRtl ? "الآن" : "Just now",
      },
      ...chatHistory.filter(
        (m) => m.role === "user" || Boolean(m.text && m.text.trim().length > 0) || m.isStreaming || m.error
      ),
    ],
    [config.welcomeMessage, isRtl, chatHistory]
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
        if (typeof window !== "undefined" && window.parent && window.parent !== window) {
          window.parent.postMessage(
            {
              type: "sanad:resize",
              isOpen: open,
              position: config.position || "bottom-right",
              launcherStyle: config.launcherStyle || "badge",
            },
            "*"
          );
        }
      } catch {
        // Suppress cross-origin messaging error
      }
    },
    [config.position, config.launcherStyle]
  );

  // In-flight promise lock and initialization guard to prevent duplicate concurrent session handshakes
  const sessionPromiseRef = useRef<Promise<SessionResponseData | null> | null>(null);
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
    []
  );

  // Automatically focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Initialize session handshake (locked so multiple calls return the same single in-flight promise)
  const initSession = useCallback(async () => {
    if (sessionPromiseRef.current) {
      return sessionPromiseRef.current;
    }

    setIsInitializing(true);
    setSessionError(null);

    const anonId = getOrCreateAnonId();
    let effectiveHost = hostDomain || "";
    if (!effectiveHost && typeof document !== "undefined" && document.referrer) {
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
          }),
        });

        if (!res.ok) {
          throw new Error(
            isRtl
              ? "تعذر الاتصال بالمساعد حالياً. يرجى إعادة المحاولة."
              : "Unable to connect to assistant. Please try again."
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
            (m: { id: string; role: "user" | "assistant"; content: string; created_at: string }) => ({
              id: m.id,
              role: m.role,
              text: m.content,
              time: new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            })
          );
          setChatHistory(loaded);
        }
        return data;
      } catch (err) {
        setSessionError(
          isRtl
            ? "تعذر الاتصال بالمساعد حالياً. يرجى إعادة المحاولة."
            : "Unable to connect to assistant. Please try again."
        );
        throw err;
      } finally {
        setIsInitializing(false);
        sessionPromiseRef.current = null;
      }
    })();

    sessionPromiseRef.current = promise;
    return promise;
  }, [widgetKey, hostDomain, isRtl]);

  // 1. Initialize session ONCE on component mount
  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      initSession().catch(() => {});
    }
  }, [initSession]);

  // 2. Notify parent on isOpen change
  useEffect(() => {
    notifyParent(isOpen);
  }, [isOpen, notifyParent]);

  // 3. Listen for parent cross-window messages
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Ignore messages dispatched by this iframe window itself
      if (e.source === window) return;

      // Handle only explicit commands from host
      if (e.data?.type === "sanad:cmd_open" || e.data?.type === "sanad:open") {
        toggleOpen(true);
      } else if (e.data?.type === "sanad:cmd_close" || e.data?.type === "sanad:close") {
        toggleOpen(false);
      } else if (e.data?.type === "sanad:cmd_toggle") {
        toggleOpen((prev) => !prev);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [toggleOpen]);

  // Handle message submission & streaming (wrapped in useCallback with pure sequential IDs to satisfy React Compiler)
  const handleSendMessage = useCallback(
    async (textToSend?: string, retryAssistantMsgId?: string) => {
      const text = (textToSend || inputText).trim();
      if (!text || isStreaming) return;

      let activeToken = sessionTokenRef.current || sessionToken;
      if (!activeToken) {
        try {
          const sessionData = await initSession();
          activeToken = sessionData?.sessionToken || sessionTokenRef.current;
        } catch {
          // If session initialization failed, display a friendly error bubble
          const errorMsg = isRtl
            ? "تعذر الاتصال بالمساعد. يرجى التحقق من اتصال الإنترنت وإعادة المحاولة."
            : "Could not connect to assistant. Please check your connection and retry.";

          messageCounterRef.current += 1;
          const userMsgId = `user-${messageCounterRef.current}`;
          messageCounterRef.current += 1;
          const errBotId = `bot-${messageCounterRef.current}`;

          setChatHistory((prev) => [
            ...prev,
            { id: userMsgId, role: "user", text, time: isRtl ? "الآن" : "Just now" },
            { id: errBotId, role: "assistant", text: errorMsg, time: isRtl ? "الآن" : "Just now", error: true, retryText: text },
          ]);
          setInputText("");
          return;
        }
      }
      if (!activeToken) return;

      let assistantMsgId: string;
      let updatedHistory = chatHistory;

      if (retryAssistantMsgId) {
        assistantMsgId = retryAssistantMsgId;
        setChatHistory((prev) =>
          prev.map((m) =>
            m.id === retryAssistantMsgId
              ? { ...m, text: "", error: false, isStreaming: true, retryText: text }
              : m
          )
        );
      } else {
        messageCounterRef.current += 1;
        const userMsgId = `user-${messageCounterRef.current}`;
        const userMsg: ChatMessage = {
          id: userMsgId,
          role: "user",
          text,
          time: isRtl ? "الآن" : "Just now",
        };

        updatedHistory = [...chatHistory, userMsg];

        messageCounterRef.current += 1;
        assistantMsgId = `bot-${messageCounterRef.current}`;
        const initialAssistantMsg: ChatMessage = {
          id: assistantMsgId,
          role: "assistant",
          text: "",
          time: isRtl ? "الآن" : "Just now",
          isStreaming: true,
          retryText: text,
        };

        setChatHistory([...updatedHistory, initialAssistantMsg]);
        setInputText("");
      }

      setIsStreaming(true);

      try {
        const recentContext = updatedHistory.slice(-5).map((m) => ({
          role: m.role,
          content: m.text,
        }));

        const res = await fetch("/api/widget/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify({
            message: text,
            messages: recentContext,
          }),
        });

        if (!res.ok) {
          if (res.status === 401) {
            // Invalidate stale session token so next attempt re-authenticates
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
              : "Unable to receive assistant response. Please retry."
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
                : m
            )
          );
        }

        const finalText = streamingContentRef.current.trim();
        streamingContentRef.current = "";

        if (!finalText) {
          throw new Error(
            isRtl
              ? "تعذر استقبال رد المساعد. يرجى إعادة المحاولة."
              : "Unable to receive assistant response. Please retry."
          );
        }

        setChatHistory((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, text: finalText, isStreaming: false, error: false }
              : m
          )
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
              : m
          )
        );
      } finally {
        setIsStreaming(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    },
    [chatHistory, inputText, isRtl, isStreaming, sessionToken, initSession]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const starterQuestions = Array.isArray(config.starterQuestions)
    ? config.starterQuestions
    : [];
  const showStarterQuestions = chatHistory.length === 0 && starterQuestions.length > 0;

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
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* ──────────────── 1. CHAT DRAWER / WINDOW ──────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex flex-col shadow-2xl border overflow-hidden"
            style={{
              backgroundColor,
              color: bgText,
              borderColor: isDarkBg ? `${primaryColor}55` : `${primaryColor}35`,
              borderRadius: `${cornerRadius}px`,
              borderWidth: `${Math.max(1, borderRadius)}px`,
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between p-3.5 shrink-0 shadow-sm border-b select-none"
              style={{
                backgroundColor: primaryColor,
                color: primaryText,
                borderColor: `${primaryText}20`,
                borderTopLeftRadius: `${cornerRadius}px`,
                borderTopRightRadius: `${cornerRadius}px`,
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="relative flex size-9 items-center justify-center border shrink-0"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.18)",
                    borderColor: "rgba(255, 255, 255, 0.35)",
                    color: primaryText,
                    borderRadius: `${Math.min(cornerRadius, 8)}px`,
                  }}
                >
                  <Bot className="size-4.5" />
                  <span
                    className="absolute -top-1 -right-1 size-2 bg-emerald-400 ring-2 ring-black/40 animate-pulse"
                    style={{ borderRadius: `${Math.min(cornerRadius, 4)}px` }}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="font-heading text-xs font-bold tracking-tight leading-tight truncate"
                      style={{ color: primaryText }}
                    >
                      {config.botName || "Sanad AI Support"}
                    </span>
                    <span
                      className="px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider font-bold shrink-0 border"
                      style={{
                        backgroundColor: secondaryColor,
                        color: secondaryText,
                        borderColor: `${primaryText}30`,
                        borderRadius: `${Math.min(cornerRadius, 4)}px`,
                      }}
                    >
                      {isRtl ? "مساعد ذكي" : "AI AGENT"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="size-1.5 bg-emerald-400 inline-block shrink-0"
                      style={{ borderRadius: `${Math.min(cornerRadius, 2)}px` }}
                    />
                    <p
                      className="font-sans text-[10px] truncate max-w-[210px] leading-none opacity-90"
                      style={{ color: primaryText }}
                    >
                      {config.subtitle ||
                        (isRtl
                          ? "إجابات فورية وموثقة من وثائق المتجر"
                          : "Instant verified answers")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleOpen(false)}
                  style={{
                    color: primaryText,
                    borderRadius: `${Math.min(cornerRadius, 4)}px`,
                  }}
                  className="p-1 hover:bg-black/15 transition-colors cursor-pointer opacity-85 hover:opacity-100"
                  title={isRtl ? "تصغير" : "Minimize"}
                >
                  <Minus className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleOpen(false)}
                  style={{
                    color: primaryText,
                    borderRadius: `${Math.min(cornerRadius, 4)}px`,
                  }}
                  className="p-1 hover:bg-black/15 transition-colors cursor-pointer opacity-85 hover:opacity-100"
                  title={isRtl ? "إغلاق" : "Close"}
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* ── Error Banner (if any) ── */}
            {sessionError && (
              <div
                className="flex items-center justify-between gap-2 px-3 py-2 bg-destructive/10 text-destructive text-xs border-b border-destructive/20"
              >
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

            {/* ── Messages Feed ── */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3.5"
              style={{
                backgroundColor,
                color: bgText,
              }}
            >
              {isInitializing && messages.length === 1 ? (
                /* High-engagement Initial Connecting State */
                <div className="flex flex-col items-center justify-center h-36 gap-2.5">
                  <div
                    className="relative flex size-10 items-center justify-center border shadow-xs"
                    style={{
                      backgroundColor: `${primaryColor}15`,
                      borderColor: `${primaryColor}35`,
                      color: primaryColor,
                      borderRadius: `${Math.min(cornerRadius, 8)}px`,
                    }}
                  >
                    <Bot className="size-5 animate-pulse" />
                    <span
                      className="absolute -top-1 -right-1 size-2.5 bg-emerald-400 ring-2 ring-black/40 animate-ping"
                      style={{ borderRadius: `${Math.min(cornerRadius, 3)}px` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-heading text-xs font-bold" style={{ color: bgText }}>
                      {config.botName || "Sanad AI Assistant"}
                    </p>
                    <p className="font-mono text-[9px] mt-0.5 opacity-70" style={{ color: bgMutedText }}>
                      {isRtl
                        ? "جاري الاتصال بقاعدة بيانات المتجر..."
                        : "Connecting to store verified database..."}
                    </p>
                  </div>
                </div>
              ) : sessionError && !sessionToken && messages.length <= 1 ? (
                /* Fallback Error View when widget session cannot connect */
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-3.5 my-auto">
                  <div
                    className="size-10 flex items-center justify-center border text-destructive bg-destructive/10 border-destructive/30"
                    style={{ borderRadius: `${Math.min(cornerRadius, 6)}px` }}
                  >
                    <AlertCircle className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-heading font-semibold text-xs" style={{ color: bgText }}>
                      {isRtl ? "المساعد غير متوفر حالياً" : "Assistant Currently Unavailable"}
                    </h3>
                    <p className="text-[11px] leading-relaxed max-w-xs" style={{ color: bgMutedText }}>
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
                messages.map((msg) => {
                  const isBot = msg.role === "assistant";
                  const isError = Boolean(msg.error);
                  const hasContent = Boolean(msg.text && msg.text.trim().length > 0);

                  return (
                    <div
                      key={msg.id}
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
                          /* Captivating Stage Indicator While Thinking */
                          <ThinkingIndicator
                            isRtl={isRtl}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            surfaceCardBg={surfaceCardBg}
                            isDarkBg={isDarkBg}
                            cornerRadius={cornerRadius}
                          />
                        ) : isError ? (
                          /* Dedicated Non-Tech Red Error Bubble */
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
                              {msg.retryText && (
                                <button
                                  type="button"
                                  disabled={isStreaming}
                                  onClick={() => handleSendMessage(msg.retryText, msg.id)}
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
                          /* Formatted Message Bubble */
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
                                      <em className="italic text-inherit">
                                        {children}
                                      </em>
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
                                      <li className="leading-relaxed">
                                        {children}
                                      </li>
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
                                  {msg.text.trim()}
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
                })
              )}

              {/* ── Starter Questions Chips ── */}
              {showStarterQuestions && (
                <div className="pt-2 space-y-2">
                  <div
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider select-none font-mono"
                    style={{ color: bgMutedText }}
                  >
                    <Sparkles className="size-3" style={{ color: primaryColor }} />
                    <span>{isRtl ? "أسئلة مقترحة" : "Suggested inquiries"}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {starterQuestions.map((question, idx) => (
                      <button
                        key={idx}
                        type="button"
                        disabled={isStreaming}
                        onClick={() => handleSendMessage(question)}
                        className="w-full text-start px-3 py-2 text-xs border transition-all cursor-pointer flex items-center justify-between group hover:border-primary/60 shadow-2xs"
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
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input Bar ── */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
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
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isRtl ? "اكتب سؤالك هنا..." : "Type your question..."
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

            {/* ── Brand Attribution Footer (Dynamic Based on Subscription Plan) ── */}
            {brandingEnabled ? (
              // Free Plan: Required "Powered by Sanad" attribution
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
            ) : (
              // Paid Plans (Starter / Growth / Pro): Custom Branding Unlocked (White-labeled)
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
                  <span>{isRtl ? "مساعد رسمي للمتجر" : "Verified Store Assistant"}</span>
                </span>
                <span className="opacity-80">
                  {isRtl ? "دعم متواصل 24/7" : "24/7 Live Support"}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ──────────────── 2. FLOATING LAUNCHER BUTTON ──────────────── */}
      {!isOpen && (
        <div
          className={`fixed ${
            config.position === "bottom-left" ? "left-4" : "right-4"
          } bottom-4 z-40`}
        >
          {config.launcherStyle === "badge" ? (
            <button
              type="button"
              onClick={() => toggleOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold border shadow-xl transition-transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              style={{
                backgroundColor: primaryColor,
                color: primaryText,
                borderColor: `${primaryText}40`,
                borderRadius: `${cornerRadius}px`,
                borderWidth: `${Math.max(1, borderRadius)}px`,
              }}
            >
              <div className="relative">
                <Bot className="size-4 shrink-0" />
                <span
                  className="absolute -top-1 -right-1 size-1.5 bg-emerald-400 animate-pulse"
                  style={{ borderRadius: `${Math.min(cornerRadius, 4)}px` }}
                />
              </div>
              <span className="tracking-wide">
                {config.launcherText ||
                  (isRtl ? "تحدث معنا" : "Chat with us")}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => toggleOpen(true)}
              className="flex items-center justify-center size-13 border shadow-xl transition-transform hover:scale-[1.05] active:scale-[0.98] cursor-pointer"
              style={{
                backgroundColor: primaryColor,
                color: primaryText,
                borderColor: `${primaryText}40`,
                borderRadius: `${cornerRadius}px`,
                borderWidth: `${Math.max(1, borderRadius)}px`,
              }}
              title={
                config.launcherText || (isRtl ? "تحدث معنا" : "Chat with us")
              }
            >
              <div className="relative">
                <MessageSquare className="size-5 shrink-0" />
                <span
                  className="absolute -top-1 -right-1 size-2 bg-emerald-400 ring-2 ring-black/30 animate-pulse"
                  style={{ borderRadius: `${Math.min(cornerRadius, 4)}px` }}
                />
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
