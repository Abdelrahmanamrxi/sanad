import * as cheerio from "cheerio";

export type ParsedTableResult = {
  headers: string[];
  rows: string[];
};

/**
 * Extracts and cleans text from a cell:
 * - Replaces <br> and block boundaries with spaces to prevent word collision.
 * - Decodes HTML entities and normalizes whitespace.
 */
function cleanCellText(cell: ReturnType<cheerio.CheerioAPI>): string {
  // Replace <br> tags with spaces
  cell.find("br").replaceWith(" ");

  // Add space after block elements to prevent words mashing together
  cell.find("p, div, li").each((_, el) => {
    cell.find(el).append(" ");
  });

  return cell
    .text()
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parses an HTML table string into structured, self-contained key-value rows.
 * Example row: "Code: SRV-03 | Service: Ultrasonic Scaling | Price: 900 EGP"
 */
export function parseHtmlTable(tableHtml: string): ParsedTableResult | null {
  try {
    const $ = cheerio.load(tableHtml);
    const $table = $("table").first();
    if ($table.length === 0) return null;

    const $rows = $table.find("tr");
    if ($rows.length === 0) return null;

    // 1. Build a 2D grid of cell texts, accurately resolving rowspan and colspan
    const grid: string[][] = [];

    $rows.each((rIdx, tr) => {
      if (!grid[rIdx]) grid[rIdx] = [];
      let cIdx = 0;

      $(tr)
        .children("td, th")
        .each((_, cell) => {
          // Advance past any cells already filled by a previous row's rowspan
          while (grid[rIdx][cIdx] !== undefined) {
            cIdx++;
          }

          const $cell = $(cell);
          const text = cleanCellText($cell);
          const rSpan = Math.max(1, parseInt($cell.attr("rowspan") || "1", 10) || 1);
          const cSpan = Math.max(1, parseInt($cell.attr("colspan") || "1", 10) || 1);

          for (let r = 0; r < rSpan; r++) {
            const targetR = rIdx + r;
            if (!grid[targetR]) grid[targetR] = [];
            for (let c = 0; c < cSpan; c++) {
              grid[targetR][cIdx + c] = text;
            }
          }

          cIdx += cSpan;
        });
    });

    if (grid.length === 0) return null;

    // 2. Identify headers vs data rows
    // Only treat row 0 as headers if it is inside <thead> OR contains <th> elements.
    const $firstRow = $rows.first();
    const hasThead = $table.find("thead").length > 0;
    const hasTh = $firstRow.find("th").length > 0;

    let headers: string[] = [];
    let dataRowStartIndex = 0;

    if (hasThead || hasTh) {
      headers = grid[0].map((h, i) => (h && h.trim().length > 0 ? h.trim() : `Column ${i + 1}`));
      dataRowStartIndex = 1;
    } else {
      // Table without explicit headers: DO NOT steal row 0! Use neutral column labels.
      const maxCols = Math.max(...grid.map((r) => r.length));
      headers = Array.from({ length: maxCols }, (_, i) => `Column ${i + 1}`);
      dataRowStartIndex = 0;
    }

    // 3. Format data rows as self-contained "Header: Value" pairs
    const convertedRows: string[] = [];

    for (let r = dataRowStartIndex; r < grid.length; r++) {
      const row = grid[r];
      if (!row || row.length === 0) continue;

      // Skip completely blank rows
      if (row.every((val) => !val || !val.trim())) continue;

      const pairs: string[] = [];
      for (let c = 0; c < Math.max(headers.length, row.length); c++) {
        const header = headers[c] || `Column ${c + 1}`;
        const val = row[c]?.trim();
        // Only include cells that have non-empty values to keep embeddings clean
        if (val) {
          pairs.push(`${header}: ${val}`);
        }
      }

      if (pairs.length > 0) {
        convertedRows.push(pairs.join(" | "));
      }
    }

    return {
      headers,
      rows: convertedRows,
    };
  } catch (err) {
    console.error("Failed to parse HTML table:", err);
    return null;
  }
}

/**
 * Table-aware chunking:
 * - Never splits a single row across chunks.
 * - Groups complete rows into chunks up to maxChunkSize.
 * - If a single row exceeds maxChunkSize, keeps it intact as a single chunk.
 * - Applies overlap only at safe row boundaries.
 */
export function chunkTableRows(
  rows: string[],
  maxChunkSize: number = 1000,
  rowOverlap: number = 1
): string[] {
  if (!rows || rows.length === 0) return [];

  // Validate parameters with safe bounds
  const maxSize = Math.max(20, Number(maxChunkSize) || 1000);
  const overlap = Math.max(0, Math.min(Number(rowOverlap) || 0, 5));

  const chunks: string[] = [];
  let currentRows: string[] = [];
  let currentLen = 0;

  for (const row of rows) {
    const rowLen = row.length + 1; // +1 for newline separator

    // Single row exceeds maxChunkSize: flush current and preserve row as its own chunk
    if (row.length >= maxSize) {
      if (currentRows.length > 0) {
        chunks.push(currentRows.join("\n"));
        currentRows = [];
        currentLen = 0;
      }
      chunks.push(row);
      continue;
    }

    // Adding this row exceeds maxSize: flush current chunk and apply row overlap
    if (currentLen + rowLen > maxSize && currentRows.length > 0) {
      chunks.push(currentRows.join("\n"));

      if (overlap > 0 && currentRows.length > overlap) {
        const overlapSlice = currentRows.slice(-overlap);
        const overlapLen = overlapSlice.reduce((sum, r) => sum + r.length + 1, 0);

        if (overlapLen + rowLen <= maxSize) {
          currentRows = [...overlapSlice, row];
          currentLen = overlapLen + rowLen;
        } else {
          currentRows = [row];
          currentLen = rowLen;
        }
      } else {
        currentRows = [row];
        currentLen = rowLen;
      }
    } else {
      currentRows.push(row);
      currentLen += rowLen;
    }
  }

  if (currentRows.length > 0) {
    chunks.push(currentRows.join("\n"));
  }

  return chunks;
}
