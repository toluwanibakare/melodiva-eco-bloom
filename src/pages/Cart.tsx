import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, ShoppingBag, Tag } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal, affiliateCode, affiliateDiscount, setAffiliateCode, setAffiliateDiscount } = useCartStore();
  const { toast } = useToast();
  const [codeInput, setCodeInput] = useState('');
  const [applyingCode, setApplyingCode] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const applyAffiliateCode = async () => {
    if (!codeInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter an affiliate code",
        variant: "destructive"
      });
      return;
    }

    setApplyingCode(true);
    try {
      const { data: affiliate, error } = await supabase
        .from('affiliates')
        .select('id, affiliate_code')
        .eq('affiliate_code', codeInput.trim().toUpperCase())
        .single();

      if (error || !affiliate) {
        toast({
          title: "Invalid Code",
          description: "The affiliate code you entered is not valid",
          variant: "destructive"
        });
        return;
      }

      const subtotal = getTotal();
      const discount = subtotal * 0.05; // 5% discount
      
      setAffiliateCode(codeInput.trim().toUpperCase());
      setAffiliateDiscount(discount);
      
      toast({
        title: "Code Applied!",
        description: `You've saved ${formatPrice(discount)} with this code!`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to apply code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setApplyingCode(false);
    }
  };

  const removeAffiliateCode = () => {
    setAffiliateCode('');
    setAffiliateDiscount(0);
    setCodeInput('');
    toast({
      title: "Code Removed",
      description: "Affiliate code has been removed from your order",
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Add some natural goodness to your cart!</p>
        <Button asChild size="lg">
          <Link to="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const subtotal = getTotal();
  const discountAmount = affiliateDiscount;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const deliveryFee = 1500; // Default to non-Lagos, will be calculated properly later
  const total = subtotalAfterDiscount + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={`${item.productId}-${item.variant}-${item.size}`} className="p-4">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  {item.variant && (
                    <p className="text-sm text-muted-foreground capitalize">{item.variant}</p>
                  )}
                  <p className="text-sm text-muted-foreground">{item.size}</p>
                  <p className="font-bold text-primary mt-2">{formatPrice(item.price)}</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.productId, item.variant, item.size)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          Math.max(1, item.quantity - 1),
                          item.variant,
                          item.size
                        )
                      }
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.quantity + 1,
                          item.variant,
                          item.size
                        )
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div>
          <Card className="p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            {/* Affiliate Code Section */}
            <div className="mb-6 pb-6 border-b">
              <Label className="mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Have an Affiliate Code?
              </Label>
              {!affiliateCode ? (
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Enter code"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    className="uppercase"
                  />
                  <Button onClick={applyAffiliateCode} disabled={applyingCode}>
                    {applyingCode ? "..." : "Apply"}
                  </Button>
                </div>
              ) : (
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-mono font-semibold text-green-700 dark:text-green-400">{affiliateCode}</p>
                    <p className="text-sm text-green-600 dark:text-green-500">5% discount applied</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeAffiliateCode}>
                    Remove
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Affiliate Discount (5%)</span>
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
            <Button className="w-full" size="lg" asChild>
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button variant="outline" className="w-full mt-3" asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
