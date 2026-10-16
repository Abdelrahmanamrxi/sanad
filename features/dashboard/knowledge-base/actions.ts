"use server";
import { type ChunkItem, DocumentItem } from "./types";
import { getAuthContext } from "@/lib/auth";
import { MimeType } from "./types";
import { FetchDocumentsParams } from "./types";
import { inngest } from "@/lib/inngest";
import { removeFromStorage } from "./repository/document-storage";

export async function fetchDocuments(
  params: FetchDocumentsParams,
): Promise<DocumentItem[]> {
  const { supabase, businessId } = await getAuthContext();

  let query = supabase
    .from("documents")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (params?.mimeType !== "all" && params.mimeType) {
    query = query.eq("mime_type", params.mimeType);
  }

  if (params?.name?.trim()) {
    query = query.ilike("name", `%${params.name}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to load documents.");
  }

  return (data as DocumentItem[]) ?? [];
}
export async function fetchDocumentDetails(id: string): Promise<ChunkItem[]> {
  const { supabase, businessId } = await getAuthContext();

  const { data, error } = await supabase
    .from("chunks")
    .select("*")
    .eq("document_id", id)
    .eq("business_id", businessId);

  if (error) {
    throw new Error("Failed to load document details.");
  }

  return (data as ChunkItem[]) ?? [];
}

export async function deleteDocument(documentId: string) {
  const { supabase, businessId } = await getAuthContext();

  // 1. Fetch document to retrieve storage path
  const { data: doc, error: fetchError } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("business_id", businessId)
    .eq("id", documentId)
    .single();

  if (fetchError || !doc) {
    throw new Error("Document not found");
  }

  // 2. Delete database row (chunks cascade delete automatically)
  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .eq("business_id", businessId)
    .eq("id", documentId);

  if (deleteError) {
    throw new Error("Failed to delete document from database");
  }

  // 3. Remove file from Supabase storage
  if (doc.storage_path) {
    await removeFromStorage(supabase, doc.storage_path);
  }

  return true;
}

export async function resyncDocument(documentId: string) {
  const { supabase, businessId } = await getAuthContext();

  const { data: doc, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("business_id", businessId)
    .single();

  if (error || !doc) {
    throw new Error("Document not found");
  }
  await supabase
    .from("documents")
    .update({
      doc_status: "queued",
      error_message: null,
    })
    .eq("id", documentId)
    .eq("business_id", businessId);

  try {
    await inngest.send({
      name: "sanad/process-document",
      data: {
        businessId,
        documentId,
      },
    });
  } catch {
     await supabase
      .from("documents")
      .update({
        doc_status: "failed",
        error_message: "Failed to re-sync document please try again.",
      })
      .eq("id", documentId)
      .eq("business_id", businessId);
  
     throw new Error("Could not start background job. Please ensure the worker is running.");
    }
}
