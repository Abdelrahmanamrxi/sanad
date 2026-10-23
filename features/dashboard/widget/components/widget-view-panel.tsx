"use client";

import React, { useState } from "react";
import { Wifi, Battery, Signal } from "lucide-react";
import type { WidgetConfig, DevicePreview, StoreTheme } from "../types";
import PreviewToolbar from "./preview/preview-toolbar";
import StoreMockup from "./preview/store-mockup";
import ChatWidget from "./preview/chat-widget";

interface WidgetViewPanelProps {
  config: WidgetConfig;
  isMobileModal?: boolean;
}

export default function WidgetViewPanel({
  config,
  isMobileModal = false,
}: WidgetViewPanelProps) {
  const [device, setDevice] = useState<DevicePreview>(
    isMobileModal ? "mobile" : "desktop"
  );
  const [storeTheme, setStoreTheme] = useState<StoreTheme>("light");
  const [chatKey, setChatKey] = useState(0);

  const handleResetChat = () => {
    setChatKey((prev) => prev + 1);
  };

  const isDark = storeTheme === "dark";

  return (
    <div className="relative flex h-full flex-col border border-border bg-card shadow-xs overflow-hidden">
      {/* ── 1. Top Controls Bar ── */}
      <PreviewToolbar
        device={device}
        onDeviceChange={setDevice}
        storeTheme={storeTheme}
        onThemeChange={setStoreTheme}
        onResetChat={handleResetChat}
        isMobileModal={isMobileModal}
      />

      {/* ── 2. Studio Canvas with Subtle Grid Texture ── */}
      <div
        className={`relative flex-1 overflow-hidden transition-colors ${
          isMobileModal
            ? isDark
              ? "bg-stone-900 text-stone-100"
              : "bg-stone-100 text-stone-900"
            : device === "mobile"
            ? "bg-muted/40 p-4 sm:p-8 flex justify-center items-center overflow-y-auto"
            : isDark
            ? "bg-stone-900 text-stone-100"
            : "bg-stone-100 text-stone-900"
        }`}
        style={
          !isMobileModal && device === "mobile"
            ? {
                backgroundImage:
                  "radial-gradient(circle, var(--border) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }
            : undefined
        }
      >
        {isMobileModal ? (
          /* Fullscreen Mobile View on Real Devices */
          <div className="relative h-full w-full flex flex-col overflow-hidden">
            <StoreMockup storeTheme={storeTheme} />
            <ChatWidget key={chatKey} config={config} device="mobile" />
          </div>
        ) : device === "mobile" ? (
          /* Realistic Luxury Smartphone Frame on Desktop */
          <div className="relative flex flex-col w-[375px] max-w-full h-[700px] border-[10px] border-stone-850 dark:border-stone-700 bg-background shadow-2xl rounded-none shrink-0 overflow-hidden ring-1 ring-black/20">
            {/* Top Phone Status Bar */}
            <div className="bg-stone-900 text-white px-4 py-1.5 flex items-center justify-between text-[10px] font-mono shrink-0 select-none z-50">
              <span className="font-bold">09:41</span>
              {/* Camera Pill / Notch */}
              <div className="h-3.5 w-20 bg-black rounded-none border border-stone-800" />
              <div className="flex items-center gap-1.5 text-stone-300">
                <Signal className="size-2.5" />
                <Wifi className="size-2.5" />
                <Battery className="size-3" />
              </div>
            </div>

            {/* Mobile Viewport Body */}
            <div className="relative flex-1 flex flex-col overflow-hidden bg-background">
              <StoreMockup storeTheme={storeTheme} />
              <ChatWidget key={chatKey} config={config} device={device} />
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="bg-stone-900 py-1 flex justify-center shrink-0">
              <div className="h-1 w-28 bg-stone-600 rounded-none" />
            </div>
          </div>
        ) : (
          /* Full Desktop Storefront Canvas */
          <div className="relative h-full w-full flex flex-col overflow-hidden">
            <StoreMockup storeTheme={storeTheme} />
            <ChatWidget key={chatKey} config={config} device={device} />
          </div>
        )}
      </div>
    </div>
  );
}
