import { inngest } from "@/lib/inngest";
import { supabaseAdminClient } from "@/lib/supabase/admin";
export const processDocument = inngest.createFunction(
  {
    id: "process-document",
    name: "Process Document Worker",
    retries: 2,
    triggers: {
      event: "sanad/process-document",
    },
    onFailure: async ({ error, event, step }) => {
      const { businessId, documentId } = event.data.event.data;

      await step.run("mark-as-failed", async () => {
        await supabaseAdminClient
          .from("documents")
          .update({
            doc_status: "failed",
            error_message: error.message || "Failed to process this file",
          })
          .eq("business_id", businessId)
          .eq("id", documentId);
      });
    },
  },

  async ({ event, step }) => {
    const { documentId, businessId } = event.data;
    await step.run("update-status-processing", async () => {
      const { error } = await supabaseAdminClient
        .from("documents")
        .update({ doc_status: "processing" })
        .eq("business_id", businessId)
        .eq("id", documentId);
    });

    await step.run("extract-and-chunk", async () => {
      return [];
    });

    await step.run("generate-embeddings", async () => {
      return [];
    });

    await step.run("mark-as-completed", async () => {
      return [];
    });
  },
);
