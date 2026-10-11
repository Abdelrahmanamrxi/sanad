"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, UploadCloud, RefreshCw } from "lucide-react";
import type { MimeType } from "../types";
import { useUploadFile } from "../hooks/use-upload-file";
import { fileSchema } from "../schemas/file";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDocument?: (data: {
    fileName: string;
    mimeType: MimeType;
    rawText: string;
  }) => void;
  onAddFile?: (data: {
    fileName: string;
    mimeType: MimeType;
    rawText: string;
  }) => void;
}

export function AddDocumentModal({
  isOpen,
  onClose,
}: AddDocumentModalProps) {
  const [error, setError] = useState<string | null>("");
  const [file, setFile] = useState<File>();
  const uploadFileMutation = useUploadFile();

  const handleClose = () => {
    setFile(undefined);
    setError("");
    onClose();
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 10 * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
    },
    async onDropAccepted(files) {
      setError("");
      const result = await fileSchema.safeParseAsync(files[0]);
      if (!result.success) {
        setError(result.error.issues[0]?.message ?? "Invalid file");
        setFile(undefined);
        return;
      }
      setFile(result.data);
    },
    onDropRejected(rejections) {
      setError(rejections[0]?.errors[0]?.message ?? "File rejected");
      setFile(undefined);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a valid file to upload.");
      return;
    }

    uploadFileMutation.mutate(file, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

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
              Upload file to parse and index into pgvector
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground rounded-none"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Drag & Drop Area */}
          <div
            {...getRootProps({ className: "dropzone" })}
            className="border cursor-pointer border-dashed border-border p-4 text-center text-xs text-muted-foreground bg-muted/10 rounded-none"
          >
            <UploadCloud className="size-6 mx-auto mb-1 text-primary" />
            <span>Drag & drop source file or click to select</span>
            <input {...getInputProps()} />
            <span className="block font-mono text-[10px] text-muted-foreground/60 mt-0.5">
              Supported formats: PDF, DOCX, TXT (Max 10MB)
            </span>
          </div>

          {/* Validated File Preview */}
          {file && (
            <div className="flex flex-row font-sans justify-between text-xs p-2.5 border border-border bg-background">
              <span className="font-medium text-foreground truncate max-w-[320px]">
                {file.name}
              </span>
              <span className="font-mono text-muted-foreground shrink-0">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
          )}

          {/* Error Messages */}
          {error && <p className="text-xs text-destructive">{error}</p>}
          {uploadFileMutation.isError && (
            <p className="text-xs text-destructive">
              {uploadFileMutation.error.message}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={uploadFileMutation.isPending}
              className="border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || uploadFileMutation.isPending}
              className="border border-primary bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 rounded-none disabled:opacity-50"
            >
              {uploadFileMutation.isPending ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  <span>Uploading & Indexing...</span>
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
