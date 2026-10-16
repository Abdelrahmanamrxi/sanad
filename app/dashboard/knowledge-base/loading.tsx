import DocumentLibrarySkeleton from "@/features/dashboard/knowledge-base/components/loading/document-library-skeleton";
import DocumentInspectorSkeleton from "@/features/dashboard/knowledge-base/components/loading/document-inspector-skeleton";
export default function KnowledgeBaseLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* ── Top Header Bar Skeleton ── */}
      <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between animate-pulse">
        <div className="space-y-1.5">
          <div className="h-6 w-44 bg-muted rounded-none" />
          <div className="h-3.5 w-80 max-w-full bg-muted/60 rounded-none" />
        </div>
        <div className="h-8 w-32 bg-muted rounded-none" />
      </div>

      {/* ── Master-Detail Workspace Skeleton ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <DocumentLibrarySkeleton/>
        <DocumentInspectorSkeleton />
      </div>
    </div>
  );
}
