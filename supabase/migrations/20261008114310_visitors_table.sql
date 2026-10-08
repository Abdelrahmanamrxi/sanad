create table visitors (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references business(id) on delete cascade,
  anon_id text not null,          -- the id is going to be fetched from localStorage
  first_seen_at timestamptz default now(),
  last_seen_at timestamptz default now(),
  unique (business_id, anon_id)
);
-- Table is used to track who opens the chat panel and interacts with AI 
