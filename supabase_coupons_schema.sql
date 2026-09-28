-- ============================================================================
-- Melodiva Skincare - Supabase Coupons Table Schema
-- Execute this SQL in your Supabase SQL Editor if using Supabase for coupons
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  amount NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used')),
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Allow public read & verification of coupon codes
DROP POLICY IF EXISTS "Allow public select on coupons" ON public.coupons;
CREATE POLICY "Allow public select on coupons"
ON public.coupons FOR SELECT
TO public
USING (true);

-- Allow full access for admin and system
DROP POLICY IF EXISTS "Allow full access on coupons" ON public.coupons;
CREATE POLICY "Allow full access on coupons"
ON public.coupons FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Index for coupon code lookup
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
