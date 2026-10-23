import type { SupabaseClient } from "@supabase/supabase-js";
import AppError from "@/http/error";
import {
  buildStoragePath,
  uploadToStorage,
} from "../repository/document-storage";
import { insertDocument, deleteDocument } from "../repository/document-db";
export async function uploadDocument(
  supabase: SupabaseClient,
  businessId: string,
  file: File,
): Promise<{ id: string }> {
  const id = crypto.randomUUID();
  const path = buildStoragePath(businessId, id, file.name);

  if (!(await insertDocument(supabase, businessId, file, id, path))) {
    throw new AppError("Failed to save document", 500);
  }

  if (!(await uploadToStorage(supabase, path, file))) {
    await deleteDocument(supabase, businessId, id);
    throw new AppError("File couldn't be saved", 500);
  }
  return { id };
}
