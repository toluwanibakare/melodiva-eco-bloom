import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { SoapVariant, SoapSize, OilSize } from '@/types/product';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItem = useCartStore(state => state.addItem);
  const product = products.find(p => p.id === id);

  const [selectedVariant, setSelectedVariant] = useState<SoapVariant | undefined>(
    product?.variants?.[0]?.variant
  );
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => navigate('/shop')}>Back to Shop</Button>
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
      toast.error('Please select all options');
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

    toast.success('Added to cart!');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-lg text-muted-foreground mb-6">
            {product.description}
          </p>

          <Card className="p-6 mb-6">
            {product.type === 'black-soap' && (
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">Select Variant</Label>
                <RadioGroup value={selectedVariant} onValueChange={(value) => {
                  setSelectedVariant(value as SoapVariant);
                  setSelectedSize('');
                }}>
                  {product.variants?.map((variant) => (
                    <div key={variant.variant} className="flex items-center space-x-2">
                      <RadioGroupItem value={variant.variant} id={variant.variant} />
                      <Label htmlFor={variant.variant} className="capitalize cursor-pointer">
                        {variant.variant}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="mb-6">
              <Label className="text-base font-semibold mb-3 block">Select Size</Label>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                {product.type === 'black-soap' && selectedVariant
                  ? product.variants?.find(v => v.variant === selectedVariant)?.sizes.map((size) => (
                      <div key={size.size} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={size.size} id={size.size} />
                          <Label htmlFor={size.size} className="cursor-pointer">
                            {size.size}
                          </Label>
                        </div>
                        <span className="font-semibold">{formatPrice(size.price)}</span>
                      </div>
                    ))
                  : product.sizes?.map((size) => (
                      <div key={size.size} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={size.size} id={size.size} />
                          <Label htmlFor={size.size} className="cursor-pointer">
                            {size.size}
                          </Label>
                        </div>
                        <span className="font-semibold">{formatPrice(size.price)}</span>
                      </div>
                    ))}
              </RadioGroup>
            </div>

            <div className="mb-6">
              <Label className="text-base font-semibold mb-3 block">Quantity</Label>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {selectedSize && (
              <div className="text-3xl font-bold text-primary mb-6">
                Total: {formatPrice(getCurrentPrice() * quantity)}
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={!selectedSize}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
