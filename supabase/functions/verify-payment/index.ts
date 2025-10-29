import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { reference, orderData } = await req.json();

    // Verify payment with Paystack
    const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY');
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyData.status || verifyData.data.status !== 'success') {
      throw new Error('Payment verification failed');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate order number
    const { data: orderNumber, error: orderNumberError } = await supabaseClient
      .rpc('generate_order_number');

    if (orderNumberError) throw orderNumberError;

    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: orderData.user_id,
        order_number: orderNumber,
        items: orderData.items,
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        delivery_fee: orderData.delivery_fee,
        total: orderData.total,
        affiliate_code: orderData.affiliate_code || null,
        affiliate_id: orderData.affiliate_id || null,
        delivery_address: orderData.delivery_address,
        delivery_state: orderData.delivery_state,
        delivery_city: orderData.delivery_city,
        phone_number: orderData.phone_number,
        whatsapp_number: orderData.whatsapp_number,
        payment_status: 'completed',
        payment_reference: reference,
        status: 'completed',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create initial status history
    const { error: historyError } = await supabaseClient
      .from('order_status_history')
      .insert({
        order_id: order.id,
        status: 'completed',
        notes: 'Payment completed successfully',
      });

    if (historyError) throw historyError;

    // Update affiliate commission if applicable
    if (orderData.affiliate_id) {
      const commissionAmount = calculateCommission(orderData.items);
      
      // Get current affiliate data
      const { data: affiliate } = await supabaseClient
        .from('affiliates')
        .select('current_balance, total_commission')
        .eq('id', orderData.affiliate_id)
        .single();

      if (affiliate) {
        // Update affiliate balance
        const { error: affiliateError } = await supabaseClient
          .from('affiliates')
          .update({
            current_balance: affiliate.current_balance + commissionAmount,
            total_commission: affiliate.total_commission + commissionAmount,
          })
          .eq('id', orderData.affiliate_id);

        if (affiliateError) console.error('Failed to update affiliate:', affiliateError);
      }

      // Create referral record
      const { error: referralError } = await supabaseClient
        .from('affiliate_referrals')
        .insert({
          affiliate_id: orderData.affiliate_id,
          order_id: order.order_number,
          referred_user_id: orderData.user_id,
          commission_amount: commissionAmount,
          status: 'completed',
        });

      if (referralError) console.error('Failed to create referral:', referralError);
    }

    return new Response(
      JSON.stringify({ success: true, order }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function calculateCommission(items: any[]): number {
  let commission = 0;
  
  for (const item of items) {
    const itemName = item.name.toLowerCase();
    const quantity = item.quantity;
    
    // ₦1,000 per 2kg Black Soap or 1,000ml Kernel Oil
    if (itemName.includes('black soap')) {
      // Extract weight from size string (e.g., "2kg" -> 2)
      const weight = parseFloat(item.size);
      if (!isNaN(weight)) {
        commission += (weight / 2) * 1000 * quantity;
      }
    } else if (itemName.includes('kernel oil')) {
      // Extract volume from size string (e.g., "1000ml" -> 1000)
      const volume = parseFloat(item.size);
      if (!isNaN(volume)) {
        commission += (volume / 1000) * 1000 * quantity;
      }
    }
  }
  
  return commission;
}
