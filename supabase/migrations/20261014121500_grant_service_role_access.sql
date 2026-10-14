-- Grant full permissions on all knowledge-base and auth tables to service_role
GRANT ALL ON TABLE public.documents TO service_role;
GRANT ALL ON TABLE public.chunks TO service_role;
GRANT ALL ON TABLE public.business TO service_role;

-- Ensure future tables also grant privileges to service_role
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT ALL ON TABLES TO service_role;
