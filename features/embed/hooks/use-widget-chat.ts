"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { SessionResponseData, ChatMessage } from "@/features/embed/types";
import {
  getOrCreateAnonId,
  getFriendlyErrorMessage,
} from "@/features/embed/utils";

interface UseWidgetChatOptions {
  widgetKey: string;
  welcomeMessage?: string;
  isRtl: boolean;
  showBranding: boolean;
  hostDomain?: string;
  originPage: string;
  autoFocus?: boolean;
}

export function useWidgetChat({
  widgetKey,
  welcomeMessage,
  isRtl,
  showBranding,
  hostDomain,
  originPage,
  autoFocus = true,
}: UseWidgetChatOptions) {
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [brandingEnabled, setBrandingEnabled] = useState(showBranding);

  const [inputText, setInputText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionPromiseRef = useRef<Promise<SessionResponseData | null> | null>(
    null,
  );
  const hasInitializedRef = useRef(false);
  const messageCounterRef = useRef(0);
  const streamingContentRef = useRef("");

  const messages: ChatMessage[] = useMemo(
    () => [
      {
        id: "initial-welcome",
        role: "assistant",
        text: welcomeMessage || "Hello! How can I assist you today?",
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
    [welcomeMessage, isRtl, chatHistory],
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);

  const initSession = useCallback(async () => {
    if (sessionPromiseRef.current) {
      return sessionPromiseRef.current;
    }

    setIsInitializing(true);
    setSessionError(null);

    const anonId = getOrCreateAnonId();
    const resolvedHost =
      hostDomain ||
      (typeof window !== "undefined" ? window.location.origin : "");

    const promise = (async () => {
      try {
        const res = await fetch("/api/widget/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            widgetKey,
            anonId,
            hostDomain: resolvedHost || undefined,
            originPage,
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

  useEffect(() => {
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      initSession()
        .then(() => {
          if (autoFocus) {
            setTimeout(() => inputRef.current?.focus(), 200);
          }
        })
        .catch(() => {});
    }
  }, [initSession, autoFocus]);

  const sendMessage = useCallback(
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

          setChatHistory((prev) => [
            ...prev,
            {
              id: `usr-${Date.now()}`,
              role: "user",
              text,
              time: isRtl ? "الآن" : "Just now",
            },
            {
              id: `bot-${Date.now() + 1}`,
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

        setChatHistory((prev) => [
          ...prev,
          {
            id: userMsgId,
            role: "user",
            text,
            time: isRtl ? "الآن" : "Just now",
          },
          {
            id: assistantMsgId,
            role: "assistant",
            text: "",
            time: isRtl ? "الآن" : "Just now",
            isStreaming: true,
          },
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
          const errorData = await res.json().catch(() => null);
          const errorMsg =
            errorData?.message ||
            getFriendlyErrorMessage(null, res.status, isRtl);
          throw new Error(errorMsg);
        }

        const citationHeader = res.headers.get("x-sanad-citation");
        let parsedCitation:
          | {
              documentTitle: string;
              page?: string | number;
              highlightedExcerpt: string;
            }
          | undefined = undefined;

        if (citationHeader) {
          try {
            parsedCitation = JSON.parse(decodeURIComponent(citationHeader));
          } catch (e) {
            console.error("[WidgetChat] Failed to parse citation header:", e);
          }
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
          streamingContentRef.current += chunk;
          const currentText = streamingContentRef.current;

          setChatHistory((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    text: currentText,
                    citation: parsedCitation,
                    isStreaming: true,
                    error: false,
                  }
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
              ? {
                  ...m,
                  text: finalText,
                  citation: parsedCitation,
                  isStreaming: false,
                  error: false,
                }
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

  const requestHumanSupport = useCallback(() => {
    const promptText = isRtl
      ? "مرحباً بك! يسعدنا تواصلك مع فريقنا مباشرة. يرجى تزويدنا ببيانات التواصل وسيتواصل معك أحد ممثلينا في أقرب وقت:"
      : "Hello! We would be glad to connect you with our team. Please leave your contact details below and a specialist will reach out shortly:";

    setChatHistory((prev) => [
      ...prev,
      {
        id: `human-req-${Date.now()}`,
        role: "assistant",
        text: `${promptText}\n\n[[SHOW_LEAD_FORM]]`,
        time: isRtl ? "الآن" : "Just now",
      },
    ]);

    setTimeout(() => {
      scrollToBottom();
    }, 60);
  }, [isRtl, scrollToBottom]);

  const clearChat = useCallback(async () => {
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
      console.error("[WidgetChat] Failed to reinitialize after clear:", e);
    }
  }, [isStreaming, initSession]);

  return {
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
  };
}
