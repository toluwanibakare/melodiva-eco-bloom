-- Create orders table
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  order_number text NOT NULL UNIQUE,
  items jsonb NOT NULL,
  subtotal numeric NOT NULL,
  discount numeric NOT NULL DEFAULT 0,
  delivery_fee numeric NOT NULL,
  total numeric NOT NULL,
  affiliate_code text,
  affiliate_id uuid,
  delivery_address text NOT NULL,
  delivery_state text NOT NULL,
  delivery_city text NOT NULL,
  phone_number text NOT NULL,
  whatsapp_number text,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_reference text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create order_status_history table for tracking
CREATE TABLE public.order_status_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
ON public.orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_status_history
CREATE POLICY "Users can view status history for their orders"
ON public.order_status_history
FOR SELECT
USING (order_id IN (
  SELECT id FROM public.orders WHERE user_id = auth.uid()
));

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  new_number text;
  exists_check boolean;
BEGIN
  LOOP
    new_number := 'ORD-' || LPAD(FLOOR(RANDOM() * 999999)::text, 6, '0');
    
    SELECT EXISTS(SELECT 1 FROM public.orders WHERE order_number = new_number) INTO exists_check;
    
    IF NOT exists_check THEN
      RETURN new_number;
    END IF;
  END LOOP;
END;
$$;