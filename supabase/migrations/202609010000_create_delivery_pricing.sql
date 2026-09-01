-- Delivery pricing for Nigerian states and Lagos cities
-- Creates the delivery_pricing table, enables RLS, and seeds all locations.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.delivery_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_type text NOT NULL CHECK (location_type IN ('state', 'city')),
  name text NOT NULL,
  parent_state text,
  price numeric(10, 2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (location_type, name, parent_state)
);

ALTER TABLE public.delivery_pricing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "delivery_pricing_select" ON public.delivery_pricing;
CREATE POLICY "delivery_pricing_select" ON public.delivery_pricing
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "delivery_pricing_insert" ON public.delivery_pricing;
CREATE POLICY "delivery_pricing_insert" ON public.delivery_pricing
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "delivery_pricing_update" ON public.delivery_pricing;
CREATE POLICY "delivery_pricing_update" ON public.delivery_pricing
  FOR UPDATE USING (true) WITH CHECK (true);

-- Seed all Nigerian states
INSERT INTO public.delivery_pricing (location_type, name, parent_state, price) VALUES
  ('state', 'Abia', NULL, 0),
  ('state', 'Adamawa', NULL, 0),
  ('state', 'Akwa Ibom', NULL, 0),
  ('state', 'Anambra', NULL, 0),
  ('state', 'Bauchi', NULL, 0),
  ('state', 'Bayelsa', NULL, 0),
  ('state', 'Benue', NULL, 0),
  ('state', 'Borno', NULL, 0),
  ('state', 'Cross River', NULL, 0),
  ('state', 'Delta', NULL, 0),
  ('state', 'Ebonyi', NULL, 0),
  ('state', 'Edo', NULL, 0),
  ('state', 'Ekiti', NULL, 0),
  ('state', 'Enugu', NULL, 0),
  ('state', 'FCT', NULL, 0),
  ('state', 'Gombe', NULL, 0),
  ('state', 'Imo', NULL, 0),
  ('state', 'Jigawa', NULL, 0),
  ('state', 'Kaduna', NULL, 0),
  ('state', 'Kano', NULL, 0),
  ('state', 'Katsina', NULL, 0),
  ('state', 'Kebbi', NULL, 0),
  ('state', 'Kogi', NULL, 0),
  ('state', 'Kwara', NULL, 0),
  ('state', 'Lagos', NULL, 0),
  ('state', 'Nasarawa', NULL, 0),
  ('state', 'Niger', NULL, 0),
  ('state', 'Ogun', NULL, 0),
  ('state', 'Ondo', NULL, 0),
  ('state', 'Osun', NULL, 0),
  ('state', 'Oyo', NULL, 0),
  ('state', 'Plateau', NULL, 0),
  ('state', 'Rivers', NULL, 0),
  ('state', 'Sokoto', NULL, 0),
  ('state', 'Taraba', NULL, 0),
  ('state', 'Yobe', NULL, 0),
  ('state', 'Zamfara', NULL, 0)
ON CONFLICT (location_type, name, parent_state) DO NOTHING;

-- Seed Lagos cities
INSERT INTO public.delivery_pricing (location_type, name, parent_state, price) VALUES
  ('city', 'Ajeromi-Ifelodun', 'Lagos', 0),
  ('city', 'Alimosho', 'Lagos', 0),
  ('city', 'Amuwo-Odofin', 'Lagos', 0),
  ('city', 'Apapa', 'Lagos', 0),
  ('city', 'Badagry', 'Lagos', 0),
  ('city', 'Epe', 'Lagos', 0),
  ('city', 'Eti Osa', 'Lagos', 0),
  ('city', 'Ibeju-Lekki', 'Lagos', 0),
  ('city', 'Ifako-Ijaiye', 'Lagos', 0),
  ('city', 'Ikeja', 'Lagos', 0),
  ('city', 'Ikorodu', 'Lagos', 0),
  ('city', 'Kosofe', 'Lagos', 0),
  ('city', 'Lagos Island', 'Lagos', 0),
  ('city', 'Lagos Mainland', 'Lagos', 0),
  ('city', 'Mushin', 'Lagos', 0),
  ('city', 'Ojo', 'Lagos', 0),
  ('city', 'Oshodi-Isolo', 'Lagos', 0),
  ('city', 'Shomolu', 'Lagos', 0),
  ('city', 'Surulere', 'Lagos', 0)
ON CONFLICT (location_type, name, parent_state) DO NOTHING;
