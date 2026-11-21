"use client";

import React, { useState } from "react";
import { Plus, Trash2, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { WidgetConfig } from "../../types";

interface TabMessagesProps {
  config: WidgetConfig;
  onChange: (config: WidgetConfig) => void;
}

export default function TabMessages({ config, onChange }: TabMessagesProps) {
  const { t } = useTranslation();
  const [newStarterText, setNewStarterText] = useState("");

  const handleAddStarter = () => {
    const trimmed = newStarterText.trim();
    if (!trimmed || config.starterQuestions.length >= 6) return;
    onChange({
      ...config,
      starterQuestions: [...config.starterQuestions, trimmed],
    });
    setNewStarterText("");
  };

  const handleRemoveStarter = (index: number) => {
    onChange({
      ...config,
      starterQuestions: config.starterQuestions.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Top Helper Banner ── */}
      <div className="flex items-center gap-2.5 border border-indigo-500/30 bg-indigo-500/10 p-3 rounded-none">
        <MessageSquare className="size-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
        <p className="text-xs font-sans text-indigo-950 dark:text-indigo-200 leading-relaxed">
          {t("dashboard.widget.messagesTab.helperBanner")}
        </p>
      </div>

      {/* 1. Welcome Greeting */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("dashboard.widget.messagesTab.welcomeGreeting")}
          </label>
          <span className="font-mono text-[10px] text-primary font-bold">
            {t("dashboard.widget.messagesTab.welcomeGreetingChars", {
              count: config.welcomeMessage.length,
            })}
          </span>
        </div>
        <textarea
          value={config.welcomeMessage}
          maxLength={250}
          onChange={(e) => onChange({ ...config, welcomeMessage: e.target.value })}
          rows={4}
          dir="auto"
          className="w-full border border-border bg-background p-3 font-sans text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all resize-y rounded-none leading-relaxed shadow-2xs"
          placeholder={t("dashboard.widget.messagesTab.welcomePlaceholder")}
        />
        <p className="mt-1 text-[11px] text-muted-foreground font-sans">
          {t("dashboard.widget.messagesTab.welcomeHelper")}
        </p>
      </div>

      {/* 2. Quick Question Starters */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("dashboard.widget.messagesTab.startersTitle")}
          </label>
          <span className="font-mono text-[10px] text-primary font-bold">
            {t("dashboard.widget.messagesTab.startersCounter", {
              count: config.starterQuestions.length,
            })}
          </span>
        </div>
        <p className="mb-3 text-[11px] text-muted-foreground font-sans">
          {t("dashboard.widget.messagesTab.startersHelper")}
        </p>

        {/* List of current questions */}
        <div className="space-y-2 mb-3">
          {config.starterQuestions.map((question, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-2.5 border border-border bg-background p-2.5 rounded-none shadow-2xs group hover:border-primary/60 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex size-5 shrink-0 items-center justify-center font-mono text-[10px] font-bold bg-primary/15 text-primary border border-primary/30 rounded-none">
                  {index + 1}
                </span>
                <span className="font-sans text-xs font-medium text-foreground truncate" dir="auto">
                  {question}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveStarter(index)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 p-1.5 rounded-none cursor-pointer"
                title={t("dashboard.widget.messagesTab.removeTooltip")}
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add question form */}
        {config.starterQuestions.length < 6 && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newStarterText}
              onChange={(e) => setNewStarterText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddStarter())}
              placeholder={t("dashboard.widget.messagesTab.addPlaceholder")}
              dir="auto"
              className="flex-1 border border-border bg-background px-3 py-2 font-sans text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all rounded-none shadow-2xs"
            />
            <button
              type="button"
              onClick={handleAddStarter}
              disabled={!newStarterText.trim()}
              className="flex items-center gap-1 border border-primary bg-primary px-4 py-2 font-sans text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 rounded-none shadow-2xs shrink-0 cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>{t("dashboard.widget.messagesTab.addButton")}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
