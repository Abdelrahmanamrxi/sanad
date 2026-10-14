

export type SectionBlock = {
  sectionPath: string;
  text: string;
};

export type DetectedHeading = {
  level: number;
  title: string;
};

/**
 * Detects headings from Markdown syntax (# Heading) or heuristics for raw PDF/plain text:
 * - Numbered sections ("1. Introduction", "Chapter 1", "Part I")
 * - Arabic and English structural markers (الفصل, الباب, Section, Appendix)
 * - ALL CAPS titles ("CONTENTS", "OVERVIEW", "TERMS AND CONDITIONS")
 */
export function detectHeading(line: string): DetectedHeading | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.length > 90) return null;

  // 1. Explicit Markdown heading: # Title
  const mdMatch = trimmed.match(/^(#{1,6})\s+(.+?)\s*#*$/);
  if (mdMatch) {
    return {
      level: mdMatch[1].length,
      title: mdMatch[2].trim(),
    };
  }

  // Filter out noise: emails, URLs, dates, copyright/ISBN, or lines ending in comma/semicolon
  if (
    trimmed.includes("@") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    /^(isbn|copyright|all rights reserved|page \d+)/i.test(trimmed) ||
    /[,;]$/.test(trimmed) ||
    /\.(indd|pdf|docx|txt)/i.test(trimmed)
  ) {
    return null;
  }

  // 2. Part / Chapter / Section / Article / Appendix (English & Arabic)
  const structuralMatch = trimmed.match(
    /^(Part|Chapter|Section|Article|Appendix|Book|Unit|الباب|الفصل|القسم|المادة|الملحق|الوحدة)\s+(الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر|[0-9IVXLCDM\u0660-\u0669]+|[A-Za-z]|[أ-ي])(\s+.*|[:\-\u2013\u2014.]\s*.*)?$/i
  );
  if (structuralMatch) {
    const isMajor = /^(Part|Book|الباب|الوحدة)/i.test(structuralMatch[1]);
    return {
      level: isMajor ? 1 : 2,
      title: trimmed.replace(/[:\s\ufffd]+$/, "").replace(/\s*[.]+$/, ""),
    };
  }

  // 3. Numbered headings (e.g. "1 What’s a Network Effect", "1.1 Architecture", "2. A Brief History")
  const numberedMatch = trimmed.match(
    /^(\d+(?:\.\d+)*)\s*[:\-\.]?\s+([A-Z\u0600-\u06FF].{2,80})$/
  );
  if (numberedMatch) {
    // Avoid treating lines of multiple spaced numbers as headings (e.g., "1 2 3 4 5")
    if (!trimmed.match(/\d+\s+\d+\s+\d+/)) {
      const dots = (numberedMatch[1].match(/\./g) || []).length;
      return {
        level: Math.min(dots + 2, 6),
        title: trimmed.replace(/[:\s\ufffd]+$/, "").replace(/\s*[.]+$/, ""),
      };
    }
  }

  // 4. Standalone Common Section Names (English & Arabic)
  const standardSections =
    /^(contents|table of contents|introduction|overview|background|summary|executive summary|conclusion|references|appendix|faqs?|terms and conditions|privacy policy|المقدمة|الفهرس|المحتويات|نظرة عامة|الخلاصة|المراجع|الأسئلة الشائعة|الشروط والأحكام|سياسة الخصوصية)$/i;
  if (standardSections.test(trimmed)) {
    return {
      level: 1,
      title:
        trimmed.toUpperCase() === trimmed
          ? trimmed
          : trimmed.charAt(0).toUpperCase() + trimmed.slice(1),
    };
  }

  // 5. Short Latin ALL CAPS line (between 4 and 60 chars, has uppercase Latin letters, no lowercase)
  if (
    trimmed.length >= 4 &&
    trimmed.length <= 60 &&
    /[A-Z]/.test(trimmed) &&
    !/[a-z]/.test(trimmed) &&
    !/[.?!]$/.test(trimmed) &&
    !/\d{4}/.test(trimmed)
  ) {
    return {
      level: 2,
      title: trimmed,
    };
  }

  return null;
}

export function parseMarkdownSections(markdown: string): SectionBlock[] {
  const headings: string[] = []; // Remembers the current heading hierarchy ["Part I", "Chapter 1"]
  const blocks: SectionBlock[] = []; // Stores the finished section blocks
  let paragraph: string[] = []; // Collects paragraphs until reaching a heading or blank line

  function flushParagraph() {
    const text = paragraph.join("\n").trim();
    paragraph = [];
    if (!text) return;

    const path = headings.filter(Boolean).join(" > ");
    blocks.push({
      sectionPath: path || "Overview",
      text,
    });
  }

  for (const line of markdown.split(/\r?\n/)) {
    const heading = detectHeading(line);
    if (heading) {
      flushParagraph();

      const { level, title } = heading;
      // Truncate to current level and assign title
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
      previous.text += "\n\n" + block.text;
    } else {
      merged.push({ ...block });
    }
  }
  return merged;
}
