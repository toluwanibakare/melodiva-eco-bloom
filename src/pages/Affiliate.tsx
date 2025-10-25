import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DollarSign, Users, TrendingUp } from 'lucide-react';

const Affiliate = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Affiliate Program</h1>
          <p className="text-lg text-muted-foreground">
            Earn money by sharing products you love!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Share Your Code</h3>
            <p className="text-sm text-muted-foreground">
              Get a unique referral code to share with friends
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Track Sales</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your sales in real-time from your dashboard
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Earn Commissions</h3>
            <p className="text-sm text-muted-foreground">
              Get paid for every successful referral
            </p>
          </Card>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Commission Structure</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="font-medium">2kg Black Soap Sale</span>
              <span className="text-xl font-bold text-primary">₦1,000</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="font-medium">1,000ml Kernel Oil Sale</span>
              <span className="text-xl font-bold text-primary">₦1,000</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Sign in or create an account to join our affiliate program
            </p>
            <Button size="lg">
              Get Started
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Affiliate;
