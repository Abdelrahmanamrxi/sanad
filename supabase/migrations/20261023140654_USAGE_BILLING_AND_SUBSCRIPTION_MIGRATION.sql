-- ==============================================================================
-- Migration: Multi-Tenant Usage Metering, Subscriptions & Quota Enforcement
-- Migration ID: 20261023140654_USAGE_BILLING_AND_SUBSCRIPTION_MIGRATION.sql
-- Project: Sanad SaaS Platform
--
-- Table of Contents:
--   1. Architectural Overview & Metering Strategy
--   2. Data Model (subscriptions & usage_cycles)
--   3. Concurrency & Atomic RPC Guarantees (increment_business_usage)
--   4. Row-Level Security (RLS) & Zero-Trust Threat Model
--   5. Automatic Tenant Provisioning Trigger (create_default_subscription)
--   6. Schema DDL: Tables, Constraints & Indices
--   7. RLS Policies & Privilege Configuration
--   8. Stored Procedures & Security Definer Functions
--   9. Backfill Script & Lifecycle Triggers
--  10. Application Integration Guide (TypeScript / Supabase Client)
-- ==============================================================================

-- ==============================================================================
-- 1. ARCHITECTURAL OVERVIEW & METERING STRATEGY
-- ==============================================================================
--
-- Multi-Tenant SaaS AI systems require strict isolation between financial tiers
-- and physical compute consumption. Each customer question incurs:
--   - Dense/Sparse vector retrieval compute (RAG over knowledge base)
--   - Large Language Model generation tokens (Groq / OpenRouter API costs)
--
-- Metering Model:
--   - Time Horizon: 30-day sliding/fixed billing cycles ('current_period_start' to 'current_period_end').
--   - Primary Business Unit: Messages Count (Total AI responses delivered to end visitors).
--   - Secondary Units: Token I/O ('tokens_in' and 'tokens_out' for margin/cost audits).
--
-- Why not COUNT(*) on the messages table?
--   Running SELECT count(*) FROM messages WHERE business_id = ... on every single
--   visitor chat request introduces O(N) database reads and lock contention once
--   a tenant accumulates tens of thousands of conversations.
--   Instead, this migration implements an O(1) cycle counter bucket ('usage_cycles')
--   updated atomically upon completion of each streaming generation.
-- ==============================================================================

