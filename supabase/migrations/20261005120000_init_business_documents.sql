-- 1. Create business table
create table if not exists public.business (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text,
  name_arabic text,
  city text,
  district text,
  type text,
  app_language text default 'ar',
  primary_color text default '#0F5C55',
  secondary_color text default '#D3E6E2',
  background_color text default '#FFFFFF',
  border_radius int default 0,
  allowed_domains text[] default '{}'::text[],
  welcome_message text,
  created_at timestamptz default now()
);

-- 2. Create initial Documents table (only if neither Documents nor documents exists)
do $$
begin
  if not exists (select 1 from pg_tables where schemaname = 'public' and tablename in ('Documents', 'documents')) then
    create table public."Documents" (
      id uuid primary key default gen_random_uuid(),
      business_id uuid not null references public.business(id) on delete cascade,
      name text not null,
      mime_type text not null,
      doc_status text not null default 'queued',
      storage_path text,
      stats jsonb default '{}'::jsonb,
      error_message text,
      created_at timestamptz default now(),
      unique (id, business_id)
    );
  end if;
end $$;