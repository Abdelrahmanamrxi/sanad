create table widget_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references business(id) on delete cascade,

  -- Identity & Language
  bot_name text not null default 'Sanad AI Support',
  subtitle text not null default 'At your help.',
  default_language text not null default 'auto' check (default_language in ('auto', 'en', 'ar')),
  status text not null default 'online' check (status in ('online', 'offline')),
  -- Appearance & Placement
  primary_color text not null default '#0F5C55',
  secondary_color text default '#D3E6E2',
  border_radius int not null default 0, -- 0px sharp as per Sanad design guidelines
  position text not null default 'bottom-right' check (position in ('bottom-right', 'bottom-left')),
  corner_radius int not null default 0,
  -- Launcher Trigger
  launcher_style text not null default 'badge' check (launcher_style in ('badge', 'icon')),
  launcher_text text not null default 'Chat with us',

  -- Messages & Starters
  welcome_message text not null default 'Hello! I am Sanad, your AI assistant. How can I assist you today?',
  starter_questions jsonb not null default '[
    "What is your return and exchange policy?",
    "How long does delivery take and what does it cost?",
    "How can I track my existing order status?",
    "What payment methods and installment options are available?"
  ]'::jsonb,

  -- Security & State
  is_active boolean not null default true,
  allowed_domains text[] not null default '{}',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for fast lookup by business_id (for storefront script loader)
create index idx_widget_settings_business_id on widget_settings(business_id);

-- Enable RLS
alter table widget_settings enable row level security;

-- 1. Authenticated business owner can read and update their own widget settings
create policy "widget_settings: owner manage" on widget_settings
  for all to authenticated
  using (business_id in (select id from business where owner_id = (select auth.uid())))
  with check (business_id in (select id from business where owner_id = (select auth.uid())));

-- 2. Public / Anonymous visitors can read active widget configs for storefront rendering
create policy "widget_settings: public read" on widget_settings
  for select to anon
  using (is_active = true);
