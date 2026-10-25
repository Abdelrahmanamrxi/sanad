-- Migration: Add unique partial index to prevent duplicate widget conversations per visitor
-- Ensures atomic concurrency safety across multiple session handshakes

CREATE UNIQUE INDEX IF NOT EXISTS conversations_business_visitor_widget_idx
ON public.conversations (business_id, visitor_id)
WHERE channel = 'widget';
