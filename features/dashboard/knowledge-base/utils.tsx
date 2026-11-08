import React from "react";
import { FileText, FileCode, File } from "lucide-react";
import type { MimeType } from "./types";

export type DbMimeType = MimeType;

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
  return "txt";
}

/* ── Utility formatting functions ── */

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getFileName(path: string): string {
  return path.split("/").pop() || path;
}

export function getFileIcon(mime: MimeType) {
  switch (mime) {
    case "pdf":
      return <FileText className="size-4 text-destructive" />;
    case "markdown":
      return <FileCode className="size-4 text-primary" />;
    case "docx":
      return <FileText className="size-4 text-primary" />;
    case "txt":
    default:
      return <File className="size-4 text-highlight" />;
  }
}

export function getFormatBadge(mime: MimeType): string {
  switch (mime) {
    case "pdf":
      return "PDF";
    case "markdown":
      return "MD";
    case "docx":
      return "DOCX";
    case "txt":
    default:
      return "TXT";
  }
}
