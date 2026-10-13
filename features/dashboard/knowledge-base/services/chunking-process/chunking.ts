import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { mergeSections, parseMarkdownSections } from "./structured-text";

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
    if (block.text.length <= 1000) {
      finalChunks.push({
        content: block.text,
        headingPath: block.sectionPath,
        chunkIndex: chunkIndex++,
      });
      continue;
    }
    // if the text is too large make langchain split the text recursively
    const subSplits = await textSplitter.splitText(block.text);

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
