import { useState, useRef, useCallback } from "react";
import {
  type PlaygroundConfig,
  type PlaygroundMessage,
  type PlaygroundChunk,
} from "../types";

import axios from "axios";

export default function usePlaygroundChat(config: PlaygroundConfig) {
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [error, setError] = useState<string>("");
  const [isStreaming, setStreaming] = useState<boolean>(false); // To check if response is currently being received or not
  const abortController = useRef<AbortController | null>(null);
  const messagesRef = useRef<PlaygroundMessage[]>(messages);
  messagesRef.current = messages;

  const sendMessage = useCallback(
    async (query: string) => {
      if (!query.trim() || isStreaming) return; // you can't send an empty text or while message's still streaming

      {
        /**
        Allows javascript controller to cancels requests.
     --   creates a new controller for this request
        
        */
      }

      abortController.current = new AbortController();
      const userMessage: PlaygroundMessage = {
        id: `usr-${Date.now()}`,
        role: "user",
        content: query,
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const aiMsg: PlaygroundMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: "",
        createdAt: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Assemble full conversation history including the new user message
      const historyPayload = [
        ...messagesRef.current
          .filter((m) => m.content.trim() && !m.content.startsWith("[Error]"))
          .map((m) => ({
            role: m.role,
            content: m.content,
          })),
        {
          role: "user" as const,
          content: query.trim(),
        },
      ];

      setMessages((prev) => {
        return [...prev, userMessage, aiMsg];
      });
      setStreaming(true);
      setError("");
      try {
        const response = await axios.post(
          "/api/playground/chat",
          {
            query: query.trim(),
            messages: historyPayload,
            systemPresets:config,
          },
          {
            adapter: "fetch",
            responseType: "stream",
            signal: abortController.current.signal,
          },
        );

        // Parse custom RAG headers
        const rawSources = response.headers["x-sources"];
        const rawLatency = response.headers["x-latency"];

        const sources: PlaygroundChunk[] = rawSources
          ? JSON.parse(decodeURIComponent(rawSources))
          : [];

        const latencyMs = rawLatency
          ? JSON.parse(decodeURIComponent(rawLatency))
          : 0;

        // Read stream chunk by chunk

        const stream = response.data as ReadableStream<Uint8Array>;
        const reader = stream.getReader();
        const decoder = new TextDecoder(); // converts bytes to text

        let accumlatedText = "";
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          accumlatedText += decoder.decode(value, { stream: true });

          setMessages((prev) => {
            return prev.map((msg) => {
              if (msg.id == aiMsg.id) {
                return {
                  ...msg,
                  content: accumlatedText,
                  retrievedChunks: sources,
                  metrics: {
                    latencyMs: Number(latencyMs),
                    model: config.model,
                  },
                };
              }
              return msg;
            });
          });
        }
      } catch (err: unknown) {
        if (axios.isCancel(err) || (err as Error)?.name === "CanceledError")
          return;

        let message = "Failed to generate a response";
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.error || err.message;
        } else if (err instanceof Error) {
          message = err.message;
        }

        setError(message);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsg.id
              ? {
                  ...msg,
                  content: `[Error] ${message}`,
                }
              : msg,
          ),
        );
      } finally {
        setStreaming(false);
      }
    },
    [config, isStreaming],
  );

  const stop = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      setStreaming(false);
    }
  }, []);
  return{
    isStreaming,
    error,
    sendMessage,
    messages,
    setMessages,
    stop
  }
}
