-- Migration: Add 'human_resolved' to conversations.status check constraint
-- Migration ID: 20261107014000_UPDATE_CONVERSATION_STATUSES_HUMAN_RESOLVED.sql

-- 1. Drop the existing check constraint on conversations.status
ALTER TABLE public.conversations
  DROP CONSTRAINT IF EXISTS conversations_status_check;

-- 2. Add updated check constraint allowing 'resolved', 'needs_attention', 'human_resolved', 'contacted', 'active'
ALTER TABLE public.conversations
  ADD CONSTRAINT conversations_status_check
  CHECK (status IN ('resolved', 'needs_attention', 'human_resolved', 'contacted', 'active'));

-- 3. Comment explaining status semantics
COMMENT ON COLUMN public.conversations.status IS 
  'Conversation lifecycle status: resolved (AI answered autonomously), needs_attention (escalated/unanswered by AI), human_resolved (operator manually resolved escalated inquiry), contacted (lead contacted), active (ongoing inquiry).';

