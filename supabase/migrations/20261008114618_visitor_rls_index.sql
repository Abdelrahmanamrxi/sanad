create index on visitors (business_id, last_seen_at desc);

alter table visitors enable row level security;

create policy "visitors: owner select" on visitors
for select to authenticated
using (business_id in (select id from business where owner_id = (select auth.uid())));