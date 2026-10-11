import type { SupabaseClient } from "@supabase/supabase-js";
import { toDbMimeType } from "../utils";

export async function deleteDocument(
  supabase: SupabaseClient,
  businessId: string,
  id: string,
) {
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) console.error("deleteDocument", error);
}


export async function insertDocument(
  supabase: SupabaseClient,
  businessId: string,
  file: File,
  id:string,
  path:string
) {
  const { data, error } = await supabase
    .from("documents")
    .insert({
      id,
      business_id: businessId,
      name: file.name,
      mime_type: toDbMimeType(file),
      doc_status: "queued",
      storage_path:path
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("insertDocument", error);
    return null;
  }
  return data.id as string;
}
