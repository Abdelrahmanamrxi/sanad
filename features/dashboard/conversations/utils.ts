export function formatChatTimestamp(dateStr?: string | null): string {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than a minute
  if (diffInSeconds < 60) {
    return "Just now";
  }

  // Less than 1 hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  // Less than 24 hours & same day
  const diffInHours = Math.floor(diffInMinutes / 60);
  const isToday = now.toDateString() === date.toDateString();
  if (isToday) {
    return `${diffInHours}h ago`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (yesterday.toDateString() === date.toDateString()) {
    return "Yesterday";
  }

  // Within the last 6 days: show day name (e.g., 'Mon', 'Wed')
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  // Older: 'Oct 28'
  const isSameYear = now.getFullYear() === date.getFullYear();
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(isSameYear ? {} : { year: "numeric" }),
  });
}

export function formatMessageTime(dateStr?: string | null): string {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const isToday = now.toDateString() === date.toDateString();

  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return timeStr;
  }

  const dateStrFormatted = date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

  return `${dateStrFormatted}, ${timeStr}`;
}

/**
 * Normalizes raw dense embedding cosine similarity (which practically ranges from ~0.35 to 0.85)
 * into a realistic, intuitive perceived match percentage (62% - 98%) for display in the UI.
 */
export function calculatePerceivedMatch(rawSimilarity?: number | null): number {
  if (rawSimilarity == null || isNaN(rawSimilarity) || rawSimilarity <= 0) {
    return 88;
  }

  // If already on 0-100 scale, normalize to 0-1
  const sim = rawSimilarity > 1 ? rawSimilarity / 100 : rawSimilarity;

  // Practical semantic search cosine boundaries for BGE-M3 / OpenAI
  const minBound = 0.35;
  const maxBound = 0.82;
  const normalized = Math.max(0, Math.min(1, (sim - minBound) / (maxBound - minBound)));

  // Smooth projection onto 62% - 98% perceived match range
  const perceived = 62 + normalized * 36;
  return Math.min(99, Math.max(50, Math.round(perceived)));
}
