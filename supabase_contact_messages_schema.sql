-- ============================================================================
-- Melodiva Skincare - Supabase Contact Messages Table Schema
-- Execute this SQL in your Supabase SQL Editor if the table doesn't exist yet
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anyone (public) to insert contact messages from the Contact Us form
DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public insert on contact_messages"
ON public.contact_messages FOR INSERT
TO public
WITH CHECK (true);

-- Policy 2: Allow full read/write access for contact messages in Admin panel
DROP POLICY IF EXISTS "Allow full access on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow full access on contact_messages"
ON public.contact_messages FOR ALL
TO public
USING (true)
WITH CHECK (true);
