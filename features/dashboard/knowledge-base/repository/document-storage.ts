// features/dashboard/knowledge-base/services/documents.ts
import type { SupabaseClient } from "@supabase/supabase-js";


const BUCKET = process.env.SUPABASE_BUCKET_STORAGE || "sanad-file-storage";

export const buildStoragePath = (businessId: string, documentId: string, fileName: string) => {
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${businessId}/${documentId}/${sanitized}`;
};

// returns the new row's id, or null on failure


// true on success, false on failure
export async function uploadToStorage(
  supabase: SupabaseClient,
  path: string,
  file: File,
) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) console.error("uploadToStorage", error);
  return !error;
}



// cleanup helpers: log only, never throw (don't mask the original error)
export async function removeFromStorage(supabase: SupabaseClient, path: string) {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.error("removeFromStorage", error);
}


export async function markFailed(
  supabase: SupabaseClient,
  businessId: string,
  id: string,
  message: string,
) {
  const { error } = await supabase
    .from("documents")
    .update({ doc_status: "failed", error_message: message })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) console.error("markFailed", error);
}

// this one DOES throw, the orchestrator catches it
