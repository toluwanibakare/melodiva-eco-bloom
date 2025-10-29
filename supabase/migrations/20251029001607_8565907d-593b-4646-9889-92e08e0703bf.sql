-- Fix search_path for generate_order_number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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