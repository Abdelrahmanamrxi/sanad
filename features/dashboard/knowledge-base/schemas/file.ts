
import { z } from "zod";

// Function to check the magic number of a file matches the designated magic number
async function startsWith(file: File, bytes: number[]) {
  // 1. read only the first N bytes of the file (N = length of the signature)
  const head = new Uint8Array(await file.slice(0, bytes.length).arrayBuffer());

  // 2. check every expected byte matches the same position in the file
  return bytes.every((b, i) => head[i] === b);
}
export const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10 MB
export const fileSchema = z
  .file({error:"File must be provided"})
  .min(1,"File must atleast contain some content")
  .max(FILE_SIZE_LIMIT)
  .mime([
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],"File must be either PDF, TXT, DOCX")
   .refine(
    async (file) => {
      switch (file.type) {
        case "application/pdf":
          return startsWith(file, [0x25, 0x50, 0x44, 0x46]); // %PDF
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          return startsWith(file, [0x50, 0x4b, 0x03, 0x04]); // PK\x03\x04
        case "text/plain": {
          const head = new Uint8Array(await file.slice(0, 1024).arrayBuffer());
          return !head.includes(0); // no null bytes = probably text
        }
        default:
          return false; // unknown type should never pass
      }
    },
    { message: "File content doesn't match its type (corrupted or spoofed)" }
  );
