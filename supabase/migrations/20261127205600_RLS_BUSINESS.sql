-- Enable RLS and define owner-scoped policies for public.business

alter table public.business enable row level security;

drop policy if exists "Enable users to view their own data only" on public.business;
create policy "Enable users to view their own data only"
on public.business
for select
to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "Enable insert for users based on user_id" on public.business;
create policy "Enable insert for users based on user_id"
on public.business
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "Enable update for owners" on public.business;
create policy "Enable update for owners"
on public.business
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "Enable delete for users based on user_id" on public.business;
create policy "Enable delete for users based on user_id"
on public.business
for delete
to authenticated
using ((select auth.uid()) = owner_id);
