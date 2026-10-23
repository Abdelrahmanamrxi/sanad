import { inngest } from "@/lib/clients/connections/inngest";
import { supabaseAdminClient } from "@/lib/supabase/admin";
import { extractFileText } from "../services/chunking-process/extract-text";
import { chunkMarkdown } from "../services/chunking-process/chunking";
import {
  EMBEDDING_MODEL,
  generateEmbedding,
} from "../services/embedding/generate-embedding";
import { generateSuggestions } from "../services/generate-suggestions";
import { NonRetriableError } from "inngest";
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
      await supabaseAdminClient
        .from("documents")
        .update({ doc_status: "processing" })
        .eq("business_id", businessId)
        .eq("id", documentId);
    });

    const doc = await step.run("download-file", async () => {
      const { data, error } = await supabaseAdminClient
        .from("documents")
        .select("storage_path, mime_type, name")
        .eq("business_id", businessId)
        .eq("id", documentId)
        .single();

      if (!data || error) {
        throw new Error(
          `Couldn't find document matching criteria: ${error?.message || "No data"}`,
        );
      }
      return data;
    });

    const text = await step.run("extract-markdown", async () => {
      const { data, error } = await supabaseAdminClient.storage
        .from("sanad-file-storage")
        .download(doc.storage_path);

      if (!data || error) {
        throw new Error("Failed to download file from storage.");
      }
      return await extractFileText(data, doc.storage_path);
    });

    const chunks = await step.run("structure-and-chunk", async () => {
      const result = await chunkMarkdown(text);
      if (!result || result.length === 0) {
        throw new NonRetriableError(
          "No readable text or chunks could be extracted from this document",
        );
      }
      return result;
    });

    const suggestedQuestions = await step.run(
      "generate-questions",
      async () => {
        const samples = chunks
          .slice(0, 2)
          .map((c) => c.content)
          .join("\n\n");
        return await generateSuggestions(samples);
      },
    );

    const indexVersion = await step.run("create-index-version", async () => {
      return crypto.randomUUID();
    });

    await step.run("generate-embeddings", async () => {
      // Generate Embeddings
      const textToBeEmbedded = chunks.map((c) =>
        c.headingPath ? `${c.headingPath}\n\n${c.content}` : c.content,
      );

      const embeddings = await generateEmbedding(textToBeEmbedded);

      // Prepare Chunk Rows to DB
      const rows = chunks.map((c, i) => ({
        document_id: documentId,
        business_id: businessId,
        chunk_index: c.chunkIndex,
        content: c.content,
        embedding_model: EMBEDDING_MODEL,
        heading_path: c.headingPath,
        embedding: embeddings[i],
        index_version: indexVersion,
        metadata: {
          file_name: doc.name,
          mime_type: doc.mime_type,
          char_count: c.content.length,
        },
      }));

      const { error } = await supabaseAdminClient.from("chunks").insert(rows);

      if (error) {
        throw new Error(
          `Failed to store relevant data due to ${error.message} `,
        );
      }
    });

    await step.run("mark-as-completed", async () => {
      const { error: updateError } = await supabaseAdminClient
        .from("documents")
        .update({
          doc_status: "ready",
          error_message: null,
          suggested_questions: suggestedQuestions,
          current_index_version: indexVersion,
          stats: {
            total_chunks: chunks.length,
          },
        })
        .eq("business_id", businessId)
        .eq("id", documentId);

      if (updateError) {
        throw new Error(
          `Failed to extract the whole document due to ${updateError.message}`,
        );
      }
      const { error: deletionError } = await supabaseAdminClient
        .from("chunks")
        .delete()
        .eq("document_id", documentId)
        .neq("index_version", indexVersion);

      if (deletionError) {
        throw new Error(
          `Failed to update the document due to ${deletionError.message}`,
        );
      }
    });
  },
);
