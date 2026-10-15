-- ==============================================================================
-- Migration: Arabic Text Normalization & Hybrid Retrieval (Vector + Keyword RRF)
-- Migration ID: 20261015121050_ARABIC_NORMALIZATION_AND_SEMANTIC_RETRIEVAL.sql
-- Project: Sanad RAG Pipeline
--
-- Table of Contents:
--   1. Architectural Overview & Design Rationale
--   2. Arabic Orthography & Normalization Strategy
--   3. Reciprocal Rank Fusion (RRF) Mechanics
--   4. Part A: Arabic Text Normalizer Function (arabic_normalize)
--   5. Part B: Full-Text Search (FTS) Generated Column & GIN Index
--   6. Part C: Multi-Tenant Hybrid Match Function (hybrid_match_chunks)
--   7. Part D: Role Permissions & Security Grants
--   8. Verification & Integration Guide (TypeScript & SQL)
-- ==============================================================================

-- ==============================================================================
-- 1. ARCHITECTURAL OVERVIEW & DESIGN RATIONALE
-- ==============================================================================
--
-- Why Hybrid Search?
-- In Retrieval-Augmented Generation (RAG), dense vector search and sparse keyword
-- search have complementary strengths:
--   - Dense Vector Retrieval (BAAI/bge-m3 1024-dim):
--     Excels at semantic conceptual matching, handling paraphrases, synonyms, and
--     cross-lingual contexts. However, dense vectors struggle with exact entity
--     lookups, part numbers, SKUs, pricing codes, and rare proper nouns.
--   - Sparse Full-Text Search (PostgreSQL tsvector / BM25-style ranking):
--     Excels at exact lexical precision, acronyms, catalog numbers, and specific
--     terminology. However, keyword search fails when users ask questions using
--     different phrasing or synonyms.
--
-- By combining both modalities using Reciprocal Rank Fusion (RRF), the retriever
-- surfaces chunks that are either semantically relevant, lexically precise, or both,
-- significantly increasing retrieval recall and ranking accuracy for Arabic and English.
--
-- Multi-Tenancy & Index Versioning:
-- Every retrieval operation enforces:
--   1. Tenant Isolation: 'c.business_id = match_business_id' ensures cross-tenant data
--      can never leak across organizations.
--   2. Document Readiness: 'd.doc_status = ''ready''' excludes documents still in processing.
--   3. Version Consistency: 'c.index_version = d.current_index_version' ensures that
--      during background re-indexing, stale or partially generated chunks are ignored.
-- ==============================================================================


-- ==============================================================================
-- 2. ARABIC ORTHOGRAPHY & NORMALIZATION STRATEGY
-- ==============================================================================
--
-- The Arabic language exhibits rich morphology and orthographic variations that
-- degrade traditional keyword search if not normalized:
--
--   A. Diacritics (Harakat / Tashkeel):
--      Fathah (\u064E), Dammah (\u064F), Kasrah (\u0650), Sukun (\u0652),
--      Tanween (\u064B, \u064C, \u064D), Shaddah (\u0651), and Superscript Alef (\u0670).
--      Most real-world user queries do not contain diacritics, whereas formatted
--      documents often do. Stripping these characters unifies query and document representations.
--
--   B. Tatweel / Kashida (\u0640):
--      Used for typographic justification and elongation (e.g., 'شـــــكراً').
--      It has no semantic meaning and must be removed.
--
--   C. Alef Variations:
--      Unifying 'أ' (Alef with Hamza above), 'إ' (Alef with Hamza below), and
--      'آ' (Alef with Madda) into bare 'ا' (Alef).
--
--   D. Terminal Letter Alternations:
--      - Alef Maksura ('ى') is normalized to Yaa ('ي').
--      - Taa Marbuta ('ة') is normalized to Haa ('ه') to account for colloquial spelling habits.
--
-- Function Characteristics:
-- Marked IMMUTABLE and PARALLEL SAFE to allow PostgreSQL to use it within deterministic
-- STORED GENERATED table columns and parallel query plans.
-- ==============================================================================

