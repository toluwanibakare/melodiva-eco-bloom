import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, TrendingUp, ArrowLeft, Loader2, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Affiliate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    socialHandle: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedModalOpen, setSubmittedModalOpen] = useState(false);

  const handleSubmitWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Full Name, Email, Phone/WhatsApp).",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await api.joinAffiliateWaitlist({
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        social_handle: formData.socialHandle,
      });

      toast({
        title: "Waitlist Joined!",
        description: "Your application has been received. Please check your email for confirmation.",
      });

      setSubmittedModalOpen(true);
    } catch (error: any) {
      toast({
        title: "Submission Saved",
        description: error.message || "Thank you for joining the Melodiva Affiliate Waitlist.",
      });
      setSubmittedModalOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

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

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-bold px-3 py-1 text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 mr-1 inline" /> Affiliate Program
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Earn With <span className="gradient-text">Melodiva Skincare</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Partner with Nigeria's premier 100% natural, unrefined black soap and kernel oil brand. Share your unique code and earn attractive commissions on every sale!
          </p>
        </div>

        {/* How It Works Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center border-border/80 shadow-xs hover:shadow-md transition-all rounded-2xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">1. Share Your Code</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get a personalized discount code to share with your friends, followers, and family.
            </p>
          </Card>

          <Card className="p-6 text-center border-border/80 shadow-xs hover:shadow-md transition-all rounded-2xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">2. Track Real-time Sales</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Monitor your referral conversions and earnings directly from your affiliate dashboard.
            </p>
          </Card>

          <Card className="p-6 text-center border-border/80 shadow-xs hover:shadow-md transition-all rounded-2xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-foreground">3. Earn Commissions</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Earn competitive payouts on every successful purchase made with your code.
            </p>
          </Card>
        </div>

        {/* Commission Structure Card */}
        <Card className="p-8 border-primary/20 bg-card/90 shadow-md rounded-2xl">
          <h2 className="text-2xl font-extrabold mb-6 text-foreground">Commission & Perks</h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="font-semibold text-foreground text-sm md:text-base">
                Commission per 2kg Black Soap or 1,000ml Kernel Oil
              </span>
              <span className="text-xl md:text-2xl font-black text-primary">₦1,000</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Customers using your code enjoy a 5% instant discount at checkout.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Proportional commissions apply for all other tub sizes and oil quantities.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Flexible withdrawals directly to any Nigerian bank account once you reach ₦5,000.</span>
              </li>
            </ul>
          </div>
        </Card>

        {/* Join Affiliate Waitlist Section */}
        <Card className="p-8 border-2 border-primary/40 bg-gradient-to-b from-card to-secondary/30 shadow-xl rounded-3xl">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-3">
            <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold px-3 py-1 text-xs">
              <Clock className="w-3.5 h-3.5 mr-1 inline" /> REGISTRATION OPENING SOON
            </Badge>
            <h2 className="text-2xl md:text-3xl font-black text-foreground">
              Join the Affiliate Waitlist
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Direct self-registration is temporarily paused while we onboard our initial wave of brand partners. Sign up below to get early access and receive your welcome email!
            </p>
          </div>

          <form onSubmit={handleSubmitWaitlist} className="max-w-xl mx-auto space-y-4">
            <div>
              <Label htmlFor="fullName" className="font-bold text-xs">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="e.g. Favor Johnson"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-1 rounded-xl h-11"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="font-bold text-xs">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 rounded-xl h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phoneNumber" className="font-bold text-xs">WhatsApp / Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="e.g. 08012345678"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="mt-1 rounded-xl h-11"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="socialHandle" className="font-bold text-xs">Instagram / TikTok Handle (Optional)</Label>
              <Input
                id="socialHandle"
                type="text"
                placeholder="e.g. @melodiva_products"
                value={formData.socialHandle}
                onChange={(e) => setFormData({ ...formData, socialHandle: e.target.value })}
                className="mt-1 rounded-xl h-11"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary h-12 text-sm font-bold rounded-2xl shadow-lg mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Join Affiliate Waitlist"
              )}
            </Button>
          </form>
        </Card>
      </div>

      {/* Confirmation Modal with WhatsApp Community Link */}
      <Dialog open={submittedModalOpen} onOpenChange={setSubmittedModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 text-center">
          <DialogHeader className="text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-black text-foreground">
              You're on the Waitlist! 🎉
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Thank you for applying to become a Melodiva Brand Affiliate. Your waitlist confirmation details have been sent to <strong>{formData.email}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                Join our WhatsApp VIP Community
              </p>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Connect directly with our team, receive real-time program launch updates, and access marketing media assets.
              </p>
              <a
                href="https://chat.whatsapp.com/GzF4MelodivaCommunity"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all mt-2"
              >
                <FaWhatsapp className="w-4.5 h-4.5" />
                <span>Join WhatsApp VIP Community</span>
              </a>
            </div>
          </div>

          <Button
            onClick={() => setSubmittedModalOpen(false)}
            variant="outline"
            className="w-full rounded-xl text-xs font-bold h-10"
          >
            Close & Continue Browsing
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Affiliate;
