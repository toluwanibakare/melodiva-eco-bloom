import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function AffiliateRules() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Affiliate Program Rules</h1>
        
        <Card className="p-8 mb-6">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-primary" />
                Commission Structure
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Earn 10% commission on every sale made through your affiliate code</li>
                <li>Commission is calculated on the total order value (excluding shipping)</li>
                <li>Commissions are credited to your account after successful delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-primary" />
                Payment Terms
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Minimum withdrawal amount: ₦5,000</li>
                <li>Withdrawals are processed within 7 business days</li>
                <li>You must provide valid bank account details for payment</li>
                <li>All payments are made via bank transfer to Nigerian bank accounts only</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-primary" />
                Affiliate Code Usage
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Each affiliate receives a unique code upon registration</li>
                <li>Codes are case-sensitive and must be shared accurately</li>
                <li>Self-referrals are strictly prohibited</li>
                <li>Codes cannot be used in conjunction with other promotional codes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-primary" />
                Prohibited Activities
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Spamming or unsolicited promotional messages</li>
                <li>False or misleading advertising about our products</li>
                <li>Using trademark-infringing domain names or social media handles</li>
                <li>Cookie stuffing or fraudulent tracking methods</li>
                <li>Creating fake accounts or orders to generate commissions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-primary" />
                Account Termination
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>We reserve the right to terminate any affiliate account at any time</li>
                <li>Violations of these rules will result in immediate termination</li>
                <li>Pending commissions may be forfeited in case of rule violations</li>
                <li>Melodiva reserves the right to modify these rules at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-primary" />
              Support & Questions
              </h2>
              <p className="text-muted-foreground">
                For any questions about the affiliate program, please contact us at melodivaproducts@gmail.com
              </p>
            </section>
          </div>
        </Card>

        <div className="flex justify-center">
          <Button onClick={() => navigate("/affiliate")} size="lg">
            Back to Affiliate Program
          </Button>
        </div>
      </div>
    </div>
  );
}
