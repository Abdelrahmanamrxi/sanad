create extension if not exists vector;

alter table public."Documents" rename to documents;

create index on documents (business_id, doc_status);

create table chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null,
  business_id uuid not null references business(id) on delete cascade,
  chunk_index int not null,
  content text not null,              -- what the LLM sees        -- skip re-embedding unchanged chunks on re-sync
  token_count int,
  embedding vector(1536) not null,
  embedding_model text not null,
  page_number int,
  heading_path text,                  -- "Pricing > Cleaning packages"
  metadata jsonb default '{}',        -- sheet name, row range, faq question, etc.
  fts tsvector generated always as (to_tsvector('simple', content)) stored,
  created_at timestamptz default now(),

  unique (document_id, chunk_index),
  -- chunk's business_id must match its document's business_id
  foreign key (document_id, business_id)
    references documents (id, business_id) on delete cascade
);

create index on chunks using hnsw (embedding vector_cosine_ops);
create index on chunks using gin (fts);
create index on chunks (business_id);
create index on chunks (document_id);