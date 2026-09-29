import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import heroImg from '@/assets/hero-bg.jpg';
import { Leaf, Star, Heart, Award, Truck, Gift, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Clock, Copy, Sparkles } from 'lucide-react';
import melodivaLogo from "@/assets/logo-bold.jpg";
import { useEffect, useState, useRef } from 'react';
import { api, auth } from '@/lib/api';
import FAQSection from '@/components/FAQSection';

const Home = () => {
  const [isAffiliate, setIsAffiliate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('OCTOBERFREE');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data: { session } } = await auth.getSession();
        if (session) {
          const { isAffiliate } = await api.checkAffiliate();
          setIsAffiliate(isAffiliate);
        }
      } catch (error) {
        // Ignore auth errors
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[680px] md:h-[760px] flex items-center justify-center overflow-hidden natural-glow-bg">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${heroImg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-emerald-950/80 to-black/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)] pointer-events-none" />
        </div>

        {/* Ambient Floating Decorative Glow Orbs */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 container mx-auto px-4 md:px-8 text-center text-white max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-emerald-400/30 text-xs md:text-sm font-extrabold tracking-wide shadow-lg">
            <Leaf className="h-4 w-4 text-emerald-400" />
            <span>100% Natural Nigerian Skincare</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight animate-fade-in-up">
            Nurture Your Skin with <span className="gradient-text">Pure Nature</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-white/90 leading-relaxed font-medium animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            Discover gentle African black soaps and 100% pure natural kernel oil, lovingly created to restore your skin’s natural, healthy glow.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-3 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Button asChild size="lg" className="btn-primary text-base px-9 py-6 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
              <Link to="/shop">
                <span>Explore Catalog</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {isAffiliate ? (
              <Button asChild size="lg" variant="outline" className="text-base px-8 py-6 rounded-2xl bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300 font-bold">
                <Link to="/affiliate-dashboard">View Dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="outline" className="text-base px-8 py-6 rounded-2xl bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-300 font-bold">
                <Link to="/affiliate">Affiliate Program</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Natural Skin & Botanical Showcase */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1600px]">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-widest font-extrabold text-primary px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 inline-flex items-center gap-1.5 shadow-xs">
              <Leaf className="w-3.5 h-3.5 text-primary" />
              <span>Our Natural Philosophy</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              The Grace of <span className="gradient-text">Pure Nature</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              We select raw organic ingredients from native soils to gently nourish your skin and honor its natural balance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Radiant Skin */}
            <div className="group rounded-3xl overflow-hidden bg-card border border-emerald-500/15 shadow-sm hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-500 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/glowing-skin-nature.jpg"
                  alt="Radiant Skin Nature"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    For All Skin Types & Tones
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    Gentle, deeply nourishing formulas that restore balance, soothe irritation, and promote soft, healthy glowing skin every day.
                  </p>
                </div>
                <div className="pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-bold text-primary">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Dermatology Tested & Safe</span>
                </div>
              </div>
            </div>

            {/* Card 2: Botanical Ingredients */}
            <div className="group rounded-3xl overflow-hidden bg-card border border-emerald-500/15 shadow-sm hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-500 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/botanical-herbs.jpg"
                  alt="Botanical Ingredients"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    100% Pure & Handcrafted
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    Wild-harvested palm kernels, unrefined cocoa pod ash, and organic herbal infusions—zero artificial chemicals or synthetic sulfates.
                  </p>
                </div>
                <div className="pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-bold text-primary">
                  <Leaf className="w-4 h-4" />
                  <span>100% Zero Harsh Additives</span>
                </div>
              </div>
            </div>

            {/* Card 3: Sustainable Eco Nature */}
            <div className="group rounded-3xl overflow-hidden bg-card border border-emerald-500/15 shadow-sm hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-500 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="/nature-leaf-texture.jpg"
                  alt="Nature Leaf Texture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Sourced from Nigerian Farms
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    Ethically sourced in partnership with local agricultural communities, supporting sustainable farming and authentic eco-friendly practices.
                  </p>
                </div>
                <div className="pt-4 border-t border-border/60 flex items-center gap-2 text-xs font-bold text-primary">
                  <Award className="w-4 h-4" />
                  <span>Registered Organic Brand</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Melodiva */}
      <section className="py-20 bg-secondary/30 border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 max-w-[1600px] mx-auto">
            {/* Text Section */}
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest font-extrabold text-primary px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 inline-flex items-center gap-1.5 shadow-xs">
                <Heart className="w-3.5 h-3.5 text-primary" />
                <span>About Our Journey</span>
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                Crafted With <span className="gradient-text">Love & Care</span>
              </h2>
              <p className="text-base text-foreground/80 leading-relaxed">
                Founded in Nigeria in late 2023, Melodiva Skin Care was born out of a deep affection for pure, botanical beauty.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We blend native plant extracts into gentle soaps and oils that pamper and protect your skin every single day—enhancing your natural glow with zero harshness.
              </p>
              <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed font-bold">
                Thoughtfully created for every skin tone, age, and gentle routine.
              </p>

              {/* Feature Icons */}
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-5 rounded-2xl bg-card border border-border/60 text-center hover:border-primary/40 transition-all shadow-sm">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h6 className="font-bold text-foreground text-sm">Premium Quality</h6>
                  <small className="text-muted-foreground text-xs">Handcrafted with care</small>
                </div>
                <div className="p-5 rounded-2xl bg-card border border-border/60 text-center hover:border-primary/40 transition-all shadow-sm">
                  <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h6 className="font-bold text-foreground text-sm">Customer Love</h6>
                  <small className="text-muted-foreground text-xs">Trusted nationwide</small>
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div className="text-center">
              <div className="relative inline-block group">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl filter blur-2xl transform scale-95 group-hover:scale-100 transition-transform duration-700" />
                <img
                  src={melodivaLogo}
                  alt="About Melodiva"
                  className="relative rounded-3xl shadow-2xl mx-auto object-cover max-h-[440px] transition-transform duration-700 group-hover:scale-[1.02] border border-border/80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30 border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1600px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto">
            <div className="text-center p-6 rounded-2xl bg-card border border-border/60 shadow-sm hover:border-primary/40 transition-all">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Leaf className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">100% Natural</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Made from plant-based botanical ingredients with zero harsh chemicals.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card border border-border/60 shadow-sm hover:border-primary/40 transition-all">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Star className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Artisanal Quality</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Traditional artisanal formulation methods for maximum skin nourishment.
              </p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card border border-border/60 shadow-sm hover:border-primary/40 transition-all">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Skin Loving</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Protects skin moisture barriers and restores natural radiance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Horizontal Scrollable Shop Items */}
      <section className="py-20 bg-background overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1600px]">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-xs uppercase tracking-widest font-extrabold text-primary px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 inline-flex items-center gap-1.5 shadow-xs">
              <Gift className="w-3.5 h-3.5 text-primary" />
              <span>Organic Collection</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              Made for Your <span className="gradient-text">Daily Ritual</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Explore our gentle handcrafted black soaps and 100% pure natural kernel oils created to cherish your skin.
            </p>
            {/* Scroll Navigation Arrow Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollLeft}
                className="rounded-full h-10 w-10 border-primary/30 bg-card hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollRight}
                className="rounded-full h-10 w-10 border-primary/30 bg-card hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Horizontal Scroll Track Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth overflow-y-hidden no-scrollbar"
          >
            {products
              .filter((p) => p.id !== 'black-soap' && p.id !== 'kernel-oil')
              .map((product) => (
                <div key={product.id} className="snap-start shrink-0 w-[280px] sm:w-[320px] md:w-[340px]">
                  <ProductCard product={product} />
                </div>
              ))}
          </div>

          {/* Call to Action to view full shop */}
          <div className="text-center mt-8">
            <Button asChild size="lg" className="btn-primary rounded-xl px-8 py-6 font-bold shadow-lg text-sm hover:scale-105 transition-all">
              <Link to="/shop">
                <span>View Full Shop Catalog ({products.length})</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary/20 border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1600px]">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs uppercase tracking-widest font-extrabold text-primary px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 inline-flex items-center gap-1.5 shadow-xs">
              <Star className="w-3.5 h-3.5 text-primary" />
              <span>Customer Reviews & Love</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              Loved & Reviewed by <span className="gradient-text">Our Community</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Read real, heartfelt reviews from customers across Nigeria and internationally who cherish Melodiva.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mx-auto">
            {[
              {
                name: "Adaeze O.",
                initials: "AO",
                location: "Lagos, Nigeria",
                rating: 5,
                comment: "Melodiva's black soap has really transformed my skin! I've been using the Exquisite variant for a month and my skin has never felt smoother."
              },
              {
                name: "Chidinma E.",
                initials: "CE",
                location: "Abuja, Nigeria",
                rating: 5,
                comment: "The kernel oil is pure magic! My hair and skin have never been healthier. It's now a permanent staple in my beauty routine."
              },
              {
                name: "Funmi A.",
                initials: "FA",
                location: "Ibadan, Nigeria",
                rating: 4,
                comment: "Natural products that actually work! The perfume black soap smells amazing and leaves my skin glowing all day."
              },
              {
                name: "Blessing K.",
                initials: "BK",
                location: "Port Harcourt, Nigeria",
                rating: 5,
                comment: "Fast delivery to Rivers State! The raw black soap tub is huge and lasts so long. Very gentle on sensitive skin."
              },
              {
                name: "Jimi",
                initials: "J",
                location: "USA",
                rating: 5,
                comment: "Awesome product! I have been using it regularly. Today, my son forgot to use deodorant to school and I just had him spray a female body spray that I had in the vehicle. Usually after PE, he stinks but today he did not smell at all."
              }
            ].map((review, idx) => (
              <div key={idx} className="bg-card p-5 rounded-2xl shadow-sm hover:shadow-md border border-border/60 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex text-amber-400 dark:text-amber-300 mb-3 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'fill-current' : 'text-muted/40 fill-none'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 italic leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs shrink-0">
                    {review.initials}
                  </div>
                  <div>
                    <p className="font-bold text-xs text-foreground leading-snug">{review.name}</p>
                    <p className="text-[10px] text-muted-foreground">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="rounded-xl px-6 font-semibold hover:border-primary/50">
              <Link to="/contact#review-section">Submit a Review</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - REPLACED EMOJIS WITH LUCIDE ICONS */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-12 max-w-[1600px]">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs uppercase tracking-widest font-extrabold text-primary px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 inline-flex items-center gap-1.5 shadow-xs">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span>Why Melodiva</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
              Thoughtful Care in <span className="gradient-text">Every Batch</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Our quiet commitment to pure ingredients, gentle formulations, and warm customer care across Nigeria.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-primary/10 shadow-sm hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Naturally Sourced</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All ingredients sourced directly from local Nigerian farmers, supporting sustainable communities.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-primary/10 shadow-sm hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Fast Delivery</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Lagos doorstep dispatch & nationwide interstate waybill delivery (Hub-to-Hub or Doorstep).
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-primary/10 shadow-sm hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Made with Love in Nigeria</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Locally made. Naturally pure. Thoughtfully created for every skin type and age.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-primary/10 shadow-sm hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">Exclusive Rewards</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Join our affiliate program and earn commissions when friends buy using your unique referral code.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section Integrated on Home Page */}
      <FAQSection className="bg-secondary/10 rounded-3xl my-10 border border-border/40" />

      {/* CTA Section - Affiliate Waitlist Launch */}
      <section className="py-20 bg-gradient-to-r from-emerald-950 via-emerald-900 to-green-950 text-white rounded-3xl mx-4 md:mx-10 my-16 shadow-2xl relative overflow-hidden border border-emerald-500/30">
        {/* Ambient Glowing Background Orbs */}
        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full bg-green-400/20 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/20 backdrop-blur-md border border-emerald-400/40 text-xs font-extrabold text-emerald-200 uppercase tracking-widest shadow-sm">
            <Clock className="h-3.5 w-3.5 text-emerald-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>LAUNCHING SOON • JOIN THE VIP WAITLIST</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Become a Melodiva <span className="text-emerald-300 drop-shadow-md">Brand Affiliate</span>
          </h2>

          <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto leading-relaxed font-normal">
            Earn up to 10% commission per referral on 100% natural, unrefined skincare. Give your followers an instant 5% discount while earning extra income!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 py-1 text-xs font-bold text-emerald-100">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
              ₦1,000 Payout per 2kg Tub
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
              5% Instant Buyer Discount
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
              Instant Nigerian Bank Payouts
            </span>
          </div>

          <div className="pt-3">
            <Button asChild size="lg" className="bg-white text-emerald-950 hover:bg-emerald-50 rounded-2xl font-extrabold px-10 py-6 text-base shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/40">
              <Link to="/affiliate">
                <span>Join Affiliate Waitlist</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
