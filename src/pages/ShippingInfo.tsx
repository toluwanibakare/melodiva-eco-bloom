import { Truck, MapPin, Clock, ShieldCheck, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const ShippingInfo = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <SEO 
        title="Nationwide Shipping & Delivery Rates across Nigeria"
        description="Learn about Melodiva Skin Care delivery options, rates, and shipping schedules across all 36 states in Nigeria. Free shipping available on orders over ₦20,000."
        canonical="/shipping"
      />
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <Truck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3 text-foreground">Shipping & Delivery Information</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Learn about our delivery options, pricing tiers, and registered transporter channels across Nigeria.
        </p>
      </div>

      <div className="space-y-8">
        {/* Delivery Rates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-primary/20 bg-primary/5 hover:border-primary transition-all">
            <CardHeader className="pb-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary font-semibold w-fit mb-2">
                Lagos Doorstep
              </span>
              <CardTitle className="text-lg">Within Lagos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-2xl font-bold text-primary">₦2,000 – ₦3,000</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Delivery is by: <strong>Registered dispatch riders</strong></span>
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Est. Delivery: 24 to 48 Hours</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-primary/5 hover:border-primary transition-all">
            <CardHeader className="pb-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary font-semibold w-fit mb-2">
                Interstate (Hub)
              </span>
              <CardTitle className="text-lg">Interstate Hub to Hub</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-2xl font-bold text-primary">₦4,000 – ₦6,000</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Delivery is by: <strong>Registered waybill with Interstate transporter</strong></span>
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Est. Delivery: 2 to 4 Days</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 bg-primary/5 hover:border-primary transition-all">
            <CardHeader className="pb-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary font-semibold w-fit mb-2">
                Interstate + Doorstep
              </span>
              <CardTitle className="text-lg">Interstate + Doorstep</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="text-2xl font-bold text-primary">₦5,500 – ₦8,000</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Delivery is by: <strong>Registered Waybill + local dispatch rider</strong></span>
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary shrink-0" />
                <span>Est. Delivery: 2 to 5 Days</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Order Tracking & Confirmation */}
        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <MapPin className="h-5 w-5 text-primary" /> Order Tracking & Waybill Confirmation
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Once your order has been dispatched or registered with an interstate waybill transporter, you will receive a confirmation with tracking details and delivery phone numbers to track your package directly to your destination.
            </p>
          </CardContent>
        </Card>

        <Card className="p-6 border-border bg-secondary/20">
          <CardContent className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-foreground">Have Questions About Delivery?</h2>
            <p className="text-sm text-muted-foreground">
              Contact our delivery team directly via WhatsApp for quick tracking updates:
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
              <Phone className="h-4 w-4 text-primary" />
              <span>WhatsApp Support: <strong>+234 807 872 5283</strong></span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="text-sm text-primary hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ShippingInfo;
