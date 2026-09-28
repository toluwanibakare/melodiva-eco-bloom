import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden rounded-2xl border border-primary/10 bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 flex flex-col justify-between h-full">
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-square overflow-hidden bg-muted relative">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2.5 sm:p-4">
            <span className="text-white text-[10px] sm:text-xs font-medium flex items-center gap-1">
              <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" /> View Details
            </span>
          </div>
          {product.category && (
            <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-background/90 backdrop-blur-md text-foreground text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase tracking-wider border border-border shadow-xs">
              {product.category}
            </span>
          )}
        </div>
      </Link>
      <CardContent className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-bold text-xs sm:text-lg mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-2">
            {product.description}
          </p>
        </div>
        <p className="text-xs sm:text-base font-extrabold text-primary">
          From {formatPrice(product.basePrice)}
        </p>
      </CardContent>
      <CardFooter className="p-3 sm:p-5 pt-0">
        <Button asChild className="w-full btn-primary group-hover:shadow-md transition-all duration-300 rounded-xl text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4 font-bold">
          <Link to={`/product/${product.id}`}>
            <ShoppingCart className="mr-1 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span>Add to Cart</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
