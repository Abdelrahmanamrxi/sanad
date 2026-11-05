-- Adds app_language to business table to govern dashboard / platform UI language (Arabic vs English)
alter table public.business
  add column if not exists app_language text not null default 'en'
    check (app_language in ('en', 'ar'));

