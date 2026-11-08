import "server-only";
import { isGreetingOrSmallTalk } from "../utils";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { type PersistChatExchangeParams } from "../types";
import { resolveConversationStatus } from "./conversation-status";
import { recordMessageUsage } from "@/features/billing/services/usage";
import { getConversationTitleAndSummary } from "./conversation-summary";
import { sovereign } from "@/lib/ai/providers/sovereign";
import { CHAT_MODEL } from "@/lib/ai/models";
/**
 * Persists messages, resolves AI resolution status, records usage, and generates summary
 */
export async function persistChatExchangeAndStatus({
  conversationId,
  businessId,
  userMessage,
  assistantText,
  chunkIds,
  highestSimilarity,
  usage,
  latencyMs,
  priorMessagesCount,
}: PersistChatExchangeParams): Promise<void> {
  const requestedEscalation = assistantText.includes("[[SHOW_LEAD_FORM]]");
  const isSmallTalk = isGreetingOrSmallTalk(userMessage);

  // 1. Insert user message and assistant response
  const { error: insertError } = await supabaseAdminClient
    .from("messages")
    .insert([
      {
        conversation_id: conversationId,
        business_id: businessId,
        role: "user",
        content: userMessage,
        sources: [],
      },
      {
        conversation_id: conversationId,
        business_id: businessId,
        role: "assistant",
        content: assistantText,
        sources: requestedEscalation ? [] : chunkIds,
        top_score: requestedEscalation ? null : highestSimilarity,
        tokens_in: usage?.inputTokens ?? 0,
        tokens_out: usage?.outputTokens ?? 0,
        latency_ms: latencyMs,
      },
    ]);

  if (insertError) {
    console.error("[Chat Service] Failed to persist messages:", insertError);
  }

  // 2. Fetch current conversation to preserve lead tracking
  const { data: currentConvo } = await supabaseAdminClient
    .from("conversations")
    .select("status, has_lead")
    .eq("id", conversationId)
    .maybeSingle();

  // 3. Resolve target status based on similarity confidence
  const targetStatus = resolveConversationStatus({
    highestSimilarity,
    hasChunks: chunkIds.length > 0,
    requestedEscalation,
    isSmallTalk,
    currentStatus: currentConvo?.status,
    hasLead: currentConvo?.has_lead,
  });

  const { error: updateError } = await supabaseAdminClient
    .from("conversations")
    .update({
      last_message_at: new Date().toISOString(),
      status: targetStatus,
    })
    .eq("id", conversationId);

  if (updateError) {
    console.error("[Chat Service] Failed to update conversation status:", updateError);
  }

  // 4. Record usage counters
  await recordMessageUsage({
    businessId,
    tokensIn: usage?.inputTokens ?? 0,
    tokensOut: usage?.outputTokens ?? 0,
  });

  // 5. Generate summary if this is the first turn
  if (priorMessagesCount === 0) {
    await getConversationTitleAndSummary({
      userMessage,
      assistantResponse: assistantText,
      conversationId,
      model: sovereign.chat(CHAT_MODEL),
    });
  }
}