-- ==============================================================================
-- Part A: Arabic Text Normalizer Function
-- ==============================================================================
create or replace function arabic_normalize(t text)
returns text
language sql immutable parallel safe
as $$
  select translate(
    regexp_replace(t, E'[\u064B-\u065F\u0670\u0640]', '', 'g'),
    'أإآىة',
    'ااايه'
  );
$$;

comment on function arabic_normalize(text) is
  'Normalizes Arabic text by stripping diacritics/kashida and unifying Alef, Yaa, and Taa Marbuta.';


-- ==============================================================================
-- 3. FULL-TEXT SEARCH (FTS) COLUMN & INVERTED INDEX
-- ==============================================================================
--
-- Why 'simple' dictionary?
-- We use to_tsvector('simple', arabic_normalize(content)) instead of PostgreSQL's
-- default English dictionary. The 'simple' dictionary performs lowercase tokenization
-- and whitespace separation without applying English stemming or stopword pruning,
-- preventing Arabic tokens and transliterated strings from being corrupted.
--
-- Column Type:
-- STORED GENERATED column ensures that tsvector representations are computed once
-- upon chunk insertion or update, avoiding run-time tokenization overhead during searches.
--
-- Inverted Index:
-- GIN (Generalized Inverted Index) on 'fts' provides sub-millisecond sparse keyword lookups.
-- ==============================================================================

-- ==============================================================================
-- Part B: Rebuild Full-Text Search (FTS) Column on public.chunks
-- ==============================================================================
drop index if exists chunks_fts_idx;
alter table public.chunks drop column if exists fts;

alter table public.chunks add column fts tsvector
  generated always as (to_tsvector('simple', arabic_normalize(content))) stored;

create index chunks_fts_idx on public.chunks using gin (fts);


-- ==============================================================================
-- 4. RECIPROCAL RANK FUSION (RRF) & HYBRID RETRIEVAL MECHANICS
-- ==============================================================================
--
-- Algorithm:
-- Reciprocal Rank Fusion (Cormack, Clarke, and Buettcher, SIGIR 2009):
--   RRF_Score(d) = sum_{m in Modalities} ( 1 / (k + rank_m(d)) )
--
-- Advantages of RRF over Score Averaging:
-- 1. No Score Calibration Needed: Vector cosine distances range from 0 to 2 (or similarity 0 to 1),
--    while ts_rank_cd scores are unbounded positive numbers. Normalizing raw scores
--    across disparate distributions is error-prone. RRF depends solely on ordinal rank positions.
-- 2. Robust to Outliers: High-scoring outliers in one modality do not drown out
--    moderate-scoring consensus candidates across both modalities.
-- 3. Smoothing Parameter (k = 60): The default k=60 prevents top-ranked items from
--    overwhelming second-ranked items, rewarding items that appear in both candidate lists.
--
-- Query CTE Pipeline:
--   Step 1 (q):
--     - Normalizes the input query string via arabic_normalize().
--     - Sanitizes punctuation [^\w\s] to spaces to avoid syntax errors with tsquery operators.
--     - Splits words on whitespace and removes empty strings.
--     - Formats into an OR-separated tsquery ('term1 | term2 | term3').
--     - If the query string has no valid alphanumeric tokens, returns NULL to avoid tsquery syntax errors.
--   Step 2 (base):
--     - Filters candidate chunks by workspace business_id, document status 'ready',
--       and active index_version.
--   Step 3 (semantic):
--     - Retrieves the top 20 chunks ordered by vector cosine distance (<=>).
--     - Computes ordinal rank: row_number() over (order by embedding <=> query_embedding).
--   Step 4 (keyword):
--     - Retrieves the top 20 chunks matching the tsquery using GIN index scan.
--     - Ranks by cover density: ts_rank_cd(b.fts, q.tsq).
--     - Computes ordinal rank: row_number() over (order by ts_rank_cd(b.fts, q.tsq) desc).
--   Step 5 (fusion & projection):
--     - Performs a full outer join (via left join on base chunks present in either candidate set).
--     - Calculates the combined RRF score: 1.0 / (rrf_k + semantic_rank) + 1.0 / (rrf_k + keyword_rank).
--     - Computes cosine similarity: 1 - (embedding <=> query_embedding).
--     - Orders by RRF score descending and limits output to match_count.
-- ==============================================================================

