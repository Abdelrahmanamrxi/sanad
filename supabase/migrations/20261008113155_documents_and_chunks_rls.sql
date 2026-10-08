alter table documents enable row level security;
alter table chunks enable row level security;

-- helps every policy below
create index if not exists business_owner_id_idx on business (owner_id);

-- DOCUMENTS: owner can do everything on their own business's docs
create policy "documents: owner all"
on documents for all
to authenticated
using (
  business_id in (select id from business where owner_id = (select auth.uid()))
)
with check (
  business_id in (select id from business where owner_id = (select auth.uid()))
);

-- CHUNKS: owner can read only
create policy "chunks: owner select"
on chunks for select
to authenticated
using (
  business_id in (select id from business where owner_id = (select auth.uid()))
);