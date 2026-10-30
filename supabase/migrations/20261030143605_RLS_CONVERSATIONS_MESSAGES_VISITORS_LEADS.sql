-- ====================================================================
-- ROW LEVEL SECURITY: CONVERSATIONS, MESSAGES, LEADS, VISITORS
-- ====================================================================

-- 1. CONVERSATIONS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "conversations: owner select" ON conversations;
DROP POLICY IF EXISTS "conversations: owner update" ON conversations;

-- Business owners can read their own business conversations
CREATE POLICY "conversations: owner select" ON conversations
FOR SELECT TO authenticated
USING (
  business_id IN (
    SELECT id FROM business WHERE owner_id = (SELECT auth.uid())
  )
);

-- Business owners can update their conversation status (resolve, reopen, etc.)
CREATE POLICY "conversations: owner update" ON conversations
FOR UPDATE TO authenticated
USING (
  business_id IN (
    SELECT id FROM business WHERE owner_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  business_id IN (
    SELECT id FROM business WHERE owner_id = (SELECT auth.uid())
  )
);


-- 2. MESSAGES
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages: owner select" ON messages;

-- Business owners can read messages belonging to their conversations
CREATE POLICY "messages: owner select" ON messages
FOR SELECT TO authenticated
USING (
  business_id IN (
    SELECT id FROM business WHERE owner_id = (SELECT auth.uid())
  )
);


-- 3. LEADS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "leads: owner select" ON leads;
DROP POLICY IF EXISTS "leads: owner update" ON leads;
DROP POLICY IF EXISTS "leads: owner delete" ON leads;

-- Business owners can read their business leads
CREATE POLICY "leads: owner select" ON leads
FOR SELECT TO authenticated
USING (
  business_id IN (
    SELECT id FROM business WHERE owner_id = (SELECT auth.uid())
  )
);

-- Business owners can update lead status ('contacted', 'qualified') and notes
CREATE POLICY "leads: owner update" ON leads
FOR UPDATE TO authenticated
USING (
  business_id IN (
    SELECT id FROM business WHERE owner_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  business_id IN (
    SELECT id FROM business WHERE owner_id = (SELECT auth.uid())
  )
);

-- Business owners can delete leads if needed
CREATE POLICY "leads: owner delete" ON leads
FOR DELETE TO authenticated
USING (
  business_id IN (
    SELECT id FROM business WHERE owner_id = (SELECT auth.uid())
  )
);


-- 4. VISITORS
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "visitors: owner select" ON visitors;

-- Business owners can view visitors associated with their business
CREATE POLICY "visitors: owner select" ON visitors
FOR SELECT TO authenticated
USING (
  business_id IN (
    SELECT id FROM business WHERE owner_id = (SELECT auth.uid())
  )
);
