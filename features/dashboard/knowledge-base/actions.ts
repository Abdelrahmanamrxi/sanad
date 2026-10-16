"use server";
import { type ChunkItem, DocumentItem } from "./types";
import { getAuthContext } from "@/lib/auth";
import { MimeType } from "./types";
import { FetchDocumentsParams } from "./types";

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

export async function deleteDocument(id: string) {
  const { supabase, businessId } = await getAuthContext();
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("business_id", businessId)
    .eq("id", id);

  if(error){
    throw new Error("Failed to delete documents")
  }
  return true
}