-- ==============================================================================
-- 2. DATA MODEL
-- ==============================================================================
--
-- [public.subscriptions]
--   Represents the current account entitlement and active billing period for a business.
--   - business_id: 1-to-1 unique mapping to public.business.
--   - plan_tier: 'free' | 'starter' | 'pro' (determines quotas in application code).
--   - status: 'active' | 'past_due' | 'canceled' | 'trialing'.
--   - current_period_start / end: Active 30-day window boundary.
--
-- [public.usage_cycles]
--   Immutable historical ledger of resource consumption partitioned by cycle start.
--   - Composite constraint: UNIQUE(business_id, period_start) guarantees one ledger
--     per billing window per business.
--   - messages_count: Incremented atomically per completed assistant message.
--   - tokens_in / tokens_out: Cumulative token counters for analytics.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- PART 1: SUBSCRIPTIONS TABLE
-- ------------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references public.business(id) on delete cascade,
  plan_tier text not null default 'free' check (plan_tier in ('free', 'starter', 'pro')),
  status text not null default 'active' check (status in ('active', 'past_due', 'canceled', 'trialing')),
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null default (now() + interval '30 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.subscriptions is 
  'Tracks tier entitlement, lifecycle status, and active billing window for each business workspace.';

-- ------------------------------------------------------------------------------
-- PART 2: USAGE CYCLES TABLE & PERFORMANCE INDICES
-- ------------------------------------------------------------------------------
create table if not exists public.usage_cycles (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  period_start timestamptz not null,
  period_end timestamptz not null,
  messages_count int not null default 0,
  tokens_in int not null default 0,
  tokens_out int not null default 0,
  unique (business_id, period_start)
);

comment on table public.usage_cycles is 
  'Aggregated consumption ledger per 30-day billing window. Enables O(1) quota verifications.';

-- Fast lookup for the most recent / active cycle when querying dashboard analytics
create index if not exists usage_cycles_business_period_end_idx
  on public.usage_cycles (business_id, period_end desc);

-- ------------------------------------------------------------------------------
-- PART 3: ROW-LEVEL SECURITY (RLS) & PRIVILEGE ENFORCEMENT
-- ------------------------------------------------------------------------------
--
-- Security Philosophy:
--   1. Authenticated business owners can only SELECT rows associated with their workspace.
--   2. Direct client-side INSERT / UPDATE / DELETE is completely disallowed.
--   3. All usage increments and subscription tier updates are routed through
--      the backend using the Supabase Service Role (which bypasses RLS).
-- ------------------------------------------------------------------------------
alter table public.subscriptions enable row level security;
alter table public.usage_cycles  enable row level security;

create policy "owners read own subscription"
  on public.subscriptions for select
  to authenticated
  using (
    exists (
      select 1 from public.business b
      where b.id = subscriptions.business_id
        and b.owner_id = (select auth.uid())
    )
  );

create policy "owners read own usage"
  on public.usage_cycles for select
  to authenticated
  using (
    exists (
      select 1 from public.business b
      where b.id = usage_cycles.business_id
        and b.owner_id = (select auth.uid())
    )
  );

-- ------------------------------------------------------------------------------
-- PART 4: ATOMIC USAGE INCREMENT RPC (Concurrency Safe)
-- ------------------------------------------------------------------------------
--
-- Concurrency & Race Conditions:
--   If 10 visitors chat with the same store concurrently, a naive read-then-write
--   pattern creates lost updates.
--   The function below uses Postgres UPSERT (ON CONFLICT DO UPDATE) with atomic
--   arithmetic (+ 1, + inc_tokens), guaranteeing zero lost updates under heavy load.
--
-- Search Path Hardening:
--   'set search_path = ''''' prevents search path poisoning attacks on SECURITY DEFINER.
-- ------------------------------------------------------------------------------
drop function if exists public.increment_business_usage(uuid, timestamptz, timestamptz, int, int);

create or replace function public.increment_business_usage(
  target_business_id uuid,
  p_start timestamptz,
  p_end timestamptz,
  inc_tokens_in int,
  inc_tokens_out int
)
returns int
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_count int;
begin
  insert into public.usage_cycles
    (business_id, period_start, period_end, messages_count, tokens_in, tokens_out)
  values
    (target_business_id, p_start, p_end, 1, inc_tokens_in, inc_tokens_out)
  on conflict (business_id, period_start) do update set
    messages_count = public.usage_cycles.messages_count + 1,
    tokens_in      = public.usage_cycles.tokens_in  + excluded.tokens_in,
    tokens_out     = public.usage_cycles.tokens_out + excluded.tokens_out
  returning messages_count into new_count;

  return new_count;
end;
$$;

-- Secure execution permissions: Revoke from untrusted callers, grant exclusively to backend service_role
revoke execute on function public.increment_business_usage(uuid, timestamptz, timestamptz, int, int)
  from public, anon, authenticated;

grant execute on function public.increment_business_usage(uuid, timestamptz, timestamptz, int, int)
  to service_role;

-- ------------------------------------------------------------------------------
-- PART 5: AUTOMATIC TENANT ONBOARDING TRIGGER
-- ------------------------------------------------------------------------------
--
-- Automatically provisions a default 'free' plan subscription whenever a new
-- business row is inserted into public.business, eliminating manual seeding.
-- ------------------------------------------------------------------------------
create or replace function public.create_default_subscription()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.subscriptions (business_id) 
  values (new.id)
  on conflict (business_id) do nothing;
  
  return new;
end;
$$;

revoke execute on function public.create_default_subscription() 
  from public, anon, authenticated;

drop trigger if exists on_business_created on public.business;

create trigger on_business_created
  after insert on public.business
  for each row execute function public.create_default_subscription();

-- ------------------------------------------------------------------------------
-- PART 6: BACKFILL EXISTING BUSINESSES
-- ------------------------------------------------------------------------------
-- Ensures all previously created businesses are granted their default subscription.
insert into public.subscriptions (business_id)
select id from public.business
on conflict (business_id) do nothing;