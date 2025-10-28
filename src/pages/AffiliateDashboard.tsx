import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Copy, CheckCircle2, TrendingUp, Users, Wallet, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [referralCount, setReferralCount] = useState(0);
  const [withdrawalData, setWithdrawalData] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: ""
  });

  useEffect(() => {
    const checkAffiliateStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch affiliate data
      const { data: affiliate, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error || !affiliate) {
        toast({
          title: "Not an Affiliate",
          description: "Please register for the affiliate program first",
          variant: "destructive"
        });
        navigate("/affiliate");
        return;
      }

      setAffiliateData(affiliate);

      // Fetch referral count
      const { data: referrals, error: refError } = await supabase
        .from('affiliate_referrals')
        .select('id')
        .eq('affiliate_id', affiliate.id);

      if (!refError && referrals) {
        setReferralCount(referrals.length);
      }

      setLoading(false);
    };

    checkAffiliateStatus();
  }, [navigate, toast]);

  const copyCode = () => {
    if (affiliateData?.affiliate_code) {
      navigator.clipboard.writeText(affiliateData.affiliate_code);
      setCopied(true);
      toast({
        title: "Code Copied!",
        description: "Your affiliate code has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawalData.amount);
    
    if (amount < 5000) {
      toast({
        title: "Error",
        description: "Minimum withdrawal amount is ₦5,000",
        variant: "destructive"
      });
      return;
    }

    if (amount > affiliateData.current_balance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive"
      });
      return;
    }

    setWithdrawing(true);
    try {
      const { error } = await supabase
        .from('affiliate_withdrawals')
        .insert([{
          affiliate_id: affiliateData.id,
          amount: amount,
          bank_name: withdrawalData.bankName,
          account_number: withdrawalData.accountNumber,
          account_name: withdrawalData.accountName
        }]);

      if (error) throw error;

      toast({
        title: "Withdrawal Requested!",
        description: "Your withdrawal request has been submitted and will be processed within 7 business days.",
      });
      
      setWithdrawalData({
        amount: "",
        bankName: "",
        accountNumber: "",
        accountName: ""
      });

      // Refresh affiliate data
      const { data: updatedAffiliate } = await supabase
        .from('affiliates')
        .select('*')
        .eq('id', affiliateData.id)
        .single();
      
      if (updatedAffiliate) {
        setAffiliateData(updatedAffiliate);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to request withdrawal",
        variant: "destructive"
      });
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Affiliate Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Commission</p>
                <p className="text-2xl font-bold">{formatCurrency(affiliateData.total_commission)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(affiliateData.current_balance)}</p>
              </div>
              <Wallet className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Withdrawn</p>
                <p className="text-2xl font-bold">{formatCurrency(affiliateData.total_withdrawn)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Referrals</p>
                <p className="text-2xl font-bold">{referralCount}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Affiliate Code Section */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Affiliate Code</h2>
          <div className="flex items-center gap-4">
            <Input
              value={affiliateData.affiliate_code}
              readOnly
              className="font-mono text-lg"
            />
            <Button onClick={copyCode} size="lg">
              {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Share this code with customers. They'll get a discount and you'll earn {affiliateData.commission_rate}% commission on their purchases!
          </p>
        </Card>

        {/* Withdrawal Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
          <p className="text-muted-foreground mb-4">
            Available Balance: <span className="font-bold text-foreground">{formatCurrency(affiliateData.current_balance)}</span>
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Minimum withdrawal: ₦5,000 • Processing time: 7 business days
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" disabled={affiliateData.current_balance < 5000}>
                Request Withdrawal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdrawal Request</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleWithdrawal} className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount (₦)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="5000"
                    max={affiliateData.current_balance}
                    value={withdrawalData.amount}
                    onChange={(e) => setWithdrawalData({ ...withdrawalData, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    type="text"
                    value={withdrawalData.bankName}
                    onChange={(e) => setWithdrawalData({ ...withdrawalData, bankName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    value={withdrawalData.accountNumber}
                    onChange={(e) => setWithdrawalData({ ...withdrawalData, accountNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    type="text"
                    value={withdrawalData.accountName}
                    onChange={(e) => setWithdrawalData({ ...withdrawalData, accountName: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={withdrawing}>
                  {withdrawing ? "Processing..." : "Submit Request"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </div>
  );
}
