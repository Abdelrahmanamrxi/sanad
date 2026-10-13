import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";
import { NonRetriableError } from "inngest";


export async function extractFileText(blob: Blob, path: string): Promise<string> {
  const ext = path.split(".").pop()?.toLowerCase()
  let text = "";

  switch (ext) {
    case "pdf": {
      const pdf = await getDocumentProxy(new Uint8Array(await blob.arrayBuffer()));
      ({ text } = await extractText(pdf, { mergePages: true }));
      break;
    }
    case "docx": {
      const buffer = Buffer.from(await blob.arrayBuffer());
      ({ value: text } = await mammoth.extractRawText({ buffer }));
      break;
    }
    case "txt":
    case "md":
      text = await blob.text();
      break;
    default:
      throw new NonRetriableError(`Unsupported file type: ${ext}`);
  }

  text = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

  if (!text) {
    throw new NonRetriableError("No extractable text (scanned PDF or empty file)");
  }
  return text;
}