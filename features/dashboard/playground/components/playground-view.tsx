"use client";

import React, { useState } from "react";
import { PlaygroundHeader } from "./playground-header";
import { PlaygroundChatView } from "./playground-chat-view";
import { PlaygroundInputBar } from "./playground-input-bar";
import { PlaygroundInspectorPanel } from "./playground-inspector-panel";
import { DEFAULT_CONFIG, AVAILABLE_MODELS } from "../constants";
import {
  initialMockMessages,
  initialMockChunks,
  initialMockMetrics,
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
  const [messages, setMessages] =
    useState<PlaygroundMessage[]>(initialMockMessages);
  const [input, setInput] = useState(initialQuery || "");
  const [isRunning, setIsRunning] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<InspectorTab>("sources");
  const [retrievedChunks, setRetrievedChunks] =
    useState<PlaygroundChunk[]>(initialMockChunks);
  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(
    initialMockChunks[0]?.id || null,
  );
  const [activeKbPrompt, setActiveKbPrompt] = useState<string | null>(
    initialQuery || null,
  );

  const currentModel =
    AVAILABLE_MODELS.find((m) => m.id === config.model) || AVAILABLE_MODELS[0];

  /* ── Interactive Simulation ── */
  const executeQuery = (queryText: string) => {
    if (!queryText.trim() || isRunning) return;

    const trimmed = queryText.trim();
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: PlaygroundMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setActiveKbPrompt(null);
    setIsRunning(true);

    // Simulate realistic response delivery (400ms)
    setTimeout(() => {
      const simulated = generateSimulatedResponse(trimmed, currentModel.name);

      const latencyMs = Math.floor(Math.random() * 60) + 290;
      const promptTokens = Math.floor(trimmed.length * 1.3) + 320;
      const completionTokens = Math.floor(simulated.answer.length * 0.7);

      const assistantMessage: PlaygroundMessage = {
        id: `ast-${Date.now()}`,
        role: "assistant",
        content: simulated.answer,
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        retrievedChunks: simulated.chunks,
        metrics: {
          latencyMs,
          retrievalMs: 70,
          generationMs: latencyMs - 70,
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
          model: currentModel.name,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setRetrievedChunks(simulated.chunks);
      setIsRunning(false);
    }, 400);
  };

  /* ── Chunk Selection from Chat Citations ── */
  const handleSelectChunkForInspection = (chunk: PlaygroundChunk) => {
    setSelectedChunkId(chunk.id);
    setActiveTab("sources");
    if (!isInspectorOpen) {
      setIsInspectorOpen(true);
    }
  };

  /* ── Chunk Inclusion Toggle ── */
  const handleToggleChunkInclusion = (chunkId: string) => {
    setRetrievedChunks((prev) =>
      prev.map((chunk) =>
        chunk.id === chunkId
          ? { ...chunk, includedInContext: !chunk.includedInContext }
          : chunk,
      ),
    );
  };

  /* ── Reset Conversation ── */
  const handleResetConversation = () => {
    setMessages([]);
    setRetrievedChunks([]);
    setSelectedChunkId(null);
    setActiveKbPrompt(null);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col border border-border bg-card">
      {/* ── Top Header ── */}
      <PlaygroundHeader
        config={config}
        onConfigChange={setConfig}
        onResetConversation={handleResetConversation}
        isInspectorOpen={isInspectorOpen}
        onToggleInspector={() => setIsInspectorOpen((prev) => !prev)}
        messageCount={messages.length}
      />

      {/* ── Main Workspace ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left / Center Column: Realistic Customer Chat */}
        <div className="flex flex-1 flex-col overflow-hidden bg-background">
          <PlaygroundChatView
            messages={messages}
            isRunning={isRunning}
            activeKbPrompt={activeKbPrompt}
            onRunKbPrompt={(prompt) => executeQuery(prompt)}
            onDismissKbPrompt={() => setActiveKbPrompt(null)}
            onSelectStarterQuery={(query) => {
              setInput(query);
            }}
            onSelectChunkForInspection={handleSelectChunkForInspection}
          />

          <PlaygroundInputBar
            input={input}
            setInput={setInput}
            onSubmit={() => executeQuery(input)}
            isRunning={isRunning}
            modelName={currentModel.name}
          />
        </div>

        {/* Right Column: 2-Tab Inspector Panel */}
        {isInspectorOpen && (
          <div className="w-full lg:w-[420px] xl:w-[450px] shrink-0 overflow-hidden border-s border-border">
            <PlaygroundInspectorPanel
              activeTab={activeTab}
              onTabChange={setActiveTab}
              chunks={retrievedChunks}
              onToggleChunkInclusion={handleToggleChunkInclusion}
              selectedChunkId={selectedChunkId}
              config={config}
              onConfigChange={setConfig}
            />
          </div>
        )}
      </div>
    </div>
  );
}
