-- 1. Drop the existing constraint (which was ON DELETE SET NULL)
ALTER TABLE conversations
  DROP CONSTRAINT IF EXISTS conversations_visitor_id_fkey;

-- 2. Re-add the foreign key constraint with ON DELETE CASCADE
ALTER TABLE conversations
  ADD CONSTRAINT conversations_visitor_id_fkey
  FOREIGN KEY (visitor_id)
  REFERENCES visitors(id)
  ON DELETE CASCADE;