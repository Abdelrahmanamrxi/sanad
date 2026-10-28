import { z } from "zod";
import { generateText, Output,type LanguageModel } from "ai";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import * as Sentry from "@sentry/nextjs"

export async function getConversationTitleAndSummary({
  conversationId,
  userMessage,
  model,
}: {
  conversationId: string;
  userMessage: string;
  model: LanguageModel;
}) {
  try {
    const { output } = await generateText({
      model,
      output: Output.object({
        schema: z.object({
          title: z
            .string()
            .describe(
              "Concise 2 to 4 word topic title in the language used (e.g. 'Shipping to Riyadh' or 'استفسار الشحن للرياض')",
            ),
          summary: z
            .string()
            .describe(
              "A single 1-sentence executive summary of the visitor inquiry and the resolution",
            ),
        }),
      }),
      prompt:`User inquired: ${userMessage}\n Generate a clean title and 1 sentence summary based on user's inquiry`
    });

    await supabaseAdminClient.from("conversations").update({
        title:output.title,
        summary:output.summary
    }).eq("id",conversationId)

  } catch (err) {

    Sentry.captureException(err, {
      extra: {
        feature: "conversation-summary",
        conversationId,
        userMessageSnippet: userMessage.slice(0, 30),
      },
    });
    // 2. Graceful Fallback: Never leave the title empty in the database!
    // Truncate the first few words of the user's inquiry as a fallback titl
    await supabaseAdminClient
      .from("conversations")
      .update({
        title: "Inquiry received",
        summary: userMessage.slice(0,20),
      })
      .eq("id", conversationId)
      

  }
}
