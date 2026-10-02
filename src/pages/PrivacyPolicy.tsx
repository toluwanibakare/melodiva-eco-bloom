import { ShieldCheck, Lock, Eye, FileText, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <SEO 
        title="Privacy Policy"
        description="Melodiva Skin Care privacy policy. Read how we collect, store, and protect your personal data when shopping with us."
        canonical="/privacy-policy"
      />
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-3 text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          At Melodiva Skincare, we are committed to safeguarding your privacy and ensuring your personal information is protected.
        </p>
        <span className="text-xs text-muted-foreground mt-2 inline-block">
          Last updated: September 26, 2026
        </span>
      </div>

      <div className="space-y-8">
        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Eye className="h-5 w-5 text-primary" /> 1. Information We Collect
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When you visit our store, register an account, make a purchase, or participate in our Affiliate Program, we collect personal information you provide to us directly:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 pl-2">
              <li><strong>Contact Information:</strong> Full name, email address, phone number, and WhatsApp number.</li>
              <li><strong>Delivery Details:</strong> Physical address, city/LGA, state, and delivery instructions.</li>
              <li><strong>Account Credentials:</strong> Passwords, security questions, and account preferences.</li>
              <li><strong>Payment Information:</strong> Transactions are securely processed through Paystack. We do not store full debit/credit card numbers or CVVs on our servers.</li>
              <li><strong>Affiliate Data:</strong> Bank account details (for commission payouts) and referral transaction history.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <FileText className="h-5 w-5 text-primary" /> 2. How We Use Your Information
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use the collected information for specific, transparent business purposes:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 pl-2">
              <li>Processing, fulfilling, and delivering your skincare product orders.</li>
              <li>Providing real-time order tracking and SMS/WhatsApp shipping updates.</li>
              <li>Processing affiliate commissions, referral rewards, and bank withdrawal requests.</li>
              <li>Responding to customer support inquiries and product consultation requests.</li>
              <li>Improving our website performance, user experience, and product catalog.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Lock className="h-5 w-5 text-primary" /> 3. Data Sharing & Third Parties
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We do not sell or rent your personal data to third parties. We only share necessary information with trusted partners to operate our services:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1.5 pl-2">
              <li><strong>Delivery Partners:</strong> Registered dispatch riders and interstate waybill transporters to deliver your packages to your doorstep or pickup hub.</li>
              <li><strong>Payment Processors:</strong> Paystack API for encrypted, PCIDSS-compliant card and bank transfer transactions.</li>
              <li><strong>Legal Compliance:</strong> When required by Nigerian law or court order to enforce our legal rights.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" /> 4. Data Security & Storage
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We implement industry-standard security protocols, including SSL encryption, secure API integrations, and access controls to prevent unauthorized access, alteration, or disclosure of your personal information.
            </p>
          </CardContent>
        </Card>

        <Card className="p-6 border-border">
          <CardContent className="space-y-4 pt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Mail className="h-5 w-5 text-primary" /> 5. Contact Us Regarding Privacy
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact our support team:
            </p>
            <div className="pt-2 text-sm text-muted-foreground space-y-2">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>Email: <a href="mailto:melodivaproducts@gmail.com" className="text-primary hover:underline">melodivaproducts@gmail.com</a></span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>Phone / WhatsApp: +234 807 872 5283</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Location: Lagos, Nigeria</span>
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

export default PrivacyPolicy;
