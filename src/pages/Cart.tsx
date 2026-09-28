import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, ShoppingBag, Tag, Truck } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

const Cart = () => {
  const {
    items,
    removeItem,
    updateQuantity,
    getTotal,
    affiliateCode,
    affiliateDiscount,
    setAffiliateCode,
    setAffiliateDiscount,
    setAppliedCoupon
  } = useCartStore();

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
        description: "Please enter a promo or coupon code",
        variant: "destructive"
      });
      return;
    }

    setApplyingCode(true);

    try {
      const data = await api.verifyAffiliateCode(codeInput.trim().toUpperCase());

      if (!data.valid) {
        toast({
          title: "Invalid Code",
          description: "The code you entered is not valid or active",
          variant: "destructive"
        });
        return;
      }

      const subtotal = getTotal();

      // Check min order spend requirement if any
      if (data.min_order_amount && subtotal < data.min_order_amount) {
        toast({
          title: "Minimum Order Required",
          description: `This code requires a minimum order subtotal of ${formatPrice(data.min_order_amount)}. Add ${formatPrice(data.min_order_amount - subtotal)} more to qualify!`,
          variant: "destructive"
        });
        return;
      }

      let discount = 0;
      let message = "";

      if (data.type === 'coupon') {
        const dType = data.discount_type || 'fixed';
        if (dType === 'free_delivery') {
          discount = 0; // Free delivery discount applied directly on shipping fee at checkout
          message = `🚀 Free Delivery Coupon Applied! Delivery fee will be ₦0 at checkout (Orders over ${formatPrice(data.min_order_amount || 0)}).`;
        } else if (dType === 'percentage') {
          discount = (subtotal * (data.value / 100));
          message = `Coupon applied! ${data.value}% discount saved ${formatPrice(discount)}.`;
        } else {
          discount = data.value;
          message = `Coupon applied! You saved ${formatPrice(discount)}.`;
        }
      } else {
        // Affiliate code gives 5% discount
        discount = subtotal * 0.05;
        message = `Affiliate discount applied! You saved ${formatPrice(discount)}.`;
      }

      setAffiliateCode(codeInput.trim().toUpperCase());
      setAffiliateDiscount(discount);
      setAppliedCoupon({
        code: data.code,
        type: data.type,
        discount_type: data.discount_type,
        amount: data.value,
        min_order_amount: data.min_order_amount,
        expiry_date: data.expiry_date
      });

      toast({
        title: "Code Applied!",
        description: message,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to apply code. Please try again.",
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
  const deliveryFee = 1500;
  const total = subtotalAfterDiscount + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card
              key={`${item.productId}-${item.variant}-${item.size}`}
              className="p-4"
            >
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  {item.variant && (
                    <p className="text-sm text-muted-foreground capitalize">
                      {item.variant}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">{item.size}</p>
                  <p className="font-bold text-primary mt-2">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeItem(item.productId, item.variant, item.size)
                    }
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
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
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
                    onChange={(e) =>
                      setCodeInput(e.target.value.toUpperCase())
                    }
                    className="uppercase"
                  />
                  <Button onClick={applyAffiliateCode} disabled={applyingCode}>
                    {applyingCode ? "..." : "Apply"}
                  </Button>
                </div>
              ) : (
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-mono font-semibold text-green-700 dark:text-green-400">
                      {affiliateCode}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      5% discount applied
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeAffiliateCode}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Affiliate Discount (5%)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Estimated Delivery</span>
                <span>Selected at checkout</span>
              </div>

              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Subtotal (excl. delivery)</span>
                <span className="text-primary">
                  {formatPrice(subtotalAfterDiscount)}
                </span>
              </div>
            </div>

            {/* Delivery Rates Info Card */}
            <div className="p-4 mb-6 rounded-lg bg-secondary/30 border border-border space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                <Truck className="h-4 w-4 text-primary shrink-0" />
                <span>Delivery Rates & Carriers</span>
              </div>
              <ul className="space-y-2 text-muted-foreground pt-1">
                <li className="border-b border-border/50 pb-1.5">
                  <span className="font-medium text-foreground block">Lagos Doorstep Delivery:</span>
                  <span className="text-primary font-semibold">₦2,000 – ₦3,000</span> • Registered dispatch riders
                </li>
                <li className="border-b border-border/50 pb-1.5">
                  <span className="font-medium text-foreground block">Interstate (Hub to Hub):</span>
                  <span className="text-primary font-semibold">₦4,000 – ₦6,000</span> • Waybill with Interstate transporter
                </li>
                <li>
                  <span className="font-medium text-foreground block">Interstate + Doorstep:</span>
                  <span className="text-primary font-semibold">₦5,500 – ₦8,000</span> • Waybill + local dispatch rider
                </li>
              </ul>
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
