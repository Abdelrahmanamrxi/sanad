import { generateText, type LanguageModel } from "ai";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import * as Sentry from "@sentry/nextjs";

export async function getConversationTitleAndSummary({
  conversationId,
  userMessage,
  assistantResponse,
  model,
}: {
  conversationId: string;
  userMessage: string;
  assistantResponse?: string;
  model: LanguageModel;
}) {
  let cleanTitle = userMessage.trim().slice(0, 45) || "Inquiry";
  let cleanSummary = "Customer inquiry received.";

  try {
    const cleanedAssistantSnippet = (assistantResponse || "")
      .replace("[[SHOW_LEAD_FORM]]", "")
      .trim()
      .slice(0, 400);

    // Generate plain-text Title & Summary without brittle json_schema modes
    const { text } = await generateText({
      model,
      system: `You are an executive conversation summarizer for a store customer support dashboard.
Inquiries may be in Arabic, English, or Franco-Arabic / Arabizi (e.g., 'mwa3eed el dacatra' means 'مواعيد الأطباء / Doctor schedules', 'bkam' means 'بكم / price').
Translate any Franco-Arabic or slang to its real meaning.
Do NOT use meta-commentary like "The user is asking in Egyptian Arabic about...".
Respond EXACTLY in this 2-line format (in Arabic if the inquiry was Arabic/Franco, or English if English):
Title: [2 to 4 words topic]
Summary: [1 sentence direct executive summary of what the customer asked and the resolution]`,
      prompt: `Customer Message: "${userMessage}"\nAssistant Answer: "${cleanedAssistantSnippet}"`,
    });

    // Parse the 2 lines reliably
    const titleMatch = text.match(/Title:\s*(.+)/i);
    const summaryMatch = text.match(/Summary:\s*(.+)/i);

    const parsedTitle = titleMatch?.[1]?.replace(/[*#"`]/g, "").trim();
    const parsedSummary = summaryMatch?.[1]?.replace(/[*#"`]/g, "").trim();

    if (parsedTitle && parsedTitle.length > 1 && parsedTitle.length < 60) {
      cleanTitle = parsedTitle;
    }

    if (parsedSummary && parsedSummary.length > 5) {
      cleanSummary = parsedSummary;
    } else if (cleanedAssistantSnippet.length > 0) {
      cleanSummary = cleanedAssistantSnippet.slice(0, 150);
    }
  } catch (err) {
    console.error("[Conversation Summary] Generation failed:", err);
    Sentry.captureException(err, {
      extra: {
        feature: "conversation-summary",
        conversationId,
        userMessageSnippet: userMessage.slice(0, 40),
      },
    });

    cleanSummary = (assistantResponse || userMessage)
      .replace("[[SHOW_LEAD_FORM]]", "")
      .trim()
      .slice(0, 120);
  }

  // Update conversation record
  try {
    await supabaseAdminClient
      .from("conversations")
      .update({
        title: cleanTitle,
        summary: cleanSummary,
      })
      .eq("id", conversationId);
  } catch (dbErr) {
    console.error("[Conversation Summary] DB update failed:", dbErr);
  }
}
