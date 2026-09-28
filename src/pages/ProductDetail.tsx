import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Minus, Plus, ArrowLeft, ShieldCheck, Truck, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { SoapVariant } from '@/types/product';
import { Badge } from '@/components/ui/badge';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const product = products.find(p => p.id === id);

  const initialVariant = product?.variants?.[0]?.variant;
  const initialSize = product?.type === 'black-soap'
    ? (product?.variants?.[0]?.sizes?.[0]?.size || '')
    : (product?.sizes?.[0]?.size || '');

  const [selectedVariant, setSelectedVariant] = useState<SoapVariant | undefined>(initialVariant);
  const [selectedSize, setSelectedSize] = useState<string>(initialSize);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      const v = product.variants?.[0]?.variant;
      const s = product.type === 'black-soap'
        ? (product.variants?.[0]?.sizes?.[0]?.size || '')
        : (product.sizes?.[0]?.size || '');

      setSelectedVariant(v);
      setSelectedSize(s);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <h1 className="text-2xl font-bold mb-3">Product not found</h1>
        <p className="text-sm text-muted-foreground mb-6">The item you are looking for does not exist or has been moved.</p>
        <Button onClick={() => navigate('/shop')} className="btn-primary rounded-xl">Back to Catalog</Button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCurrentPrice = () => {
    if (product.type === 'black-soap' && selectedVariant && selectedSize) {
      const variant = product.variants?.find(v => v.variant === selectedVariant);
      const size = variant?.sizes.find(s => s.size === selectedSize);
      return size?.price || 0;
    } else if (product.type === 'kernel-oil' && selectedSize) {
      const size = product.sizes?.find(s => s.size === selectedSize);
      return size?.price || 0;
    }
    return 0;
  };

  const handleAddToCart = () => {
    const price = getCurrentPrice();
    if (!price || !selectedSize) {
      toast.error('Please select size and variant options first');
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      type: product.type,
      variant: selectedVariant,
      size: selectedSize,
      price,
      quantity,
      image: product.image,
    });

    toast.success(`${product.name} (${selectedSize}) added to your cart!`);
  };

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:bg-primary hover:text-white dark:hover:text-white transition-all rounded-full px-4 py-2 font-semibold shadow-xs"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Products</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Product Image Section */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-3xl bg-secondary/30 border border-border shadow-md relative group">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-semibold px-3 py-1 rounded-full text-xs">
                100% Organic
              </Badge>
            </div>

            {/* Delivery Perks Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-card border border-border/70 flex items-center gap-3 text-xs">
                <Truck className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <span className="font-bold text-foreground block">Fast Shipping</span>
                  <span className="text-muted-foreground text-[11px]">Lagos & Nationwide</span>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-card border border-border/70 flex items-center gap-3 text-xs">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-foreground block">Authentic Formula</span>
                  <span className="text-muted-foreground text-[11px]">Handcrafted Plants</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Options & Details Section */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">
                Melodiva Organic Skincare
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-3">
                {product.name}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Card className="p-6 bg-card border border-primary/10 shadow-sm rounded-3xl space-y-6">
              {/* Black Soap Variant Selector */}
              {product.type === 'black-soap' && (
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                    1. Select Soap Variant
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {product.variants?.map((v) => {
                      const isSelected = selectedVariant === v.variant;
                      return (
                        <button
                          key={v.variant}
                          type="button"
                          onClick={() => {
                            setSelectedVariant(v.variant);
                            setSelectedSize(v.sizes?.[0]?.size || '');
                          }}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary shadow-sm scale-102'
                              : 'border-border bg-secondary/30 text-foreground hover:border-primary/40'
                          }`}
                        >
                          {v.variant}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                  {product.type === 'black-soap' ? '2. Select Package Size' : '1. Select Container Size'}
                </Label>
                <div className="space-y-2">
                  {product.type === 'black-soap' && selectedVariant
                    ? product.variants?.find(v => v.variant === selectedVariant)?.sizes.map((size) => {
                        const isSelected = selectedSize === size.size;
                        return (
                          <div
                            key={size.size}
                            onClick={() => setSelectedSize(size.size)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'border-primary bg-primary/10 shadow-sm'
                                : 'border-border bg-card hover:border-primary/40'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground/40'}`} />
                              <span className="font-semibold text-sm">{size.size}</span>
                            </div>
                            <span className="font-bold text-sm text-primary">{formatPrice(size.price)}</span>
                          </div>
                        );
                      })
                    : product.sizes?.map((size) => {
                        const isSelected = selectedSize === size.size;
                        return (
                          <div
                            key={size.size}
                            onClick={() => setSelectedSize(size.size)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'border-primary bg-primary/10 shadow-sm'
                                : 'border-border bg-card hover:border-primary/40'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground/40'}`} />
                              <span className="font-semibold text-sm">{size.size}</span>
                            </div>
                            <span className="font-bold text-sm text-primary">{formatPrice(size.price)}</span>
                          </div>
                        );
                      })}
                </div>
              </div>

              {/* Quantity Picker */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                  Quantity
                </Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-base font-bold w-10 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl h-10 w-10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Calculated Total */}
              {selectedSize && (
                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-medium">Item Total:</span>
                  <span className="text-2xl font-extrabold text-primary">
                    {formatPrice(getCurrentPrice() * quantity)}
                  </span>
                </div>
              )}

              {/* Action Button */}
              <Button
                size="lg"
                className="w-full btn-primary rounded-xl py-6 text-base font-bold shadow-md"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {selectedSize ? 'Add to Cart' : 'Select Size First'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
