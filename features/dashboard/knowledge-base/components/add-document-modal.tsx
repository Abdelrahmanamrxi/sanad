"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, UploadCloud, RefreshCw } from "lucide-react";
import type { MimeType } from "../types";
import { fileSchema } from "../schemas/file";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument: (data: {
    fileName: string;
    mimeType: MimeType;
    rawText: string;
  }) => void;
}

export function AddDocumentModal({
  isOpen,
  onClose,
  onAddDocument,
}: AddDocumentModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>("");
  const [file, setFile] = useState<File | null>();
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 10 * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "text/markdown": [".md", ".markdown"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    onDrop(acceptedFiles) {
      setError("");
      setIsUploading(false)
      const file = acceptedFiles[0];
      if (!file) setError("Please upload a file to get parsed.");

      const result = fileSchema.safeParse(file);
      if (!result.success) {
        setError(result.error?.issues[0]?.message);
        return;
      }
      setFile(result.data)
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg border border-border bg-card p-6 shadow-2xl flex flex-col gap-4 rounded-none">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Add Document to Knowledge Base
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Upload file or enter raw text to parse and index into pgvector
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground rounded-none"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form  className="flex flex-col gap-4">
          {/* Drag & Drop Area */}
          <div
            {...getRootProps({ className: "dropzone" })}
            className="border cursor-pointer border-dashed border-border p-4 text-center text-xs text-muted-foreground bg-muted/10 rounded-none"
          >
            <UploadCloud className="size-6 mx-auto mb-1 text-primary" />
            <span>Drag & drop source file or click to select</span>
            <input {...getInputProps()} />
            <span className="block font-mono text-[10px] text-muted-foreground/60 mt-0.5">
              Supported formats: PDF, DOCX, TXT, CSV, Markdown (Max 25MB)
            </span>
          </div>
          {acceptedFiles.length > 0 &&
            acceptedFiles.map((file) => {
              return (
                <div
                  className="flex flex-row font-sans justify-between"
                  key={file.path}
                >
                  <p>{file.path}</p>
                  <p className="font-bold">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              );
            })}
          {error && <p className="text-red-500">{error}</p>}
          {/* Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="border border-primary bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-none"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>Parsing & Chunking...</span>
                </>
              ) : (
                <span>Index Document</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
