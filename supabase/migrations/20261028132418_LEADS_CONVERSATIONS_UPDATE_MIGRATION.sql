-- 1. Create the dedicated Leads table
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id uuid NOT NULL REFERENCES business(id) ON DELETE CASCADE,
  visitor_id uuid REFERENCES visitors(id) ON DELETE SET NULL,
  
  -- Contact details
  name text,
  email text,
  phone text,
  company text,
  
  -- CRM workflow
  status text NOT NULL DEFAULT 'new' 
    CHECK (status IN ('new', 'contacted', 'qualified', 'closed')), 
  notes text,
  origin_page text,                     -- e.g. page the user contact the chatbot eg "/checkout" | "/pricing"
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Add workflow fields and the lead link to `conversations`
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS summary text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active' -- To track conversations AI hasn't been able to answer
    CHECK (status IN ('active', 'needs_attention', 'resolved')),
  ADD COLUMN IF NOT EXISTS origin_page text,
  
  -- Fast link to the lead
  ADD COLUMN IF NOT EXISTS has_lead boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS lead_id uuid REFERENCES leads(id) ON DELETE SET NULL;

-- 3. Indexes for instant loading
CREATE INDEX IF NOT EXISTS idx_leads_business ON leads (business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_lead ON conversations (lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_has_lead ON conversations (business_id, has_lead) WHERE has_lead = true;
