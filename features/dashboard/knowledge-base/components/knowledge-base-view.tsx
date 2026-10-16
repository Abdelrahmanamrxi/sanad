"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  DocumentLibrary,
  DocumentInspector,
  AddDocumentModal,
  DeleteSingleModal,
} from "./";
import {
  initialDocuments as defaultInitialDocuments,
  mockChunksByDocId as defaultMockChunks,
} from "../mock-data";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDocumentDetails, fetchDocuments, deleteDocument } from "../actions";
import useDebounce from "@/hooks/use-debounce";
import type { DocumentItem, ChunkItem, MimeType } from "../types";
import DocumentLibrarySectionError from "./errors/document-library-error";
import DocumentInspectorSectionError from "./errors/document-inspector-error";
interface KnowledgeBaseViewProps {
  initialDocuments?: DocumentItem[];
  initialChunks?: Record<string, ChunkItem[]>;
}

export function KnowledgeBaseView({
  initialDocuments = defaultInitialDocuments,
  initialChunks = defaultMockChunks,
}: KnowledgeBaseViewProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [chunksByDoc, setChunksByDoc] = useState<Record<string, ChunkItem[]>>(initialChunks);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);


  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | MimeType>("all");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<DocumentItem | null>(
    null,
  );

  const debouncedQuery = useDebounce(searchQuery, 500);

  const { data, isPending: isDocumentLibraryPending } = useQuery({
    queryKey: ["documents", { typeFilter, debouncedQuery }],
    queryFn: () =>
      fetchDocuments({ mimeType: typeFilter, name: debouncedQuery }),
    refetchInterval: (query) => {
      const docs = query.state.data;
      const isProcessing = docs?.some(
        (d) => d.doc_status === "processing" || d.doc_status === "queued"
      );
      return isProcessing ? 2000 : false;
    },
  });
  // Selected document & chunks
  const docsList = data ?? documents;
  const selectedDoc =
    docsList.find((d) => d.id === selectedDocId) ?? docsList[0] ?? null;

  const activeDocId = selectedDoc?.id;

  const { data: currentChunks, isPending: isDocumentDetailsPending } = useQuery({
    queryKey: ["chunks", activeDocId],
    queryFn: () => fetchDocumentDetails(activeDocId!),
    enabled: !!activeDocId,
    refetchInterval: () => {
      return selectedDoc?.doc_status === "processing" ||
        selectedDoc?.doc_status === "queued"
        ? 2000
        : false;
    },
  });



  const queryClient = useQueryClient();

  /* ── Delete Mutation ── */
  const { mutate: executeDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["documents"], exact: false });
      queryClient.removeQueries({ queryKey: ["chunks", deletedId] });
      if (selectedDocId === deletedId) {
        setSelectedDocId(null);
      }
      setDeleteConfirmDoc(null);
    },
    onError: (err) => {
      console.error("Delete failed:", err);
      alert(err instanceof Error ? err.message : "Failed to delete document");
    },
  });

  /* ── Delete Handlers ── */
  const handleDeleteSingle = (doc: DocumentItem) => {
    setDeleteConfirmDoc(doc);
  };

  const confirmDeleteSingle = () => {
    if (!deleteConfirmDoc) return;
    executeDelete(deleteConfirmDoc.id);
  };

  /* ── Add Document Ingest Handler ── */
  const handleAddDocument = ({
    fileName,
    mimeType,
    rawText,
  }: {
    fileName: string;
    mimeType: MimeType;
    rawText: string;
  }) => {
    const newDocId = `doc-${Date.now()}`;
    const newDoc: DocumentItem = {
      id: newDocId,
      business_id: "biz-1",
      storage_path: fileName.includes("/") ? fileName : `uploads/${fileName}`,
      markdown_path: `parsed/${fileName.replace(/\.[^/.]+$/, "")}.md`,
      mime_type: mimeType,
      doc_status: "indexed",
      stats: {
        total_chunks: 3,
        total_tokens: 680,
        file_size: 345000,
      },
      created_at: "Just now",
      file_size: 3000,
    };

    setChunksByDoc((prev) => ({
      ...prev,
      [newDocId]: [
        {
          id: `chk-${newDocId}-0`,
          document_id: newDocId,
          chunk_index: 0,
          heading_path: "Introduction & Scope",
          page_number: 1,
          token_count: 220,
          embedding_model: "text-embedding-3-small",
          content:
            rawText ||
            "مستند جديد تمت معالجته واستخراج متجهات البحث بنجاح وجاهز للاسترجاع بواسطة المساعد الذكي.",
          created_at: new Date().toISOString(),
        },
      ],
    }));

    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocId(newDocId);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground font-sans">
            Knowledge Base
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Manage vector embeddings, inspect chunk partitions, and purge
            obsolete documentation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 border border-primary bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 rounded-none font-mono"
          >
            <Plus className="size-3.5" />
            <span>Add Document</span>
          </button>
        </div>
      </div>

      {/* ── Master-Detail Two-Pane Workspace ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <DocumentLibrarySectionError>
          {/* Left Pane: Document Library */}
          <DocumentLibrary
            documents={data ? data : []}
            isPending={isDocumentLibraryPending}
            searchQuery={searchQuery}
            typeFilter={typeFilter}
            onSearchChange={setSearchQuery}
            onTypeFilterChange={setTypeFilter}
            onDeleteSingle={handleDeleteSingle}
            selectedDocId={activeDocId}
            onSelectDoc={setSelectedDocId}
          />
        </DocumentLibrarySectionError>

        {/* Right Pane: Deep Inspector */}
        <DocumentInspectorSectionError>
          <DocumentInspector
            selectedDoc={selectedDoc}
            chunks={currentChunks ? currentChunks : []}
            onDeleteSingle={handleDeleteSingle}
            isPending={isDocumentLibraryPending || isDocumentDetailsPending}
          />
        </DocumentInspectorSectionError>
      </div>

      {/* ── Modals ── */}
      <AddDocumentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDocument={handleAddDocument}
      />

      <DeleteSingleModal
        document={deleteConfirmDoc}
        onClose={() => setDeleteConfirmDoc(null)}
        onConfirm={confirmDeleteSingle}
        isDeleting={isDeleting}
      />
    </div>
  );
}
