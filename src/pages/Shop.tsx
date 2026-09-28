import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, Leaf, SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  const catalogProducts = products.filter((p) => p.id !== 'black-soap' && p.id !== 'kernel-oil');

  const filteredProducts = catalogProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || product.type === selectedType;
    const matchesVariant =
      !selectedVariant ||
      product.variants?.some((v) => v.variant === selectedVariant);

    return matchesSearch && matchesType && matchesVariant;
  });

  const clearFilters = () => {
    setSelectedType(null);
    setSelectedVariant(null);
    setSearchQuery('');
  };

  const activeFiltersCount = [selectedType, selectedVariant].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="bg-secondary/30 border-b border-border/50 py-12 px-4 hero-glow">
        <div className="container mx-auto text-center max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Leaf className="h-3.5 w-3.5" />
            <span>Organic Skincare Catalog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Explore Our <span className="gradient-text">Products</span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
            Discover cold-pressed palm kernel oils and handcrafted African black soap formulations for healthy, radiant skin.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-10 max-w-[1600px]">
        {/* Search & Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search soaps, oils, sizes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-xl bg-card border-border/80 focus:border-primary transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Quick Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Button
                variant={selectedType === null && selectedVariant === null ? 'default' : 'outline'}
                size="sm"
                onClick={clearFilters}
                className="rounded-full text-xs font-semibold"
              >
                All Products ({catalogProducts.length})
              </Button>
              <Button
                variant={selectedType === 'black-soap' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(selectedType === 'black-soap' ? null : 'black-soap')}
                className="rounded-full text-xs font-semibold"
              >
                Black Soaps
              </Button>
              <Button
                variant={selectedType === 'kernel-oil' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType(selectedType === 'kernel-oil' ? null : 'kernel-oil')}
                className="rounded-full text-xs font-semibold"
              >
                Kernel Oils
              </Button>
            </div>
          </div>

          {/* Sub-variant Pills for Black Soap */}
          {selectedType === 'black-soap' && (
            <div className="flex items-center gap-2 pt-2 animate-fade-in text-xs">
              <span className="text-muted-foreground font-medium">Soap Variant:</span>
              {['exquisite', 'perfume', 'natural'].map((variant) => (
                <Badge
                  key={variant}
                  variant={selectedVariant === variant ? 'default' : 'outline'}
                  onClick={() => setSelectedVariant(selectedVariant === variant ? null : variant)}
                  className="cursor-pointer capitalize px-3 py-1 rounded-full text-xs"
                >
                  {variant}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Active Filters Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}</span>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="text-primary hover:underline flex items-center gap-1 font-semibold">
              <X className="h-3.5 w-3.5" /> Clear Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border border-border">
            <SlidersHorizontal className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-lg font-bold text-foreground mb-1">No products match your search</p>
            <p className="text-xs text-muted-foreground mb-4">Try clearing filters or searching for another term.</p>
            <Button onClick={clearFilters} variant="outline" size="sm" className="rounded-xl">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
