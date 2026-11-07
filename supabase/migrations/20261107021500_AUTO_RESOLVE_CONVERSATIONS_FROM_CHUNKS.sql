-- Migration: Auto-resolve conversations that have verified chunk/doc answers
-- Migration ID: 20261107021500_AUTO_RESOLVE_CONVERSATIONS_FROM_CHUNKS.sql

UPDATE public.conversations c
SET status = 'resolved'
WHERE c.status = 'active'
  AND (c.has_lead IS FALSE OR c.has_lead IS NULL)
  AND EXISTS (
    SELECT 1 FROM public.messages m
    WHERE m.conversation_id = c.id
      AND m.role = 'assistant'
      AND m.sources IS NOT NULL
      AND array_length(m.sources, 1) > 0
      AND m.content NOT LIKE '%[[SHOW_LEAD_FORM]]%'
  );

