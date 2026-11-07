-- Unlogged table = zero disk write overhead, ultra-fast in-memory Postgres table
-- WAL LOG isn't needed as if POSTGRES crashes this data would be irrelevant.

create unlogged table if not exists public.widget_rate_limits (
  key text primary key,
  count int not null default 1,
  expires_at timestamptz not null default now() + interval '1 minute'
);

-- Index to quickly remove expired entries
create index if not exists idx_rate_limit_expires on public.widget_rate_limits(expires_at);

-- Atomic check and increment function
create or replace function check_widget_rate_limit(
  p_key text,
  p_max_requests int default 10
)
returns boolean
language plpgsql
security definer
as $$
declare
  v_count int;
begin
  -- Delete expired keys periodically
  delete from public.widget_rate_limits where expires_at < now();

  -- Atomically upsert counter
  insert into public.widget_rate_limits (key, count, expires_at)
  values (p_key, 1, now() + interval '1 minute')
  on conflict (key) do update
  set count = public.widget_rate_limits.count + 1
  returning count into v_count;

  -- Return true if allowed, false if limit exceeded
  return v_count <= p_max_requests;
end;
$$;