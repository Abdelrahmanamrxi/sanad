

import { parseHtmlTable } from "./table-parser";

export type SectionBlock = {
  sectionPath: string;
  type: "prose" | "table";
  text?: string;
  tableRows?: string[];
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

function parseSectionContent(rawText: string, sectionPath: string): SectionBlock[] {
  const blocks: SectionBlock[] = [];
  if (!rawText.trim()) return blocks;

  // Split on <table...>...</table> boundaries so prose before/after is never lost
  const parts = rawText.split(/(<table[\s\S]*?<\/table>)/i);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (/<table[\s\S]*?<\/table>/i.test(trimmed)) {
      const parsed = parseHtmlTable(trimmed);
      if (parsed && parsed.rows.length > 0) {
        blocks.push({
          sectionPath,
          type: "table",
          tableRows: parsed.rows,
        });
      } else {
        // Fallback: keep content as prose if table cannot be parsed
        blocks.push({
          sectionPath,
          type: "prose",
          text: trimmed,
        });
      }
    } else {
      blocks.push({
        sectionPath,
        type: "prose",
        text: trimmed,
      });
    }
  }

  return blocks;
}

export function parseMarkdownSections(markdown: string): SectionBlock[] {
  const headings: string[] = []; // Current heading hierarchy
  const blocks: SectionBlock[] = [];
  let currentLines: string[] = [];

  function currentPath(): string {
    return headings.filter(Boolean).join(" > ") || "Overview";
  }

  function flushCurrent() {
    if (currentLines.length === 0) return;
    const text = currentLines.join("\n");
    currentLines = [];
    blocks.push(...parseSectionContent(text, currentPath()));
  }

  function hasUnclosedTable(lines: string[]): boolean {
    const text = lines.join("\n");
    const open = (text.match(/<table\b/gi) || []).length;
    const close = (text.match(/<\/table>/gi) || []).length;
    return open > close;
  }

  for (const line of markdown.split(/\r?\n/)) {
    // Only detect headings when outside an open table
    if (!hasUnclosedTable(currentLines)) {
      const heading = detectHeading(line);
      if (heading) {
        flushCurrent();
        const { level, title } = heading;
        headings.length = level;
        headings[level - 1] = title;
        continue;
      }
    }

    currentLines.push(line);
  }

  flushCurrent();
  return blocks;
}

export function mergeSections(blocks: SectionBlock[]): SectionBlock[] {
  const merged: SectionBlock[] = [];
  for (const block of blocks) {
    const previous = merged[merged.length - 1];
    // Merge consecutive prose blocks that share the same heading
    if (
      previous &&
      previous.type === "prose" &&
      block.type === "prose" &&
      previous.sectionPath === block.sectionPath
    ) {
      previous.text = (previous.text ? previous.text + "\n\n" : "") + (block.text || "");
    } else {
      merged.push({ ...block });
    }
  }
  return merged;
}
