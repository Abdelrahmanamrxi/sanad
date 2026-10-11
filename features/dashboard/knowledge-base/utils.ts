export type DbMimeType = "pdf" | "text" | "docx" | "markdown";

export function toDbMimeType(file: File): DbMimeType {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    return "pdf";
  }
  if (type === "text/markdown" || name.endsWith(".md")) {
    return "markdown";
  }
  if (
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    name.endsWith(".docx")
  ) {
    return "docx";
  }
  return "text";
}
