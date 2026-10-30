-- Grant table access to authenticated dashboard users (RLS will filter the rows)
GRANT SELECT, UPDATE ON TABLE public.conversations TO authenticated;
GRANT SELECT ON TABLE public.messages TO authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.leads TO authenticated;
GRANT SELECT ON TABLE public.visitors TO authenticated;

-- Ensure service_role has full access for backend widget operations
GRANT ALL ON TABLE public.leads TO service_role;
GRANT ALL ON TABLE public.conversations TO service_role;
GRANT ALL ON TABLE public.messages TO service_role;
GRANT ALL ON TABLE public.visitors TO service_role;
