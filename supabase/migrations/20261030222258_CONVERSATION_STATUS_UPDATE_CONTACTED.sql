-- Migration: Add 'contacted' to conversations.status check constraint

-- 1. Drop the existing check constraint on conversations.status
ALTER TABLE public.conversations
  DROP CONSTRAINT IF EXISTS conversations_status_check;

-- 2. Add updated check constraint allowing 'contacted'
ALTER TABLE public.conversations
  ADD CONSTRAINT conversations_status_check
  CHECK (status IN ('active', 'needs_attention', 'resolved', 'contacted'));
