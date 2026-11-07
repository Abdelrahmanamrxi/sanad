import { generateText, type LanguageModel } from "ai";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import * as Sentry from "@sentry/nextjs";

function sanitizeSummaryText(str: string): string {
  if (!str) return "";
  return str
    .replace(/客户/g, "العميل")
    .replace(/根据不同/g, "حسب مختلف")
    .replace(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g, "") // Strip any residual CJK Chinese/Japanese/Korean glyphs
    .replace(/[*#"`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

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
  let cleanTitle = sanitizeSummaryText(userMessage).slice(0, 45) || "Inquiry";
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

CRITICAL LANGUAGE RULES:
1. Output strictly in natural Arabic (الفصحى الميسرة) if the customer wrote in Arabic or Franco-Arabic. Output in English ONLY if the inquiry was in pure English.
2. NEVER output Chinese characters (Hanzi like 客户 or 根据), Japanese, or any Asian scripts under any circumstances.
3. Always use standard Arabic words for client/customer (e.g. 'سأل العميل عن...' or 'استفسر الزائر عن...').

Respond EXACTLY in this 2-line format:
Title: [2 to 4 words topic]
Summary: [1 sentence direct executive summary of what the customer asked and the resolution]`,
      prompt: `رسالة العميل (User Inquiry): "${userMessage}"\nإجابة المساعد (Assistant Answer): "${cleanedAssistantSnippet}"`,
    });

    // Parse the 2 lines reliably
    const titleMatch = text.match(/Title:\s*(.+)/i);
    const summaryMatch = text.match(/Summary:\s*(.+)/i);

    const parsedTitle = titleMatch?.[1] ? sanitizeSummaryText(titleMatch[1]) : "";
    const parsedSummary = summaryMatch?.[1] ? sanitizeSummaryText(summaryMatch[1]) : "";

    if (parsedTitle && parsedTitle.length > 1 && parsedTitle.length < 60) {
      cleanTitle = parsedTitle;
    }

    if (parsedSummary && parsedSummary.length > 5) {
      cleanSummary = parsedSummary;
    } else if (cleanedAssistantSnippet.length > 0) {
      cleanSummary = sanitizeSummaryText(cleanedAssistantSnippet.slice(0, 150));
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

    cleanSummary = sanitizeSummaryText(
      (assistantResponse || userMessage).replace("[[SHOW_LEAD_FORM]]", "").slice(0, 120)
    );
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
