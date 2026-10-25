-- Migration: Grant service_role access to widget, visitor, conversation, message, and billing tables
-- Fixes permission denied errors when the backend inserts visitors/conversations/messages via service role client

GRANT ALL ON TABLE public.visitors TO service_role;
GRANT ALL ON TABLE public.conversations TO service_role;
GRANT ALL ON TABLE public.messages TO service_role;
GRANT ALL ON TABLE public.widget_settings TO service_role;
GRANT ALL ON TABLE public.subscriptions TO service_role;
GRANT ALL ON TABLE public.usage_cycles TO service_role;

-- Ensure sequences in public schema are also accessible
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Ensure future tables and sequences in public schema automatically grant full privileges to service_role
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON SEQUENCES TO service_role;
