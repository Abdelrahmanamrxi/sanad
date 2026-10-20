"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  X,
  Minus,
  Send,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
  FileText,
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
  citation?: string;
  time: string;
}

export default function ChatWidget({ config, device }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<SimulatedMessage[]>([
    {
      id: "initial-welcome",
      role: "assistant",
      text: config.welcomeMessage,
      time: "Just now",
    },
  ]);

  // Update initial welcome message dynamically if edited in settings
  useEffect(() => {
    setMessages((prev) => [
      {
        ...prev[0],
        text: config.welcomeMessage,
      },
      ...prev.slice(1),
    ]);
  }, [config.welcomeMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: SimulatedMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate smart grounded RAG response
    setTimeout(() => {
      let simulatedReply =
        "According to our verified store policies: Items can be returned or exchanged within 14 days of delivery. Free returns are available for eligible orders in original packaging.";
      let citation = "returns_and_refunds_policy.pdf // p. 3";

      const lower = text.toLowerCase();
      if (
        lower.includes("shipping") ||
        lower.includes("delivery") ||
        text.includes("شحن") ||
        text.includes("توصيل")
      ) {
        simulatedReply =
          "Standard delivery takes 2 to 4 business days nationwide. Shipping is free for all orders over 200 SAR.";
        citation = "express_shipping_guidelines.docx // sec. 4";
      } else if (
        lower.includes("payment") ||
        lower.includes("installment") ||
        text.includes("دفع") ||
        text.includes("تقسيط")
      ) {
        simulatedReply =
          "We accept all major credit cards, Mada, Apple Pay, and 0% interest installment plans via Tamara and Tabby.";
        citation = "payment_gateways_sla.pdf // p. 1";
      } else if (
        lower.includes("track") ||
        lower.includes("order") ||
        text.includes("تتبع")
      ) {
        simulatedReply =
          "You can track your order in real-time by clicking the tracking link sent to your SMS or entering your order ID on our tracking page.";
        citation = "order_fulfillment_manual.pdf // p. 7";
      }

      const botReply: SimulatedMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        text: simulatedReply,
        citation,
        time: "Just now",
      };

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 700);
  };

  const isRtl = config.defaultLanguage === "ar";
  const isMobile = device === "mobile";

  return (
    <>
      {/* ──────────────── 1. OPEN CHAT DRAWER ──────────────── */}
      {isOpen && (
        <div
          className={`z-50 flex flex-col bg-card shadow-2xl transition-all rounded-none ${
            isMobile
              ? "absolute inset-0 h-full w-full border-none"
              : `absolute bottom-5 ${
                  config.position === "bottom-left" ? "left-5" : "right-5"
                } w-[390px] h-[560px] border border-border ring-1 ring-black/10 dark:ring-white/10`
          }`}
          style={{ direction: isRtl ? "rtl" : "ltr" }}
        >
          {/* ── Widget Header ── */}
          <div
            className="flex items-center justify-between p-3.5 text-white shrink-0 shadow-md transition-colors select-none"
            style={{
              backgroundColor: config.primaryColor,
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.12) 100%)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-9 items-center justify-center border border-white/30 bg-white/20 text-white rounded-none shrink-0 shadow-xs">
                <Bot className="size-4" />
                <span className="absolute -top-1 -right-1 size-2 bg-emerald-400 ring-2 ring-black/40 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading text-xs font-bold tracking-tight text-white leading-tight">
                    {config.botName || "Sanad AI Support"}
                  </span>
                  <CheckCircle2 className="size-3.5 text-amber-300" />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="size-1.5 bg-emerald-400 inline-block" />
                  <p className="font-sans text-[10px] text-white/90 truncate max-w-[210px] leading-none">
                    {config.subtitle || "Online • Instant verified answers"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {!isMobile && (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-white/80 hover:text-white hover:bg-white/15 transition-colors rounded-none cursor-pointer"
                  title="Minimize Chat"
                >
                  <Minus className="size-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-white/80 hover:text-white hover:bg-white/15 transition-colors rounded-none cursor-pointer"
                title="Close Chat"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* ── Verified Knowledge Base Sub-Header ── */}
          <div className="flex items-center justify-between py-1.5 px-3 bg-amber-500/10 border-b border-amber-500/20 text-[10px] text-amber-900 dark:text-amber-300 select-none shrink-0 font-sans">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3 text-amber-600 dark:text-amber-400" />
              <span className="font-semibold">Factually Grounded Answers</span>
            </div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-amber-700/80 dark:text-amber-400/80">
              Sanad Knowledge Active
            </span>
          </div>

          {/* ── Messages Scroll Body ── */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
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
                      className="size-7 shrink-0 flex items-center justify-center text-white text-[10px] rounded-none shadow-xs mt-0.5"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      <Bot className="size-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3 text-xs font-sans leading-relaxed rounded-none shadow-2xs ${
                      isBot
                        ? "border border-border/80 border-s-2 border-s-primary bg-card text-foreground"
                        : "text-white font-medium"
                    }`}
                    style={!isBot ? { backgroundColor: config.primaryColor } : {}}
                    dir="auto"
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Grounded Document Citation Badge */}
                    {msg.citation && (
                      <div className="mt-2.5 pt-2 border-t border-border/60 flex items-center gap-1.5 text-[10px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-none border border-emerald-500/20">
                        <FileText className="size-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className="truncate">{msg.citation}</span>
                      </div>
                    )}

                    <span
                      className={`block mt-1.5 font-mono text-[8px] ${
                        isBot ? "text-muted-foreground" : "text-white/80"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2 items-center text-primary font-mono text-[10px] bg-primary/10 p-2 border border-primary/20 w-fit">
                <span className="size-1.5 bg-primary animate-ping inline-block" />
                <span>Sanad is reviewing verified documentation...</span>
              </div>
            )}

            {/* Quick Starter Question Chips */}
            {config.starterQuestions.length > 0 && messages.length <= 2 && (
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[10px] uppercase tracking-wider select-none">
                  <Sparkles className="size-3 text-primary" />
                  <span>Suggested Inquiries:</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {config.starterQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(question)}
                      className="group flex items-center justify-between text-start border border-border bg-card hover:border-primary p-2.5 font-sans text-xs text-foreground hover:bg-primary/5 hover:translate-x-0.5 transition-all rounded-none shadow-2xs cursor-pointer"
                      dir="auto"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex size-4 shrink-0 items-center justify-center font-mono text-[10px] font-bold bg-primary/15 text-primary border border-primary/30">
                          {idx + 1}
                        </span>
                        <span className="truncate">{question}</span>
                      </div>
                      <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ms-1" />
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
            className="border-t border-border bg-card p-3 flex flex-col gap-1.5 shrink-0"
          >
            <div className="flex items-center gap-2 border border-border bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all p-1 shadow-2xs">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your question here..."
                dir="auto"
                className="flex-1 bg-transparent px-2.5 py-1.5 font-sans text-xs text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="flex size-8 items-center justify-center text-white transition-all disabled:opacity-40 rounded-none shrink-0 cursor-pointer shadow-xs hover:brightness-110 active:scale-95"
                style={{ backgroundColor: config.primaryColor }}
                title="Send message"
              >
                <Send className="size-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between px-1 text-[10px] text-muted-foreground font-mono">
              <span>Enter to send</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Verified Instant Response</span>
            </div>
          </form>

          {/* ── Brand Attribution Footer ── */}
          <div className="border-t border-border/60 bg-muted/30 py-1 text-center font-mono text-[9px] text-muted-foreground select-none">
            Powered by Sanad AI Platform // Enterprise RAG Engine
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
            className="group flex items-center gap-2.5 px-4 py-3 text-white shadow-2xl hover:brightness-110 active:scale-95 transition-all rounded-none cursor-pointer border border-white/20 ring-2 ring-black/10"
            style={{ backgroundColor: config.primaryColor }}
            aria-label="Toggle Sanad Chat Widget"
          >
            <div className="relative flex items-center justify-center">
              {isOpen ? (
                <X className="size-4" />
              ) : (
                <MessageCircle className="size-4" />
              )}
              {!isOpen && (
                <span className="absolute -top-1.5 -right-1.5 size-2.5 bg-emerald-400 ring-2 ring-white/40 animate-pulse" />
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
