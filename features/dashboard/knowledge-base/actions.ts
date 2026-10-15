"use server";
import { DocumentItem } from "./types";
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
