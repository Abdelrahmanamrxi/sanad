-- 1. Drop the old index
DROP INDEX IF EXISTS chunks_embedding_idx;

-- 2. Alter to 1024 dimensions
ALTER TABLE chunks ALTER COLUMN embedding TYPE vector(1024);

-- 3. Re-create the HNSW index for vector(1024)
CREATE INDEX chunks_embedding_idx ON chunks USING hnsw (embedding vector_cosine_ops);
