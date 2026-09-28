-- ============================================================================
-- Melodiva Skincare - Supabase Order Issues / Damaged Claims Schema
-- Execute this SQL in your Supabase SQL Editor to support order issue reporting
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.order_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL,
  order_number TEXT NOT NULL,
  user_id UUID NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  issue_type TEXT NOT NULL DEFAULT 'damaged_item',
  description TEXT NOT NULL,
  media_urls JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.order_issues ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public/customers to submit issues
DROP POLICY IF EXISTS "Allow public insert on order_issues" ON public.order_issues;
CREATE POLICY "Allow public insert on order_issues"
ON public.order_issues FOR INSERT
TO public
WITH CHECK (true);

-- Policy 2: Allow public to view reported issues for tracking
DROP POLICY IF EXISTS "Allow public select on order_issues" ON public.order_issues;
CREATE POLICY "Allow public select on order_issues"
ON public.order_issues FOR SELECT
TO public
USING (true);

-- Policy 3: Allow full administrative access
DROP POLICY IF EXISTS "Allow full access on order_issues" ON public.order_issues;
CREATE POLICY "Allow full access on order_issues"
ON public.order_issues FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_order_issues_order_number ON public.order_issues(order_number);
CREATE INDEX IF NOT EXISTS idx_order_issues_status ON public.order_issues(status);
