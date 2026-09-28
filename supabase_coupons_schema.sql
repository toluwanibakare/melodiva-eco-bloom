-- ============================================================================
-- Melodiva Skincare - Supabase Coupons Table Schema
-- Execute this SQL in your Supabase SQL Editor if using Supabase for coupons
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type VARCHAR(20) NOT NULL DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percentage', 'free_delivery')),
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  min_order_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  expiry_date TIMESTAMPTZ NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'inactive', 'expired')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  user_id UUID NULL,
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

-- Seed October Free Delivery Coupon for Orders > 20k
INSERT INTO public.coupons (code, discount_type, amount, min_order_amount, expiry_date, status, is_active)
VALUES ('OCTOBERFREE', 'free_delivery', 0.00, 20000.00, '2026-10-31T23:59:59Z', 'active', true)
ON CONFLICT (code) DO UPDATE 
SET discount_type = 'free_delivery',
    min_order_amount = 20000.00,
    expiry_date = '2026-10-31T23:59:59Z',
    status = 'active',
    is_active = true;

