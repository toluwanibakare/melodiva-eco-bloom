import { FileText, ShieldAlert, Scale, CheckSquare, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <SEO 
        title="Terms & Conditions"
        description="Melodiva Skin Care terms and conditions of service, purchasing rules, and site usage guidelines."
        canonical="/terms-and-conditions"
      />
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3 text-foreground">Terms & Conditions</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Welcome to Melodiva Skincare. Please read these terms and conditions carefully before using our website or purchasing our products.
        </p>
        <span className="text-xs text-muted-foreground mt-2 inline-block">
          Effective Date: September 26, 2026
        </span>
      </div>

      <div className="space-y-8">
        {/* 1. Acceptance of Terms */}
        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <CheckSquare className="h-5 w-5 text-primary" /> 1. Acceptance of Terms
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By accessing, browsing, or purchasing products from the Melodiva Skincare website, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to all of these terms, please do not use our site or order products.
            </p>
          </CardContent>
        </Card>

        {/* 2. Products, Pricing & Payments */}
        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Scale className="h-5 w-5 text-primary" /> 2. Products, Pricing & Payment Terms
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              All prices listed on Melodiva Skincare are in Nigerian Naira (NGN ₦) and are subject to change without prior notice.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 pl-2">
              <li>Payments are processed securely via Paystack. Your payment confirmation constitutes a binding order request.</li>
              <li>Product availability is subject to change. We reserve the right to limit order quantities.</li>
              <li>We make every effort to display accurate product descriptions, ingredients, and photographs.</li>
            </ul>
          </CardContent>
        </Card>

        {/* 3. Delivery & No Refund Policy */}
        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <ShieldAlert className="h-5 w-5 text-red-500" /> 3. Delivery & Shipping Terms (Strict Refund Rule)
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Delivery is carried out via registered dispatch riders (Lagos) and interstate transporters/waybill services (outside Lagos).
            </p>
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg space-y-1 my-3">
              <p className="text-sm font-bold text-red-600 dark:text-red-400">
                NO REFUND POLICY ONCE SHIPPED:
              </p>
              <p className="text-xs text-foreground/90 font-medium">
                Under no circumstances will a refund be issued once an order has been handed over to dispatch riders or interstate waybill transporters. Orders can only be amended or cancelled prior to dispatch.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 4. Affiliate Program Terms */}
        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <CheckSquare className="h-5 w-5 text-primary" /> 4. Affiliate Program Regulations
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Users registered as affiliates agree to abide by our Affiliate Rules:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 pl-2">
              <li>Affiliates earn commission on valid completed customer orders placed with their code/link.</li>
              <li>Self-referrals or fraudulent activity will result in account termination and forfeiture of unpaid earnings.</li>
              <li>Payout requests are processed according to our standard schedule upon verification.</li>
            </ul>
          </CardContent>
        </Card>

        {/* 5. Limitation of Liability & Governing Law */}
        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Scale className="h-5 w-5 text-primary" /> 5. Limitation of Liability & Governing Law
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Melodiva Skincare shall not be liable for indirect, incidental, or consequential damages resulting from the misuse of products or website downtime. These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
            </p>
          </CardContent>
        </Card>

        {/* 6. Contact Information */}
        <Card className="p-6 border-border bg-secondary/20">
          <CardContent className="space-y-3 pt-4">
            <h2 className="text-lg font-bold text-foreground">Questions About Our Terms?</h2>
            <p className="text-sm text-muted-foreground">
              For any questions or clarification regarding these Terms & Conditions, please contact us:
            </p>
            <div className="pt-2 text-sm text-muted-foreground space-y-1.5">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>Email: <a href="mailto:melodivaproducts@gmail.com" className="text-primary hover:underline">melodivaproducts@gmail.com</a></span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>Phone / WhatsApp: +234 807 872 5283</span>
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

export default TermsAndConditions;
