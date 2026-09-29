import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Check, ArrowRight, Gift, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface LaunchPromoModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function LaunchPromoModal({ open: externalOpen, onOpenChange }: LaunchPromoModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { setAffiliateCode, setAppliedCoupon } = useCartStore();
  const { toast } = useToast();

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

  const handleOpenChange = (newOpenState: boolean) => {
    if (externalOpen === undefined) {
      setInternalOpen(newOpenState);
    }
    if (onOpenChange) {
      onOpenChange(newOpenState);
    }
    if (!newOpenState) {
      sessionStorage.setItem('melodiva_promo_modal_dismissed', 'true');
    }
  };

  useEffect(() => {
    if (externalOpen === undefined) {
      const dismissed = sessionStorage.getItem('melodiva_promo_modal_dismissed');
      if (!dismissed) {
        // Delay 1s for pleasant entrance after initial page load
        const timer = setTimeout(() => setInternalOpen(true), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [externalOpen]);

  const handleCopyAndApply = async () => {
    navigator.clipboard.writeText('OCTOBERFREE');
    setCopied(true);

    try {
      const data = await api.verifyAffiliateCode('OCTOBERFREE');
      if (data.valid) {
        setAffiliateCode('OCTOBERFREE');
        setAppliedCoupon({
          code: 'OCTOBERFREE',
          type: 'coupon',
          discount_type: 'free_delivery',
          amount: 0,
          min_order_amount: 20000,
          expiry_date: '2026-10-31T23:59:59Z'
        });
      }
    } catch {
      setAffiliateCode('OCTOBERFREE');
    }

    toast({
      title: "Code Applied & Copied!",
      description: "Code OCTOBERFREE is saved! 100% Free Delivery will apply at checkout for orders over ₦20,000.",
    });

    setTimeout(() => setCopied(false), 3000);
  };

  const handleShopNow = () => {
    handleCopyAndApply();
    handleOpenChange(false);
    navigate('/shop');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-2 border-amber-400/40 bg-zinc-950 text-white rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.35)] animate-in zoom-in-95 duration-300">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Outer Container */}
        <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center">
          
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-emerald-500/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-widest shadow-inner mb-4">
            <Gift className="w-4 h-4 text-amber-300" />
            <span>October Launch Special</span>
          </div>

          {/* Title */}
          <div className="mb-2">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              100% FREE <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">Delivery</span>
            </h2>
            <p className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest mt-1">
              Across All 36 States in Nigeria
            </p>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-xs leading-relaxed my-3 font-medium">
            Enjoy zero delivery fees throughout October on all orders equal to or above <strong className="text-amber-300 font-bold">₦20,000</strong>.
          </p>

          {/* Luxury Voucher Ticket Stub */}
          <div className="w-full my-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-950 via-zinc-900 to-emerald-950 border border-emerald-500/40 relative shadow-inner">
            <div className="flex items-center justify-between border-b border-dashed border-emerald-500/30 pb-3 mb-3">
              <div className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-extrabold text-emerald-400">Launch Promo Ticket</p>
                  <p className="text-[10px] text-zinc-400">Min Order: ₦20,000 • Valid Oct 2026</p>
                </div>
              </div>
              <Badge className="bg-amber-400 text-zinc-950 font-black text-[10px] uppercase">
                Free Shipping
              </Badge>
            </div>

            {/* Coupon Code Output & Action */}
            <div className="flex items-center justify-between gap-2 bg-black/60 p-2.5 rounded-xl border border-emerald-500/30">
              <div className="flex items-center gap-2 pl-2">
                <Tag className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono text-base sm:text-lg font-black tracking-widest text-amber-300">
                  OCTOBERFREE
                </span>
              </div>
              <Button
                size="sm"
                onClick={handleCopyAndApply}
                className={`text-xs font-extrabold rounded-lg px-3 py-1.5 transition-all duration-300 ${
                  copied
                    ? 'bg-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-zinc-950 shadow-md'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" /> Applied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" /> Copy & Apply
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2 pt-2">
            <Button
              onClick={handleShopNow}
              size="lg"
              className="w-full btn-primary text-xs sm:text-sm font-extrabold rounded-2xl py-6 shadow-xl hover:scale-[1.02] active:scale-95 transition-all gap-2"
            >
              <span>Explore Products & Claim Offer</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <button
              onClick={() => handleOpenChange(false)}
              className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-semibold py-1 block w-full text-center"
            >
              No thanks, I'll shop without discount
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
