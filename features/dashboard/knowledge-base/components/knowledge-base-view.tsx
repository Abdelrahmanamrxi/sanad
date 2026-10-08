"use client"

import React, { useState } from "react"
import { Plus } from "lucide-react"
import {
  DocumentLibrary,
  DocumentInspector,
  AddDocumentModal,
  DeleteSingleModal,
  BulkDeleteModal,
} from "./"
import {
  initialDocuments as defaultInitialDocuments,
  mockChunksByDocId as defaultMockChunks,
} from "../mock-data"
import type { DocumentItem, ChunkItem, MimeType } from "../types"

interface KnowledgeBaseViewProps {
  initialDocuments?: DocumentItem[]
  initialChunks?: Record<string, ChunkItem[]>
}

export function KnowledgeBaseView({
  initialDocuments = defaultInitialDocuments,
  initialChunks = defaultMockChunks,
}: KnowledgeBaseViewProps) {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments)
  const [chunksByDoc, setChunksByDoc] = useState<Record<string, ChunkItem[]>>(initialChunks)
  const [selectedDocId, setSelectedDocId] = useState<string>(
    initialDocuments[0]?.id || "doc-1"
  )
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set())

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | MimeType>("all")

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [deleteConfirmDoc, setDeleteConfirmDoc] = useState<DocumentItem | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

  // Selected document & chunks
  const selectedDoc =
    documents.find((d) => d.id === selectedDocId) || documents[0] || null
  const currentChunks = selectedDoc ? chunksByDoc[selectedDoc.id] || [] : []

  /* ── Selection handlers ── */
  const handleToggleSelectDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(selectedDocIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedDocIds(next)
  }

  const handleToggleSelectAll = () => {
    const filteredDocs = documents.filter((doc) => {
      const matchesSearch = doc.storage_path
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesType = typeFilter === "all" || doc.mime_type === typeFilter
      return matchesSearch && matchesType
    })

    if (selectedDocIds.size === filteredDocs.length) {
      setSelectedDocIds(new Set())
    } else {
      setSelectedDocIds(new Set(filteredDocs.map((d) => d.id)))
    }
  }

  /* ── Delete Handlers ── */
  const handleDeleteSingle = (doc: DocumentItem) => {
    setDeleteConfirmDoc(doc)
  }

  const confirmDeleteSingle = () => {
    if (!deleteConfirmDoc) return
    const idToDelete = deleteConfirmDoc.id
    setDocuments((prev) => prev.filter((d) => d.id !== idToDelete))
    setSelectedDocIds((prev) => {
      const next = new Set(prev)
      next.delete(idToDelete)
      return next
    })

    if (selectedDocId === idToDelete) {
      const remaining = documents.filter((d) => d.id !== idToDelete)
      if (remaining.length > 0) {
        setSelectedDocId(remaining[0].id)
      }
    }
    setDeleteConfirmDoc(null)
  }

  const confirmBulkDelete = () => {
    setDocuments((prev) => prev.filter((d) => !selectedDocIds.has(d.id)))
    if (selectedDocIds.has(selectedDocId)) {
      const remaining = documents.filter((d) => !selectedDocIds.has(d.id))
      if (remaining.length > 0) {
        setSelectedDocId(remaining[0].id)
      }
    }
    setSelectedDocIds(new Set())
    setIsBulkDeleteOpen(false)
  }

  /* ── Add Document Ingest Handler ── */
  const handleAddDocument = ({
    fileName,
    mimeType,
    rawText,
  }: {
    fileName: string
    mimeType: MimeType
    rawText: string
  }) => {
    const newDocId = `doc-${Date.now()}`
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
    }

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
    }))

    setDocuments((prev) => [newDoc, ...prev])
    setSelectedDocId(newDocId)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground font-sans">
            Knowledge Base
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Manage vector embeddings, inspect chunk partitions, and purge obsolete documentation
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
        {/* Left Pane: Document Library */}
        <DocumentLibrary
          documents={documents}
          selectedDocId={selectedDocId}
          selectedDocIds={selectedDocIds}
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          onSearchChange={setSearchQuery}
          onTypeFilterChange={setTypeFilter}
          onSelectDoc={setSelectedDocId}
          onToggleSelectDoc={handleToggleSelectDoc}
          onToggleSelectAll={handleToggleSelectAll}
          onDeleteSingle={handleDeleteSingle}
          onOpenBulkDelete={() => setIsBulkDeleteOpen(true)}
        />

        {/* Right Pane: Deep Inspector */}
        <DocumentInspector
          selectedDoc={selectedDoc}
          chunks={currentChunks}
          onDeleteSingle={handleDeleteSingle}
        />
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
      />

      <BulkDeleteModal
        isOpen={isBulkDeleteOpen}
        count={selectedDocIds.size}
        onClose={() => setIsBulkDeleteOpen(false)}
        onConfirm={confirmBulkDelete}
      />
    </div>
  )
}
