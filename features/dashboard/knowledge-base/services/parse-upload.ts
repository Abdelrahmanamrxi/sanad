import { fileSchema } from "../schemas/file";
import AppError from "@/http/error";

export async function parseUpload(request: Request): Promise<File> {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    throw new AppError("Invalid or interrupted multipart upload", 400);
  }
  const parsed = await fileSchema.safeParseAsync(formData.get("file"));
  if (!parsed.success) {
    throw new AppError(
      parsed.error.issues[0]?.message || "Invalid file uploaded",
      400,
    );
  }
  return parsed.data;
}
