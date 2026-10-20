"use client";

import React, { useState, useEffect } from "react";
import { PlaygroundHeader } from "./playground-header";
import { PlaygroundChatView } from "./playground-chat-view";
import { PlaygroundInputBar } from "./playground-input-bar";
import { PlaygroundInspectorPanel } from "./playground-inspector-panel";
import { DEFAULT_CONFIG, AVAILABLE_MODELS } from "../constants";
import usePlaygroundChat from "../hooks/use-chat";
import {
  initialMockMessages,
  initialMockChunks,
  generateSimulatedResponse,
} from "../mock-data";
import type {
  PlaygroundConfig,
  PlaygroundMessage,
  PlaygroundChunk,
  InspectorTab,
} from "../types";

interface PlaygroundViewProps {
  initialQuery?: string;
}

export function PlaygroundView({ initialQuery }: PlaygroundViewProps) {
  const [config, setConfig] = useState<PlaygroundConfig>(DEFAULT_CONFIG);

  const { isStreaming, error, messages, setMessages, stop, sendMessage } =
    usePlaygroundChat(config);

  const latestAssistantMessage = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && m.retrievedChunks && m.retrievedChunks.length>0);

  const activeChunks=latestAssistantMessage?.retrievedChunks?.sort((a,b)=>b.similarity-a.similarity)


  const [input, setInput] = useState(initialQuery || "");

  const [isExpanded, setIsExpanded] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<InspectorTab>("sources");
  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(
    initialMockChunks[0]?.id || null,
  );
  const [activeKbPrompt, setActiveKbPrompt] = useState<string | null>(
    initialQuery || null,
  );

  const currentModel =
    AVAILABLE_MODELS.find((m) => m.id === config.model) || AVAILABLE_MODELS[0];
 
  // Allow exiting fullscreen/expanded studio mode using Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  /* ── Interactive Simulation ── */
  const executeQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || isStreaming) return;

    // Automatically expand the container so user sees the full chat edge-to-edge
    if (!isExpanded) {
      setIsExpanded(true);
    }

    // Automatically close the inspector drawer so it doesn't obstruct or squeeze the chat
    if (isInspectorOpen) {
      setIsInspectorOpen(false);
    }

    setInput("");
    setActiveKbPrompt(null);
    sendMessage(trimmed);
  };

  /* ── Chunk Selection from Chat Citations ── */
  const handleSelectChunkForInspection = (chunk: PlaygroundChunk) => {
    setSelectedChunkId(chunk.id);
    setActiveTab("sources");
    setIsInspectorOpen(true);
  };

  /* ── Chunk Inclusion Toggle ── */


  /* ── Reset Conversation ── */
  const handleResetConversation = () => {
    stop()
    setMessages([]);
    setSelectedChunkId(null);
    setActiveKbPrompt(null);
  };

  return (
    <div
      className={
        isExpanded
          ? "fixed inset-0 z-50 flex flex-col bg-background overflow-hidden"
          : "relative flex h-[calc(100vh-8rem)] flex-col border border-border bg-card shadow-xs overflow-hidden"
      }
    >
      {/* ── Top Header ── */}
      <PlaygroundHeader
        config={config}
        onConfigChange={setConfig}
        onResetConversation={handleResetConversation}
        isInspectorOpen={isInspectorOpen}
        onToggleInspector={() => setIsInspectorOpen((prev) => !prev)}
        messageCount={messages.length}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded((prev) => !prev)}
      />

      {/* ── Full Chat Workspace ── */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Whole Chat Column: Full Width, Expansive & Centered */}
        <div className="flex flex-1 flex-col overflow-hidden bg-background">
          <PlaygroundChatView
            messages={messages}
            isRunning={isStreaming}
            activeKbPrompt={activeKbPrompt}
            onRunKbPrompt={(prompt) => executeQuery(prompt)}
            onDismissKbPrompt={() => setActiveKbPrompt(null)}
            onSelectStarterQuery={(query) => {
              executeQuery(query);
            }}
            onSelectChunkForInspection={handleSelectChunkForInspection}
          />

          <PlaygroundInputBar
            input={input}
            setInput={setInput}
            onSubmit={() => executeQuery(input)}
            isRunning={isStreaming}
            modelName={currentModel.name}
          />
        </div>

        {/* Slide-Over Drawer: Settings & Sources (Does not squeeze the chat!) */}
        {isInspectorOpen && (
          <>
            {/* Backdrop on small screens */}
            <div
              className="fixed inset-0 bg-background/50 backdrop-blur-2xs z-20 lg:hidden"
              onClick={() => setIsInspectorOpen(false)}
            />

            {/* Slide-over inspector panel */}
            <div className="absolute top-0 right-0 bottom-0 z-30 w-full sm:w-[440px] shadow-2xl bg-card border-s border-border flex flex-col transition-all">
              <PlaygroundInspectorPanel
                activeTab={activeTab}
                onTabChange={setActiveTab}
                chunks={activeChunks?activeChunks : []}
                onToggleChunkInclusion={()=>{}}
                selectedChunkId={selectedChunkId || activeChunks?.[0]?.id || null}
                config={config}
                onConfigChange={setConfig}
                onClose={() => setIsInspectorOpen(false)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
