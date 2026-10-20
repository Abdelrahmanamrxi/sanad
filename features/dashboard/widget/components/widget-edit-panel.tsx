"use client";

import React from "react";
import { Bot, Palette, MessageSquare, Code2 } from "lucide-react";
import type { WidgetConfig, EditTab } from "../types";
import TabIdentity from "./edit/tab-identity";
import TabAppearance from "./edit/tab-appearance";
import TabMessages from "./edit/tab-messages";
import TabEmbed from "./edit/tab-embed";

interface WidgetEditPanelProps {
  config: WidgetConfig;
  onChange: (config: WidgetConfig) => void;
  activeTab: EditTab;
  onTabChange: (tab: EditTab) => void;
  businessId?: string;
}

export default function WidgetEditPanel({
  config,
  onChange,
  activeTab,
  onTabChange,
  businessId = "workspace-live",
}: WidgetEditPanelProps) {
  const tabs = [
    {
      id: "identity" as const,
      label: "Identity",
      shortLabel: "ID",
      icon: Bot,
      color: "text-emerald-600 dark:text-emerald-400",
      activeBg: "bg-emerald-500/10 border-b-2 border-emerald-600 text-emerald-800 dark:text-emerald-300",
    },
    {
      id: "appearance" as const,
      label: "Styling",
      shortLabel: "Style",
      icon: Palette,
      color: "text-amber-600 dark:text-amber-400",
      activeBg: "bg-amber-500/10 border-b-2 border-amber-600 text-amber-800 dark:text-amber-300",
    },
    {
      id: "messages" as const,
      label: "Messages",
      shortLabel: "Msgs",
      icon: MessageSquare,
      color: "text-indigo-600 dark:text-indigo-400",
      activeBg: "bg-indigo-500/10 border-b-2 border-indigo-600 text-indigo-800 dark:text-indigo-300",
    },
    {
      id: "embed" as const,
      label: "Embed ",
      shortLabel: "Code",
      icon: Code2,
      color: "text-teal-600 dark:text-teal-400",
      activeBg: "bg-teal-500/10 border-b-2 border-teal-600 text-teal-800 dark:text-teal-300",
    },
  ];

  return (
    <div className="relative flex h-full flex-col border border-border bg-card shadow-xs">
      {/* ── 4 Crisp Top Tabs ── */}
      <div className="grid grid-cols-4 border-b border-border bg-background">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-3 px-2 font-sans text-xs transition-all rounded-none cursor-pointer ${
                isActive
                  ? `${tab.activeBg} font-bold`
                  : "border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <Icon className={`size-3.5 shrink-0 ${isActive ? "" : tab.color}`} />
              <span className="hidden sm:inline ">{tab.label}</span>
              <span className="text-[10px] sm:hidden font-mono">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* ── Scrollable Tab Content ── */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        {activeTab === "identity" && (
          <TabIdentity config={config} onChange={onChange} />
        )}
        {activeTab === "appearance" && (
          <TabAppearance config={config} onChange={onChange} />
        )}
        {activeTab === "messages" && (
          <TabMessages config={config} onChange={onChange} />
        )}
        {activeTab === "embed" && (
          <TabEmbed businessId={businessId} />
        )}
      </div>
    </div>
  );
}