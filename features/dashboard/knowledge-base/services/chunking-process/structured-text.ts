

export type SectionBlock = {
  sectionPath: string;
  text: string;
};
export function parseMarkdownSections(markdown: string): SectionBlock[] {
  const headings: string[] = []; // Remembers the current heading hierarchy ["Clinic","Cosmetic"]
  const blocks: SectionBlock[] = []; // Stores the finished section blocks that will return
  let paragraph: string[] = []; // Collects the paragraphs until it reaches a heading or a new line

  // Helper function is used when it reaches a new heading or a new line to store a new block
  function flushParagraph() {
    const text = paragraph.join("\n").trim();
    paragraph = [];
    if (!text) return;

    blocks.push({
      sectionPath: headings.filter(Boolean).join(">"),
      text,
    });
  }
  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/); // if line matches a heading
    if (match) {
      flushParagraph();

      const level = match[1].length; // EX : ### OR ## OR #
      const title = match[2].trim();

      // Replace this heading level and discard deeper headings.
      headings.length = level;
      headings[level - 1] = title;

      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();

  return blocks;
}

export function mergeSections(blocks: SectionBlock[]): SectionBlock[] {
  const merged: SectionBlock[] = [];
  for (const block of blocks) {
    const previous = merged[merged.length - 1];
    if (previous?.sectionPath === block.sectionPath) {
      previous.text += "\n\n" + block.text; // IF DIFFERENT SEQUENTIAL BLOCKS HAVE THE SAME HEADINGS MERGE THEIR TEXT AS THEY ARE RELEVANT
    } else {
      merged.push({ ...block });
    }
  }
  return merged;
}
