
-- text[] gurantees every item is atext string.
ALTER TABLE public.documents 
ADD COLUMN suggested_questions text[] DEFAULT '{}'::text[];
