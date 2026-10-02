import { AlertTriangle, RefreshCw, Truck, CheckCircle2, ShieldAlert, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const ReturnsPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <SEO 
        title="Returns & Refund Policy"
        description="Melodiva Skin Care return, exchange, and damaged item replacement policy. Learn how we handle claims and replacements."
        canonical="/returns-policy"
      />
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <RefreshCw className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3 text-foreground">Returns & Refund Policy</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Please review our refund, return, and order cancellation guidelines prior to placing your order with Melodiva Skincare.
        </p>
        <span className="text-xs text-muted-foreground mt-2 inline-block">
          Last updated: September 26, 2026
        </span>
      </div>

      {/* CRITICAL STRICT NO-REFUND ONCE SHIPPED BANNER */}
      <div className="mb-10 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-2xl flex items-start gap-4">
        <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400 shrink-0 mt-1" />
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
            NO REFUNDS ONCE ORDER HAS BEEN SHIPPED
          </h2>
          <p className="text-sm text-foreground/90 font-medium leading-relaxed">
            Please note that <strong>NO REFUNDS</strong> will be issued once your order has been shipped, dispatched to dispatch riders, or handed over to interstate waybill transporters under any circumstances.
          </p>
          <p className="text-xs text-muted-foreground pt-1">
            Please ensure all delivery details, state selections, and items in your shopping cart are 100% correct before making payment.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* 1. Order Cancellations */}
        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> 1. Order Cancellations (Before Dispatch Only)
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you wish to cancel or modify an order, you must contact our customer care team on WhatsApp (+234 807 872 5283) <strong>immediately before the order is processed and shipped</strong>.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 pl-2">
              <li>If your order has <strong>not yet been dispatched</strong>, a full refund or store credit will be granted.</li>
              <li>Once dispatch or waybill processing has commenced, the order cannot be cancelled or refunded.</li>
            </ul>
          </CardContent>
        </Card>

        {/* 2. Damaged or Wrong Items */}
        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Truck className="h-5 w-5 text-primary" /> 2. Damaged or Incorrect Items Upon Delivery
            </h2>
            <p className="text-sm text-foreground font-semibold leading-relaxed bg-amber-500/10 p-3 rounded-lg border border-amber-500/20">
              Please inspect your order upon receipt. If an item arrives damaged, take a photo/video immediately and contact our WhatsApp support (+234 807 872 5283) within 24 hours for a replacement consideration.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 pl-2 pt-2">
              <li>Inspect your order immediately upon receipt in the presence of the dispatch rider or at the waybill hub.</li>
              <li>Take clear photos and unboxing videos showing the unopened condition of the outer packaging and damaged product.</li>
              <li>Report an issue on your order page or notify our WhatsApp support (+234 807 872 5283) within 24 hours of delivery.</li>
              <li>Verified damaged or wrongly sent items will be considered for replacement at no additional cost.</li>
            </ul>
          </CardContent>
        </Card>

        {/* 3. Hygiene & Safety Restrictions */}
        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" /> 3. Hygiene & Safety Regulations
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Due to strict health, safety, and personal hygiene standards for natural skincare products:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 pl-2">
              <li>We <strong>cannot accept returns or exchanges</strong> for opened, used, or tampered skincare containers, soaps, body creams, or serums.</li>
              <li>Skin suitability vary by individual skin type. We encourage reviewing ingredients listed on product pages before ordering.</li>
            </ul>
          </CardContent>
        </Card>

        {/* 4. Need Assistance? */}
        <Card className="p-6 border-border bg-secondary/20">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-foreground">Need Assistance with an Order?</h2>
            <p className="text-sm text-muted-foreground">
              Our customer happiness team is here to assist you with tracking, order changes, or delivery support:
            </p>
            <div className="pt-2 text-sm text-muted-foreground space-y-2">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>WhatsApp / Call: <strong>+234 807 872 5283</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>Email: <strong>melodivaproducts@gmail.com</strong></span>
              </p>
            </div>
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

export default ReturnsPolicy;
