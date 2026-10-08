create table conversations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references business(id) on delete cascade,
  visitor_id uuid references visitors(id) on delete set null,  -- null for dashboard test chat
  channel text not null default 'widget'
    check (channel in ('widget','test')),
  started_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),

  unique (id, business_id)   -- needed for the composite FK from messages
);

create index on conversations (business_id, last_message_at desc);
create index on conversations (visitor_id);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null,
  business_id uuid not null references business(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,

  sources uuid[] not null default '{}',   -- chunk ids retrieved for this answer
  top_score real,                         -- best retrieval similarity (for knowledge gaps)
  model text,
  tokens_in int,
  tokens_out int,
  latency_ms int,

  created_at timestamptz not null default now(),

  foreign key (conversation_id, business_id)
    references conversations (id, business_id) on delete cascade
);

create index on messages (conversation_id, created_at);
create index on messages (business_id, created_at desc);

-- RLS: owner can read, server writes
alter table conversations enable row level security;
alter table messages enable row level security;

create policy "conversations: owner select" on conversations
for select to authenticated
using (business_id in (select id from business where owner_id = (select auth.uid())));

create policy "messages: owner select" on messages
for select to authenticated
using (business_id in (select id from business where owner_id = (select auth.uid())));