import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { products } from '@/data/products';
import heroImg from '@/assets/hero-bg.png';
import { Leaf, Star, Heart, Award } from 'lucide-react';
import melodivaLogo from "@/assets/logo-bold.jpg";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Natural Beauty, Naturally Yours
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90">
            Discover the power of nature with our premium black soap and kernel oil products. Handcrafted with love for your skin's natural glow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/shop">Shop Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20">
              <Link to="/affiliate">Join Affiliate</Link>
            </Button>
          </div>
        </div>
      </section>

            {/* About Melodiva */}
      <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
          {/* Text Section */}
          <div>
            <h2 className="text-3xl font-bold text-primary mb-4">
              About Melodiva Skin Care
            </h2>
            <p className="text-lg text-foreground/80 mb-4">
              Melodiva Skin Care was registered to do business in Nigeria on
              17th November, 2023. Our business is the manufacturing and sales
              of organic cosmetic products.
            </p>
            <p className="text-foreground/70 mb-4">
              We manufacture soaps and oils that take care of the skin, which is
              the largest organ of the human body. We believe that everyone is
              naturally beautiful, hence our soaps and oils are made from
              organic plants that enhance natural beauty.
            </p>
            <p className="text-foreground/70">
              Our products are suitable for people of all ages, races, skin
              types, and colors.
            </p>

            {/* Feature Icons */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center">
                <Award className="h-10 w-10 text-primary mx-auto mb-2 transition-transform transform hover:scale-110" />
                <h6 className="font-semibold text-foreground">Premium Quality</h6>
                <small className="text-muted-foreground">Handcrafted with care</small>
              </div>
              <div className="text-center">
                <Heart className="h-10 w-10 text-primary mx-auto mb-2 transition-transform transform hover:scale-110" />
                <h6 className="font-semibold text-foreground">Customer Love</h6>
                <small className="text-muted-foreground">Trusted by many</small>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="text-center">
            <img
              src={melodivaLogo}
              alt="About Melodiva"
              className="rounded-lg shadow-lg mx-auto object-cover max-h-[400px] transition-transform transform hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Natural</h3>
              <p className="text-muted-foreground">
                All our products are made from natural ingredients with no harmful chemicals.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">
                Crafted using traditional methods for maximum effectiveness
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Skin Loving</h3>
              <p className="text-muted-foreground">
                Nourish and protect your skin with nature's best ingredients
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Products</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the transformative power of our carefully crafted natural skincare products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {products.slice(0, 2).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from people who love our products
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card p-6 rounded-lg shadow-lg hover-scale animate-fade-in border border-primary/10">
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "The black soap has transformed my skin! I've been using the Exquisite variant for a month and my skin has never felt smoother. Highly recommend!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-primary font-bold">A</span>
                </div>
                <div>
                  <p className="font-semibold">Adaeze O.</p>
                  <p className="text-sm text-muted-foreground">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-lg hover-scale animate-fade-in border border-primary/10" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "The kernel oil is pure magic! My hair has never been healthier. It's now a staple in my beauty routine. Worth every naira!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-primary font-bold">C</span>
                </div>
                <div>
                  <p className="font-semibold">Chidinma E.</p>
                  <p className="text-sm text-muted-foreground">Abuja, Nigeria</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-lg hover-scale animate-fade-in border border-primary/10" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center mb-4">
                <div className="flex text-primary">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "Natural products that actually work! The perfume black soap smells amazing and leaves my skin glowing. Customer service is excellent too!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-primary font-bold">F</span>
                </div>
                <div>
                  <p className="font-semibold">Funmi A.</p>
                  <p className="text-sm text-muted-foreground">Ibadan, Nigeria</p>
                </div>
              </div>
            </div>
          </div>
        </div>
          <Button asChild size="lg" className="text-lg px-8 mt-20 flex justify-center items-center ml-20 mr-20" >
            <Link to="/contact">Submit a Review</Link>
          </Button>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 animate-fade-in">Why Choose Melodiva?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-primary/20 hover-scale animate-fade-in">
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="text-xl font-semibold mb-2">Naturally Sourced</h3>
                <p className="text-muted-foreground">
                  All ingredients sourced directly from local Nigerian farmers, supporting communities
                </p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-primary/20 hover-scale animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="text-4xl mb-4">🚛</div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Quick and reliable delivery across Nigeria. Lagos orders delivered within 24-48 hours
                </p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-primary/20 hover-scale animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div className="text-4xl mb-4">💚</div>
                <h3 className="text-xl font-semibold mb-2">Made with Love in Nigeria</h3>
                <p className="text-muted-foreground">
                  Locally made. Naturally pure. Thoughtfully created for every skin type
                </p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-lg border border-primary/20 hover-scale animate-fade-in" style={{ animationDelay: '300ms' }}>
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xl font-semibold mb-2">Exclusive Rewards</h3>
                <p className="text-muted-foreground">
                  Join our affiliate program and earn while sharing products you love
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground mt-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Affiliate Program
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Earn commissions when customers buy our products through your code. Get your unique referral code today!
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link to="/affiliate">Learn More</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
