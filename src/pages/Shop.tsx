import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || product.type === selectedType;
    const matchesVariant = !selectedVariant || 
                          (product.variants?.some(v => v.variant === selectedVariant));
    
    return matchesSearch && matchesType && matchesVariant;
  });

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedVariant(null);
    setSearchQuery('');
  };

  const activeFiltersCount = [selectedType, selectedVariant].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Our Products
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover our range of natural skincare products
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 transition-all duration-300 focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="relative h-12 px-6 hover-scale">
                <Filter className="mr-2 h-5 w-5" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
                <SheetDescription>
                  Refine your product selection
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Product Type Filter */}
                <div>
                  <h3 className="font-semibold mb-3">Product Type</h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedType === 'black-soap' ? 'default' : 'outline'}
                      className="w-full justify-start transition-all duration-300"
                      onClick={() => setSelectedType(selectedType === 'black-soap' ? null : 'black-soap')}
                    >
                      Black Soap
                    </Button>
                    <Button
                      variant={selectedType === 'kernel-oil' ? 'default' : 'outline'}
                      className="w-full justify-start transition-all duration-300"
                      onClick={() => setSelectedType(selectedType === 'kernel-oil' ? null : 'kernel-oil')}
                    >
                      Kernel Oil
                    </Button>
                  </div>
                </div>

                {/* Variant Filter (for Black Soap) */}
                <div>
                  <h3 className="font-semibold mb-3">Black Soap Variants</h3>
                  <div className="space-y-2">
                    {['exquisite', 'perfume', 'natural'].map((variant) => (
                      <Button
                        key={variant}
                        variant={selectedVariant === variant ? 'default' : 'outline'}
                        className="w-full justify-start transition-all duration-300 capitalize"
                        onClick={() => setSelectedVariant(selectedVariant === variant ? null : variant)}
                      >
                        {variant}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {activeFiltersCount > 0 && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={clearFilters}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 animate-fade-in">
            {selectedType && (
              <Badge variant="secondary" className="px-3 py-1 hover-scale cursor-pointer capitalize" onClick={() => setSelectedType(null)}>
                {selectedType.replace('-', ' ')}
                <X className="ml-2 h-3 w-3" />
              </Badge>
            )}
            {selectedVariant && (
              <Badge variant="secondary" className="px-3 py-1 hover-scale cursor-pointer capitalize" onClick={() => setSelectedVariant(null)}>
                {selectedVariant}
                <X className="ml-2 h-3 w-3" />
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 text-sm text-muted-foreground animate-fade-in">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-xl text-muted-foreground mb-4">No products found</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
