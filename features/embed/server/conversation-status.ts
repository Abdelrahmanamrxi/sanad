import "server-only";
import { type StatusResolutionParams } from "../types";



/**
 * Determines whether a conversation should be marked AI Resolved, Needs Review, or Active
 * using the highest chunk similarity score and escalation/small-talk detection.
 */


export const SIMILARITY_CONFIDENCE_THRESHOLD = 0.42;


export function resolveConversationStatus({
  highestSimilarity,
  hasChunks,
  requestedEscalation,
  isSmallTalk,
  currentStatus,
  hasLead,
  similarityThreshold = SIMILARITY_CONFIDENCE_THRESHOLD,
}: StatusResolutionParams): "resolved" | "needs_attention" | "active" {
  // If the conversation already has a captured lead, maintain its lead workflow status
  if (hasLead) {
    return (currentStatus as "resolved" | "needs_attention" | "active") || "active";
  }

  // A confident document match requires chunks and a similarity score meeting the threshold
  const hasConfidentDocMatch =
    hasChunks &&
    typeof highestSimilarity === "number" &&
    highestSimilarity >= similarityThreshold;

  if (hasConfidentDocMatch && !requestedEscalation) {
    // Confident factual match from knowledge base -> AI Resolved
    return "resolved";
  }

  if (requestedEscalation || (!hasConfidentDocMatch && !isSmallTalk)) {
    // Low confidence match, missing docs, or escalated inquiry -> Needs Review
    return "needs_attention";
  }

  // Greeting / pleasantries without docs -> Active (or retain resolved if already resolved)
  return currentStatus === "resolved" ? "resolved" : "active";
}