-- ==============================================================================
-- Part C: Hybrid Search Function (Dense Vector + Sparse Keyword RRF)
-- ==============================================================================
create or replace function hybrid_match_chunks(
  query_text text,
  query_embedding vector(1024),
  match_business_id uuid,
  match_count int default 6,
  rrf_k int default 60
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  heading_path text,
  similarity float,
  score float
)
language sql stable
as $$
with
-- Step 1: Normalize and tokenize query into an OR-separated tsquery ('word1 | word2').
-- Safely guards against empty or symbol-only inputs to prevent syntax errors.
q as (
  select case 
    when nullif(trim(regexp_replace(arabic_normalize(query_text), '[^\w\s]', ' ', 'g')), '') is null 
    then null::tsquery
    else to_tsquery('simple',
      array_to_string(
        array_remove(
          regexp_split_to_array(
            trim(regexp_replace(arabic_normalize(query_text), '[^\w\s]', ' ', 'g')),
            '\s+'
          ),
          ''
        ),
        ' | '
      )
    )
  end as tsq
),

-- Step 2: Base candidate pool pre-filtered by tenant workspace, 'ready' status,
-- and current active index version to ignore deprecated chunks during re-indexing.
base as (
  select c.id, c.document_id, c.content, c.heading_path, c.embedding, c.fts
  from public.chunks c
  join public.documents d
    on d.id = c.document_id and d.business_id = c.business_id
  where c.business_id = match_business_id
    and d.doc_status = 'ready'
    and c.index_version = d.current_index_version
),

-- Step 3: Dense semantic search - top 20 chunks by cosine distance
semantic as (
  select id, row_number() over (order by embedding <=> query_embedding) as rnk
  from base
  order by embedding <=> query_embedding
  limit 20
),

-- Step 4: Sparse keyword search - top 20 chunks by text relevance ranking
keyword as (
  select b.id, row_number() over (order by ts_rank_cd(b.fts, q.tsq) desc) as rnk
  from base b, q
  where q.tsq is not null and b.fts @@ q.tsq
  order by ts_rank_cd(b.fts, q.tsq) desc
  limit 20
)

-- Step 5: Reciprocal Rank Fusion (RRF) join and final top-N projection
select b.id,
       b.document_id,
       b.content,
       b.heading_path,
       1 - (b.embedding <=> query_embedding) as similarity,
       coalesce(1.0 / (rrf_k + s.rnk), 0) + coalesce(1.0 / (rrf_k + k.rnk), 0) as score
from base b
left join semantic s on s.id = b.id
left join keyword k on k.id = b.id
where s.id is not null or k.id is not null
order by score desc
limit match_count;
$$;

comment on function hybrid_match_chunks(text, vector, uuid, int, int) is
  'Performs multi-tenant hybrid search combining 1024-dim dense vector cosine distance and normalized sparse keyword full-text search using Reciprocal Rank Fusion (RRF).';


-- ==============================================================================
-- Part D: Grants & Permissions
-- ==============================================================================
-- Ensure backend workers (service_role) and authenticated application users
-- have permission to invoke both the normalizer and hybrid retrieval functions.
grant execute on function hybrid_match_chunks to service_role, authenticated;
grant execute on function arabic_normalize to service_role, authenticated;


-- ==============================================================================
-- 5. VERIFICATION & INTEGRATION GUIDE
-- ==============================================================================
--
-- Example 1: Direct SQL Invocation
-- --------------------------------
-- select id, document_id, heading_path, similarity, score, left(content, 80) as snippet
-- from hybrid_match_chunks(
--   query_text        := 'سعر تنظيف الاسنان',
--   query_embedding   := '[0.012, -0.045, ...]'::vector(1024),
--   match_business_id := 'a0000000-0000-0000-0000-000000000001'::uuid,
--   match_count       := 5,
--   rrf_k             := 60
-- );
--
-- Example 2: Calling from Supabase TypeScript Client
-- --------------------------------------------------
-- const { data, error } = await supabase.rpc('hybrid_match_chunks', {
--   query_text: queryText,
--   query_embedding: embeddingVector, // number[] of length 1024
--   match_business_id: businessId,
--   match_count: 6,
--   rrf_k: 60,
-- });
--
-- ==============================================================================
