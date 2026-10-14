import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";
import { NonRetriableError } from "inngest";
import LlamaCloud from "@llamaindex/llama-cloud";

const client = new LlamaCloud({
  apiKey: process.env.LLAMA_INDEX_API_KEY!,
});

export async function extractFileText(
  blob: Blob,
  path: string,
): Promise<string> {
  const ext = path.split(".").pop()?.toLowerCase();
  let text = "";

  switch (ext) {
    case "pdf": {
      try {
        const fileName = path.split("/").pop() || "document.pdf";
        const file = new File([await blob.arrayBuffer()], fileName, {
          type: "application/pdf",
        });
        const uploaded = await client.files.create({ file, purpose: "parse" });

        const result = await client.parsing.parse({
          file_id: uploaded.id,
          tier: "cost_effective", // try "agentic" if Arabic/tables come out bad
          version: "latest",
          expand: ["markdown"],
        });

        text =
          result.markdown_full ||
          result.markdown?.pages
            .map((p) => ("markdown" in p ? p.markdown : ""))
            .join("\n\n") ||
          result.text_full ||
          "";

        // Cleanup temporary uploaded file on LlamaCloud
        try {
          await client.files.delete(uploaded.id);
        } catch {
          // ignore cleanup errors
        }
      } catch (err) {
        console.warn("LlamaCloud parsing failed, falling back to unpdf:", err);
        const pdf = await getDocumentProxy(new Uint8Array(await blob.arrayBuffer()));
        ({ text } = await extractText(pdf, { mergePages: true }));
      }
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

  text = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!text) {
    throw new NonRetriableError(
      "No extractable text (scanned PDF or empty file)",
    );
  }
  return text;
}
