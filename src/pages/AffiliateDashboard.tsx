import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { api, auth } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Copy,
  CheckCircle2,
  TrendingUp,
  Users,
  Wallet,
  DollarSign,
  RefreshCw,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  Phone,
  Receipt
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AffiliateDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [converting, setConverting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralCount, setReferralCount] = useState(0);
  const [expandedReferralId, setExpandedReferralId] = useState<string | null>(null);
  const [conversionAmount, setConversionAmount] = useState("");
  const [withdrawalData, setWithdrawalData] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: ""
  });

  const handleConversion = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(conversionAmount);

    if (amount < 100) {
      toast({
        title: "Error",
        description: "Minimum conversion amount is ₦100",
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

    setConverting(true);
    try {
      const res = await api.convertBalance(amount);
      toast({
        title: "Success! Coupon Created",
        description: `Code: ${res.coupon_code} (Worth ₦${formatCurrency(res.amount)})`,
      });
      navigator.clipboard.writeText(res.coupon_code);
      toast({ title: "Copied to clipboard", description: "Coupon code copied!" });

      setConversionAmount("");
      const dashboardData = await api.getAffiliateDashboard();
      if (dashboardData.affiliate) {
        setAffiliateData(dashboardData.affiliate);
        setReferrals(dashboardData.referrals || []);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Conversion failed",
        variant: "destructive"
      });
    } finally {
      setConverting(false);
    }
  };

  useEffect(() => {
    const checkAffiliateStatus = async () => {
      const { data: { session } } = await auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      try {
        const dashboardData = await api.getAffiliateDashboard();
        if (!dashboardData.affiliate) {
          toast({
            title: "Not an Affiliate",
            description: "Please register for the affiliate program first",
            variant: "destructive"
          });
          navigate("/affiliate");
          return;
        }

        setAffiliateData(dashboardData.affiliate);
        setReferrals(dashboardData.referrals || []);
        setReferralCount(dashboardData.referrals?.length || 0);
      } catch (error: any) {
        toast({
          title: "Not an Affiliate",
          description: "Please register for the affiliate program first",
          variant: "destructive"
        });
        navigate("/affiliate");
        return;
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

  const regenerateCode = async () => {
    toast({
      title: "Not Available",
      description: "Code regeneration is not available. Please contact support.",
      variant: "destructive"
    });
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
      await api.createWithdrawal({
        amount: amount,
        bank_name: withdrawalData.bankName,
        account_number: withdrawalData.accountNumber,
        account_name: withdrawalData.accountName
      });

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

      const dashboardData = await api.getAffiliateDashboard();
      if (dashboardData.affiliate) {
        setAffiliateData(dashboardData.affiliate);
        setReferrals(dashboardData.referrals || []);
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-black tracking-tight">Affiliate Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Total Commission</p>
                <p className="text-2xl font-black text-foreground">{formatCurrency(affiliateData.total_commission)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Current Balance</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(affiliateData.current_balance)}</p>
              </div>
              <Wallet className="h-8 w-8 text-emerald-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Total Withdrawn</p>
                <p className="text-2xl font-black text-foreground">{formatCurrency(affiliateData.total_withdrawn)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Total Sales Referred</p>
                <p className="text-2xl font-black text-foreground">{referralCount}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Affiliate Code Section */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Your Promo Code</h2>
          <div className="flex items-center gap-4">
            <Input
              value={affiliateData.affiliate_code}
              readOnly
              className="font-mono text-lg font-bold text-primary"
            />
            <Button onClick={copyCode} size="lg" className="btn-primary font-bold">
              {copied ? <CheckCircle2 className="h-5 w-5 mr-2" /> : <Copy className="h-5 w-5 mr-2" />}
              {copied ? "Copied" : "Copy Code"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 font-medium">
            Share this promo code with buyers! Customers receive a 5% instant discount and you earn commission on every order placed using your code.
          </p>
        </Card>

        {/* Referred Customers & Earnings Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">Referred Customers & Earnings</h2>
              <p className="text-xs text-muted-foreground">Click any row to view customer info, purchased items, and exact commission breakdown.</p>
            </div>
            <Badge variant="outline" className="text-xs font-bold px-3 py-1">
              {referralCount} Orders
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/40">
                <TableRow>
                  <TableHead className="font-bold text-xs">Customer / Order #</TableHead>
                  <TableHead className="font-bold text-xs">Location</TableHead>
                  <TableHead className="font-bold text-xs">Date</TableHead>
                  <TableHead className="font-bold text-xs">Order Total</TableHead>
                  <TableHead className="font-bold text-xs text-right">Commission Earned</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((ref: any) => {
                  const isExpanded = expandedReferralId === ref.id;

                  return (
                    <Fragment key={ref.id}>
                      <TableRow
                        onClick={() => setExpandedReferralId(isExpanded ? null : ref.id)}
                        className="cursor-pointer hover:bg-secondary/40 transition-colors group"
                      >
                        <TableCell className="font-medium text-xs">
                          <div className="flex flex-col space-y-0.5">
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                              {ref.customer_name || "Referred Customer"}
                            </span>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <ShoppingBag className="w-3 h-3 text-primary shrink-0" />
                              Order #{ref.order_number || ref.order_id || 'N/A'}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground">
                          {ref.delivery_city ? `${ref.delivery_city}, ${ref.delivery_state}` : 'Nigeria'}
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(ref.created_at).toLocaleDateString()}
                        </TableCell>

                        <TableCell className="text-xs font-bold text-foreground">
                          {ref.order_total ? formatCurrency(ref.order_total) : '—'}
                        </TableCell>

                        <TableCell className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 text-right">
                          +{formatCurrency(ref.commission_amount)}
                        </TableCell>

                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expandable Dropdown Details Box */}
                      {isExpanded && (
                        <TableRow className="bg-secondary/20 hover:bg-secondary/20">
                          <TableCell colSpan={6} className="p-4 border-b border-border/60">
                            <div className="grid gap-4 md:grid-cols-3 p-4 rounded-2xl bg-card border border-border shadow-inner text-xs">
                              {/* Customer Details */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-primary font-bold border-b border-border pb-1.5">
                                  <User className="w-3.5 h-3.5" />
                                  <span>Customer Information</span>
                                </div>
                                <div className="space-y-1">
                                  <p className="font-bold text-foreground">{ref.customer_name || "Guest Buyer"}</p>
                                  <p className="text-muted-foreground truncate">{ref.customer_email || "No email on record"}</p>
                                  <p className="text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-primary shrink-0" />
                                    {ref.delivery_address || 'Address on file'} ({ref.delivery_city || 'City'}, {ref.delivery_state || 'State'})
                                  </p>
                                  {ref.phone_number && (
                                    <p className="text-primary font-semibold flex items-center gap-1">
                                      <Phone className="w-3 h-3 shrink-0" />
                                      {ref.phone_number}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Purchased Items List */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-primary font-bold border-b border-border pb-1.5">
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Items Purchased</span>
                                </div>
                                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                                  {Array.isArray(ref.items) && ref.items.length > 0 ? (
                                    ref.items.map((item: any, idx: number) => (
                                      <div key={idx} className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-secondary/50">
                                        <span className="font-semibold text-foreground truncate max-w-[140px]">{item.name}</span>
                                        <span className="text-muted-foreground">{item.quantity}x @ {formatCurrency(item.price)}</span>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-muted-foreground italic text-[11px]">Organic skincare product order</p>
                                  )}
                                </div>
                              </div>

                              {/* Commission & Order Summary */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-primary font-bold border-b border-border pb-1.5">
                                  <Receipt className="w-3.5 h-3.5" />
                                  <span>Earnings & Status Summary</span>
                                </div>
                                <div className="space-y-1 text-[11px]">
                                  {ref.subtotal && (
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Order Subtotal:</span>
                                      <span>{formatCurrency(ref.subtotal)}</span>
                                    </div>
                                  )}
                                  {ref.discount > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-semibold">
                                      <span>5% Promo Discount:</span>
                                      <span>-{formatCurrency(ref.discount)}</span>
                                    </div>
                                  )}
                                  {ref.order_total && (
                                    <div className="flex justify-between font-bold text-foreground pt-1 border-t border-border/60">
                                      <span>Customer Paid:</span>
                                      <span>{formatCurrency(ref.order_total)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between font-extrabold text-emerald-600 dark:text-emerald-400 pt-1 text-xs">
                                    <span>Your Commission Earned:</span>
                                    <span>+{formatCurrency(ref.commission_amount)}</span>
                                  </div>
                                  <div className="pt-2 flex items-center gap-2">
                                    <Badge variant={ref.payment_status === 'paid' ? 'default' : 'outline'} className="text-[10px] font-bold">
                                      Payment: {ref.payment_status || 'completed'}
                                    </Badge>
                                    <Badge variant="secondary" className="text-[10px] font-bold capitalize">
                                      Status: {ref.order_status || 'processed'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })}

                {referrals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                      No referral purchases recorded yet. Share your code to start earning commissions!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Withdrawal Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>
            <p className="text-muted-foreground mb-4">
              Available Balance: <span className="font-bold text-foreground">{formatCurrency(affiliateData?.current_balance || 0)}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Minimum withdrawal: ₦5,000 • Processing time: 7 business days
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full" disabled={(affiliateData?.current_balance || 0) < 5000}>
                  Request Payment
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
                      max={affiliateData?.current_balance}
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

          {/* Exchange Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Exchange for Discount</h2>
            <p className="text-muted-foreground mb-4">
              Convert your earnings into a discount coupon for your next purchase.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Minimum conversion: ₦100 • Instant availability
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="lg" className="w-full" disabled={(affiliateData?.current_balance || 0) < 100}>
                  Convert to Coupon
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Convert Balance</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleConversion} className="space-y-4">
                  <div>
                    <Label htmlFor="convAmount">Amount to Convert (₦)</Label>
                    <Input
                      id="convAmount"
                      type="number"
                      min="100"
                      max={affiliateData?.current_balance}
                      value={conversionAmount}
                      onChange={(e) => setConversionAmount(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={converting}>
                    {converting ? "Converting..." : "Convert Now"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </Card>
        </div>
      </div>
    </div>
  );
}
