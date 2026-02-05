import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { api, auth } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Affiliate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAffiliate, setIsAffiliate] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { session } } = await auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        // Check if already an affiliate
        try {
          const { isAffiliate: isAff } = await api.checkAffiliate();
          if (isAff) {
            setIsAffiliate(true);
            navigate('/affiliate-dashboard');
          }
        } catch (error) {
          // Not an affiliate
        }
      }
      setChecking(false);
    };

    checkUserStatus();
  }, [navigate]);

  const generateAffiliateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleGetStarted = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to join the affiliate program",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (!agreed) {
      toast({
        title: "Agreement Required",
        description: "Please read and agree to the affiliate rules",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { affiliate_code } = await api.joinAffiliate();
      toast({
        title: "Success!",
        description: "You're now part of the affiliate program!",
      });
      navigate('/affiliate-dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register for affiliate program",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Affiliate Program</h1>
          <p className="text-lg text-muted-foreground">
            Earn commissions when customers buy our products through your code!
          </p>
        </div>

        {/* How It Works */}
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

        {/* Commission Structure */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Commission Structure</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="font-medium">Commission per 2kg Black Soap or 1,000ml Kernel Oil</span>
              <span className="text-xl font-bold text-primary">₦1,000</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">• For other quantities or products, commission is calculated proportionally</p>
              <p className="mb-2">• Customers using your code get 5% discount on their purchase</p>
            </div>
          </div>

          <div className="text-muted-foreground">
            <p className="mb-2">
              • Commissions are withdrawable once they reach ₦5,000.
            </p>
            <p className="mb-2">
              • <strong>NEW:</strong> You can convert your commission balance into discount coupons for your own purchases! (Minimum ₦100).
            </p>
          </div>
        </Card>

        {/* How to Join */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">
            How to Join the Affiliate Program
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-muted-foreground mb-6">
            <li>Ensure you are a registered Melodiva user.</li>
            <li>
              If not registered,{" "}
              <span
                onClick={() => navigate("/auth")}
                className="text-primary underline cursor-pointer font-medium"
              >
                Register Now!
              </span>
            </li>
            <li>
              Read and agree to all{" "}
              <a
                href="/affiliate-rules"
                className="text-primary underline font-medium"
              >
                Affiliate Program Rules
              </a>
              .
            </li>
            <li>
              Once you agree to the rules, click "Get Started" to activate your
              affiliate account.
            </li>
          </ol>

          <div className="flex items-center space-x-2 mb-6">
            <Checkbox
              id="agree"
              checked={agreed}
              onCheckedChange={(value) => setAgreed(!!value)}
            />
            <Label htmlFor="agree" className="text-sm text-muted-foreground">
              I have read and agree to all the{" "}
              <a
                href="/affiliate-rules"
                className="text-primary underline font-medium"
              >
                Affiliate Program Rules
              </a>
              .
            </Label>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              disabled={!agreed || loading}
              onClick={handleGetStarted}
            >
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Get Started"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Affiliate;
