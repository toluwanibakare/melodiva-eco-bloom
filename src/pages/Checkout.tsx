import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Declare Paystack types for TypeScript
declare global {
  interface Window {
    PaystackPop: {
      setup(options: PaystackOptions): { openIframe(): void };
    };
  }
}

interface PaystackOptions {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  metadata?: {
    custom_fields: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
  };
  callback?: (response: PaystackResponse) => void;
  onClose?: () => void;
}

interface PaystackResponse {
  reference: string;
  status: string;
  transaction: string;
  message?: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, getTotal, affiliateCode, affiliateDiscount, clearCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryState, setDeliveryState] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  useEffect(() => {
    // Load Paystack script
    const loadPaystackScript = () => {
      if (window.PaystackPop) {
        setPaystackLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => {
        setPaystackLoaded(true);
        console.log('Paystack script loaded successfully');
      };
      script.onerror = () => {
        console.error('Failed to load Paystack script');
        toast({
          title: "Error",
          description: "Failed to load payment service. Please refresh the page.",
          variant: "destructive",
        });
      };
      document.head.appendChild(script);
    };

    loadPaystackScript();
  }, [toast]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      
      setUser(session.user);

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setDeliveryAddress(profileData.address || '');
        setDeliveryState(profileData.state || '');
        setDeliveryCity(profileData.city || '');
        setPhoneNumber(profileData.phone_number || '');
        setWhatsappNumber(profileData.whatsapp_number || '');
      }

      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Generate a unique order number
  const generateOrderNumber = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `MEL-${timestamp}-${random}`;
  };

  const handlePayment = async () => {
    // Validate required fields
    if (!deliveryAddress.trim() || !deliveryState.trim() || !deliveryCity.trim() || !phoneNumber.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required delivery information",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);

    const subtotal = getTotal();
    const discount = affiliateDiscount;
    const deliveryFee = 1500;
    const total = subtotal - discount + deliveryFee;
    const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    if (!paystackKey) {
      toast({
        title: "Error",
        description: "Paystack public key not found in .env",
        variant: "destructive",
      });
      setProcessing(false);
      return;
    }

    if (!paystackLoaded || !window.PaystackPop) {
      toast({
        title: "Error",
        description: "Payment service is still loading. Please try again.",
        variant: "destructive",
      });
      setProcessing(false);
      return;
    }

    try {
      const reference = `PSK_${user.id}_${Date.now()}`;

      const handler = window.PaystackPop.setup({
        key: paystackKey,
        email: user.email,
        amount: Math.round(total * 100), // Convert to kobo
        currency: "NGN",
        ref: reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: profile?.full_name || user.email,
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: phoneNumber,
            },
            {
              display_name: "Referral Code",
              variable_name: "referral_code",
              value: affiliateCode || 'none',
            },
          ],
        },
        callback: (response: PaystackResponse) => {
          console.log("Paystack callback received:", response);
          handlePaymentSuccess(response, {
            subtotal,
            discount,
            deliveryFee,
            total,
            reference,
          });
        },
        onClose: () => {
          console.log("Paystack payment modal closed");
          setProcessing(false);
          toast({
            title: "Payment Cancelled",
            description: "You closed the payment window.",
          });
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Error setting up Paystack:", error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

  const handlePaymentSuccess = async (response: PaystackResponse, paymentDetails: any) => {
    let orderNumber = '';
    let orderId = '';

    try {
      console.log("Processing successful payment:", response);

      // Verify the payment was successful
      if (response.status !== 'success') {
        throw new Error(`Payment failed with status: ${response.status}`);
      }

      // Generate order number
      orderNumber = generateOrderNumber();

      // Prepare items for database - ensure it's properly formatted
      const orderItems = items.map(item => ({
        product_id: item.productId,
        name: item.name,
        variant: item.variant,
        size: item.size,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      }));

      // Log referral information for debugging
      console.log("Referral info:", {
        affiliateCode,
        affiliateDiscount: paymentDetails.discount,
        subtotal: paymentDetails.subtotal
      });

      // First, create the order
      const { data: orderData, error: orderError } = await supabase.from("orders").insert({
        user_id: user.id,
        order_number: orderNumber,
        items: orderItems,
        subtotal: paymentDetails.subtotal,
        discount: paymentDetails.discount,
        delivery_fee: paymentDetails.deliveryFee,
        total: paymentDetails.total,
        affiliate_code: affiliateCode || null,
        discount: paymentDetails.discount,
        subtotal: paymentDetails.subtotal + paymentDetails.discount,
        delivery_address: deliveryAddress,
        delivery_state: deliveryState,
        delivery_city: deliveryCity,
        phone_number: phoneNumber,
        whatsapp_number: whatsappNumber,
        payment_reference: response.reference,
        payment_status: "paid",
        status: "pending",
      }).select('id, order_number').single();

      if (orderError) {
        console.error("Order save error:", orderError);
        throw orderError;
      }

      orderId = orderData.id;
      console.log("Order saved successfully:", orderData);

      // If there's a valid referral code, find the affiliate and create referral record
      if (affiliateCode && paymentDetails.discount > 0) {
        await handleAffiliateReferral(affiliateCode, orderData.order_number, orderData.id, paymentDetails.discount);
      }

      // Clear cart after successful order
      clearCart();
      
      toast({
        title: "Success!",
        description: `Your order #${orderNumber} was placed successfully. ${affiliateCode ? `Referral discount applied: ${formatPrice(paymentDetails.discount)}` : ''}`,
      });
      
      navigate("/order-success");
      
    } catch (error: any) {
      console.error("Error processing payment success:", error);
      
      let errorMessage = "Payment succeeded but we encountered an issue saving your order. Please contact support.";
      
      if (error.message) {
        errorMessage = `Database error: ${error.message}`;
      }
      
      toast({
        title: "Order Processing Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleAffiliateReferral = async (referralCode: string, orderNumber: string, orderId: string, discount: number) => {
    try {
      console.log("Processing affiliate referral:", { referralCode, orderNumber, orderId, discount });

      // First, find the affiliate by their referral code
      const { data: affiliateData, error: affiliateError } = await supabase
        .from('affiliates')
        .select('id, user_id, commission_rate')
        .eq('referral_code', referralCode)
        .single();

      if (affiliateError || !affiliateData) {
        console.error("Affiliate not found for code:", referralCode, affiliateError);
        return;
      }

      console.log("Found affiliate:", affiliateData);

      // Calculate commission (you can adjust this logic based on your business rules)
      // For example: 10% of the discount amount or a fixed percentage of the order total
      const commissionAmount = calculateCommission(discount, affiliateData.commission_rate);

      // Create the affiliate referral record
      const { data: referralData, error: referralError } = await supabase
        .from("affiliate_referrals")
        .insert({
          affiliate_id: affiliateData.id,
          referred_user_id: user.id,
          order_id: orderNumber, // Using order_number as order_id since your table expects TEXT
          commission_amount: commissionAmount,
          status: 'completed', // or 'pending' depending on when you pay out commissions
        })
        .select();

      if (referralError) {
        console.error("Affiliate referral tracking error:", referralError);
        // Don't throw error here - we don't want referral tracking failure to block the order
      } else {
        console.log("Affiliate referral tracked successfully:", referralData);
        
        // Update affiliate's stats (total commissions, etc.)
        await updateAffiliateStats(affiliateData.id, commissionAmount);
      }

    } catch (error) {
      console.error("Error in affiliate referral tracking:", error);
    }
  };

  const calculateCommission = (discount: number, commissionRate: number | null) => {
    // Default commission rate if not specified
    const rate = commissionRate || 10; // 10% default
    
    // Calculate commission based on your business logic
    // Example: 10% of the discount amount given to customer
    return (discount * rate) / 100;
  };

  const updateAffiliateStats = async (affiliateId: string, commissionAmount: number) => {
  try {
    // Step 1: Fetch current stats
    const { data: current, error: fetchError } = await supabase
      .from('affiliates')
      .select('total_commissions, total_referrals, balance')
      .eq('id', affiliateId)
      .single();

    if (fetchError) {
      console.error("Error fetching affiliate stats:", fetchError);
      return;
    }

    // Step 2: Calculate new totals
    const newTotalCommissions = (current?.total_commissions || 0) + commissionAmount;
    const newTotalReferrals = (current?.total_referrals || 0) + 1;
    const newBalance = (current?.balance || 0) + commissionAmount;

    // Step 3: Update affiliate record
    const { error: updateError } = await supabase
      .from('affiliates')
      .update({
        total_commissions: newTotalCommissions,
        total_referrals: newTotalReferrals,
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', affiliateId);

    if (updateError) {
      console.error("Failed to update affiliate stats:", updateError);
    } else {
      console.log("Affiliate stats updated successfully");
    }
  } catch (error) {
    console.error("Error updating affiliate stats:", error);
  }
};


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const subtotal = getTotal();
  const discount = affiliateDiscount;
  const deliveryFee = 1500;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Delivery Information Form */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Input
                  id="address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={deliveryState}
                    onChange={(e) => setDeliveryState(e.target.value)}
                    placeholder="State"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="080xxxxxxxx"
                  required
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="080xxxxxxxx"
                />
              </div>
              
              {/* Display Referral Information */}
              {affiliateCode && (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-700 dark:text-green-300">
                        Referral Discount Applied!
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Code: {affiliateCode} • Discount: {formatPrice(discount)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Order Items */}
          <Card className="p-6 mt-6">
            <h2 className="text-2xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variant}-${item.size}`} className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground capitalize">{item.variant}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{item.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.price)}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount (5%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handlePayment}
              disabled={processing || items.length === 0 || !paystackLoaded}
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : !paystackLoaded ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Loading Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay with Paystack
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Secure payment powered by Paystack
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;