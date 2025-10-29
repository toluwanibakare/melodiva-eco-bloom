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

  const handlePayment = async () => {
    if (!deliveryAddress || !deliveryState || !deliveryCity || !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all delivery details",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      const subtotal = getTotal();
      const discountAmount = affiliateDiscount;
      const deliveryFee = 1500;
      const total = subtotal - discountAmount + deliveryFee;

      // Get affiliate ID if code is used
      let affiliateId = null;
      if (affiliateCode) {
        const { data: affiliate } = await supabase
          .from('affiliates')
          .select('id')
          .eq('affiliate_code', affiliateCode)
          .single();
        
        if (affiliate) affiliateId = affiliate.id;
      }

      // Initialize Paystack payment
      const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxx';
      
      // @ts-ignore
      const handler = PaystackPop.setup({
        key: paystackPublicKey,
        email: user.email,
        amount: total * 100, // Paystack expects amount in kobo
        currency: 'NGN',
        ref: `${Date.now()}-${user.id}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: profile?.full_name || user.email
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: phoneNumber
            }
          ]
        },
        callback: async function(response: any) {
          // Verify payment on backend
          const { data, error } = await supabase.functions.invoke('verify-payment', {
            body: {
              reference: response.reference,
              orderData: {
                user_id: user.id,
                items: JSON.stringify(items),
                subtotal,
                discount: discountAmount,
                delivery_fee: deliveryFee,
                total,
                affiliate_code: affiliateCode || null,
                affiliate_id: affiliateId,
                delivery_address: deliveryAddress,
                delivery_state: deliveryState,
                delivery_city: deliveryCity,
                phone_number: phoneNumber,
                whatsapp_number: whatsappNumber,
              }
            }
          });

          if (error) {
            toast({
              title: "Payment Error",
              description: "Failed to verify payment. Please contact support.",
              variant: "destructive"
            });
            return;
          }

          // Clear cart and redirect
          clearCart();
          toast({
            title: "Payment Successful!",
            description: "Your order has been placed successfully."
          });
          navigate('/order-history');
        },
        onClose: function() {
          setProcessing(false);
          toast({
            title: "Payment Cancelled",
            description: "You cancelled the payment."
          });
        }
      });

      handler.openIframe();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to initialize payment",
        variant: "destructive"
      });
      setProcessing(false);
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
  const discountAmount = affiliateDiscount;
  const deliveryFee = 1500;
  const total = subtotal - discountAmount + deliveryFee;

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
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount (5%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
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
              disabled={processing || items.length === 0}
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
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
