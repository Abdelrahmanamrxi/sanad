-- 1. Add current_index_version to documents
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS current_index_version uuid;

-- 2. Add index_version to chunks
ALTER TABLE chunks 
ADD COLUMN IF NOT EXISTS index_version uuid;

-- 3. Replace the old unique constraint on chunks
ALTER TABLE chunks 
DROP CONSTRAINT IF EXISTS chunks_document_id_chunk_index_key;

ALTER TABLE chunks 
ADD CONSTRAINT chunks_doc_version_chunk_index_key 
UNIQUE (document_id, index_version, chunk_index);

-- 4. Index for fast versioned retrieval and cleanup
CREATE INDEX IF NOT EXISTS chunks_doc_version_idx 
ON chunks (document_id, index_version);
