"use server";
import { getAuthContext } from "@/lib/auth";
import {
  type FilterTab,
  type ConversationItemAPI,
  type ConversationStatus,
  ConversationItem,
  ConversationMessage,
  ConversationSource,
} from "./types";
import { calculatePerceivedMatch } from "./utils";
import { generateEmbedding } from "../knowledge-base/services/embedding/generate-embedding";
import { chunkMarkdown } from "../knowledge-base/services/chunking-process/chunking";
import { EMBEDDING_MODEL } from "../knowledge-base/services/embedding/generate-embedding";
import { supabaseAdminClient } from "@/lib/supabase/admin";
export const getConversations = async ({
  filter,
  title,
  cursor,
  limit,
}: {
  filter: FilterTab;
  title?: string;
  cursor: string | null;
  limit: number;
}) => {
  const { supabase, businessId } = await getAuthContext();

  let query = supabase
    .from("conversations")
    .select(
      `
      id,
      title,
      summary,
      status,
      channel,
      origin_page,
      has_lead,
      visitor_id,
      started_at,
      last_message_at,
      lead:leads (
        id,
        name,
        email,
        phone,
        company,
        status
      )
    `,
    )
    .eq("business_id", businessId)
    .limit(limit)
    .order("started_at", { ascending: false });

  if (filter && filter !== "all") {
    if (filter === "leads") {
      query = query.eq("has_lead", true);
    } else {
      query = query.eq("status", filter);
    }
  }
  if (title && title.trim()) {
    query = query.eq("title", title);
  }
  if (cursor) {
    query = query.lt("started_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    console.log(error);
    throw new Error("Failed to load conversations.");
  }

  const conversations: ConversationItem[] = (data ?? []).map(
    (row: ConversationItemAPI) => {
      const lead = Array.isArray(row.lead) ? row.lead[0] : row.lead;

      return {
        id: row.id,
        visitorId: row.visitor_id,
        title: row.title || "Customer Inquiry",
        channel: row.channel,
        status: row.status,
        hasLead: row.has_lead,
        lead: lead, // typed as ConversationLead
        originPage: row.origin_page,
        summary: row.summary,
        startedAt: row.started_at,
        lastMessageAt: row.last_message_at,
      };
    },
  );
  const nextCursor =
    data.length === limit ? data[data.length - 1].started_at : null;

  return { conversations: conversations, nextCursor };
};

export const getMessages = async ({
  conversationId,
  cursor,
  limit = 20,
}: {
  conversationId: string;
  cursor: string | null;
  limit: number;
}) => {
  const { supabase } = await getAuthContext();

  let query = supabase
    .from("messages")
    .select("id, role, content, sources, top_score, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (cursor) {
    query = query.gt("created_at", cursor);
  }

  const { data: rawMessages, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Failed to load messages for this conversation.");
  }

  // 1. Gather all unique chunk IDs cited across the messages
  const chunkIds = [
    ...new Set(
      (rawMessages ?? []).flatMap((m) => m.sources || []).filter(Boolean),
    ),
  ];

  // 2. Fetch chunks and their document names if chunks exist
  const chunkMap = new Map<string, { documentName: string; content: string }>();

  if (chunkIds.length > 0) {
    const { data: chunks } = await supabase
      .from("chunks")
      .select("id, content, document_id")
      .in("id", chunkIds);

    const docIds = [
      ...new Set((chunks ?? []).map((c) => c.document_id).filter(Boolean)),
    ];

    let docNameMap = new Map<string, string>();
    if (docIds.length > 0) {
      const { data: docs } = await supabase
        .from("documents")
        .select("id, name")
        .in("id", docIds);

      if (docs) {
        docNameMap = new Map(docs.map((d) => [d.id, d.name]));
      }
    }

    if (chunks) {
      for (const chunk of chunks) {
        chunkMap.set(chunk.id, {
          content: chunk.content,
          documentName:
            docNameMap.get(chunk.document_id) || "Knowledge Base Document",
        });
      }
    }
  }

  // 3. Map database rows to UI ConversationMessage format
  const messages: ConversationMessage[] = (rawMessages ?? []).map((row) => {
    let source: ConversationSource | undefined = undefined;

    const primaryChunkId = row.sources?.[0];
    if (primaryChunkId && chunkMap.has(primaryChunkId)) {
      const chunkData = chunkMap.get(primaryChunkId)!;
      source = {
        documentName: chunkData.documentName,
        similarity: calculatePerceivedMatch(row.top_score),
        chunkSnippet: chunkData.content,
      };
    }

    const rawContent = row.content || "";
    const hasLeadFormTrigger =
      rawContent.includes("[[SHOW_LEAD_FORM]]") ||
      /\[\[\s*SHOW_LEAD_FORM\s*\]\]/i.test(rawContent);
    const cleanContent = rawContent
      .replace(/\[\[\s*SHOW_LEAD_FORM\s*\]\]/gi, "")
      .trim();

    return {
      id: row.id,
      role: row.role as "user" | "assistant",
      content: cleanContent,
      createdAt: row.created_at,
      source,
      hasLeadFormTrigger,
    };
  });

  const nextCursor =
    rawMessages && rawMessages.length === limit
      ? rawMessages[rawMessages.length - 1].created_at
      : null;

  return {
    messages,
    nextCursor,
  };
};

export const markResolved = async (
  conversationId: string,
  type: ConversationStatus,
) => {
  const { supabase, businessId } = await getAuthContext();

  const { data, error } = await supabase
    .from("conversations")
    .update({
      status: type,
    })
    .eq("id", conversationId)
    .eq("business_id", businessId)
    .select("id");

  if (error) {
    console.error("[markResolved] Failed to update conversation:", error);
    throw new Error(error.message || "Failed to update conversation");
  }
  return { data, success: true };
};

export async function getActiveDocuments(): Promise<{
  success: boolean;
  documents?: Array<{
    name: string;
    id: string;
    current_index_version?: string | null;
  }>;
  message?: string;
}> {
  const { supabase, businessId } = await getAuthContext();

  const { data: documents, error } = await supabase
    .from("documents")
    .select("name, id, current_index_version")
    .eq("business_id", businessId)
    .eq("doc_status", "active");

  if (error || !documents) {
    return {
      success: false,
      message: error?.message || "Failed to load documents",
    };
  }
  if (documents.length <= 0) {
    return {
      success: false,
      message:
        "There must be a document for the citation to be added to the Knowledge base",
    };
  }
  return {
    success: true,
    documents,
  };
}

export async function AddNewCitation(formData: {
  conversationId: string;
  documentId: string;
  answer: string;
  domain: string;
  inquiry: string;
  currentIndexVersion: string;
}): Promise<{ success: boolean; message?: string }> {
  const { supabase, businessId } = await getAuthContext();

  const inquiry = formData.inquiry;
  const answer = formData.answer;
  const domain = formData.domain;

  const markDownText = `# ${domain.trim()}\n\n## ${inquiry.trim()}\n\n${answer.trim()}`;

  const chunks = await chunkMarkdown(markDownText);

  if (!chunks || chunks.length === 0) {
    return { success: false, message: "Failed to process data" };
  }

  let indexVersion = formData.currentIndexVersion;
  if (!indexVersion) {
    const { data: docData } = await supabaseAdminClient
      .from("documents")
      .select("current_index_version")
      .eq("id", formData.documentId)
      .eq("business_id", businessId)
      .single();

    indexVersion = docData?.current_index_version || crypto.randomUUID();
  }

  // Retrieve highest chunk Index to avoid unique constraint chunk index violations

  const { data: lastChunk } = await supabaseAdminClient
    .from("chunks")
    .select("chunk_index")
    .eq("document_id", formData.documentId)
    .eq("index_version", indexVersion)
    .order("chunk_index", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Index we are going to start at (1+ last previous indexed value)
  const startIndex = (lastChunk?.chunk_index ?? -1) + 1;

  const textsToEmbed = chunks.map((c) =>
    c.headingPath ? `${c.headingPath}\n\n${c.content}` : c.content,
  );
  const embeddings = await generateEmbedding(textsToEmbed);

  if(!embeddings){
    return {
      success:false,
      message:"Failed to understand context."
    }
  }
  const rows = chunks.map((c, i) => ({
    document_id: formData.documentId,
    business_id: businessId,
    chunk_index: startIndex + i,
    content: c.content,
    heading_path: c.headingPath,
    embedding: embeddings[i],
    embedding_model: EMBEDDING_MODEL,
    index_version: indexVersion,
    metadata: {
      char_count: c.content.length,
      source_type: "manual_citation",
    },
  }));


  const { error: insertError } = await supabaseAdminClient
    .from("chunks")
    .insert(rows);

  if(insertError){
    console.error("[AddNewCitation] Failed to insert chunks:", insertError);
    return {
      success:false,
      message: insertError.message || "Failed to update citation data."
    }
  }

  const { error: updateError } = await supabase
    .from("conversations")
    .update({ status: "resolved" })
    .eq("id", formData.conversationId)
    .eq("business_id", businessId);

  if (updateError) {
    return {
      success: false,
      message: "Citation saved, but failed to update conversation status.",
    };
  }

  return {
    success: true,
  };
}
