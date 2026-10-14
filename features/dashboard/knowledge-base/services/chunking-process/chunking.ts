import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { mergeSections, parseMarkdownSections } from "./structure-text";
import { chunkTableRows } from "./table-parser";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 150,
});

export type ProcessedChunk = {
  content: string;
  headingPath: string;
  chunkIndex: number;
};

export async function chunkMarkdown(
  markdown: string,
): Promise<ProcessedChunk[]> {
  const parsedBlock = parseMarkdownSections(markdown);
  const mergedBlocks = mergeSections(parsedBlock);

  const finalChunks: ProcessedChunk[] = [];
  let chunkIndex: number = 0;

  for (const block of mergedBlocks) {
    // 1. Table-aware chunking: preserves individual rows, groups up to 1000 chars, row-level overlap
    if (block.type === "table" && block.tableRows && block.tableRows.length > 0) {
      const tableChunks = chunkTableRows(block.tableRows, 1000, 1);
      for (const tChunk of tableChunks) {
        finalChunks.push({
          content: tChunk,
          headingPath: block.sectionPath,
          chunkIndex: chunkIndex++,
        });
      }
      continue;
    }

    // 2. Ordinary prose chunking using existing recursive splitter
    const textContent = block.text || "";
    if (!textContent.trim()) continue;

    if (textContent.length <= 1000) {
      finalChunks.push({
        content: textContent,
        headingPath: block.sectionPath,
        chunkIndex: chunkIndex++,
      });
      continue;
    }

    // If prose is too large, split recursively
    const subSplits = await textSplitter.splitText(textContent);
    for (const sub of subSplits) {
      finalChunks.push({
        content: sub,
        headingPath: block.sectionPath,
        chunkIndex: chunkIndex++,
      });
    }
  }

  return finalChunks;
}
