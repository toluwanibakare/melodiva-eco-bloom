import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, ArrowRight, Leaf, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import productsSetImg from '@/assets/products_set.jpeg';

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
      sessionStorage.setItem('melodiva_promo_modal_v7_dismissed', 'true');
    }
  };

  useEffect(() => {
    if (externalOpen === undefined) {
      const dismissed = sessionStorage.getItem('melodiva_promo_modal_v7_dismissed');
      if (!dismissed) {
        // 4 seconds delay to allow visitor to feel the website ambience first
        const timer = setTimeout(() => setInternalOpen(true), 4000);
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
      title: "Complimentary Shipping Applied",
      description: "Code OCTOBERFREE saved. Free delivery will apply at checkout on orders over ₦20,000.",
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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border border-[#E5DFD3] dark:border-[#2A3A31] bg-[#FAF8F5] dark:bg-[#0E1A14] text-[#1C201D] dark:text-[#F4EFE6] rounded-none shadow-2xl z-[100] max-h-[90vh]">
        
        {/* Inner Relative Container */}
        <div className="relative w-full h-full overflow-hidden">
          
          {/* Functional High-Z Close (X) Button */}
          <button
            onClick={() => handleOpenChange(false)}
            aria-label="Close promotion dialog"
            className="absolute right-3.5 top-3.5 z-30 p-2 rounded-full text-[#4A5A50] dark:text-[#A1B5A8] hover:text-[#0B1E16] dark:hover:text-[#FAF8F5] hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-[#D8D0C2] dark:hover:border-[#2F443A]"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Low Opacity Background Image Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img 
              src={productsSetImg} 
              alt="Melodiva Products background" 
              className="w-full h-full object-cover opacity-25 dark:opacity-30 filter contrast-105 saturate-90"
            />
            <div className="absolute inset-0 bg-[#FAF8F5]/80 dark:bg-[#0E1A14]/80 bg-gradient-to-b from-[#FAF8F5]/75 via-[#FAF8F5]/60 to-[#FAF8F5]/85 dark:from-[#0E1A14]/75 dark:via-[#0E1A14]/60 dark:to-[#0E1A14]/85" />
          </div>

          {/* Subtle Decorative Top Line */}
          <div className="h-1.5 w-full bg-[#133E2E] dark:bg-[#2A6E53] relative z-10" />

          {/* Modal Outer Content */}
          <div className="p-8 sm:p-10 flex flex-col items-center text-center relative z-10">
            
            {/* Top Brand Subhead */}
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-3.5 h-3.5 text-[#133E2E] dark:text-[#3B9A76]" />
              <span className="text-[10px] tracking-[0.25em] font-semibold text-[#5A6E63] dark:text-[#A1B5A8] uppercase">
                Melodiva Skin Care
              </span>
            </div>

            {/* Accessible Dialog Title */}
            <DialogTitle asChild>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#0B1E16] dark:text-[#FAF8F5] tracking-tight leading-snug mb-2 font-normal">
                Complimentary <br />
                <span className="italic font-light">Nationwide Delivery</span>
              </h2>
            </DialogTitle>

            <DialogDescription className="sr-only">
              Enjoy complimentary shipping across Nigeria on orders over ₦20,000 using code OCTOBERFREE.
            </DialogDescription>

            <div className="w-10 h-[1px] bg-[#D8D0C2] dark:bg-[#2F443A] my-4" />

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#4A5A50] dark:text-[#B2C5BA] max-w-xs leading-relaxed font-normal mb-6">
              Throughout October, enjoy complimentary shipping across all 36 Nigerian states on orders equal to or above <span className="font-semibold text-[#0B1E16] dark:text-[#FAF8F5]">₦20,000</span>.
            </p>

            {/* Minimalist Voucher Card */}
            <div className="w-full bg-[#F3EFE6]/90 dark:bg-[#14261E]/90 border border-dashed border-[#C8BFB0] dark:border-[#294236] p-4 mb-6 relative text-left">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[#6B7D72] dark:text-[#9BB1A4] font-semibold mb-2">
                <span>Launch Pass</span>
                <span>Valid Through Oct 31</span>
              </div>

              <div className="flex items-center justify-between gap-3 bg-white/95 dark:bg-[#0B1A13]/95 border border-[#E0D8CA] dark:border-[#1F362B] p-2.5">
                <span className="font-mono text-base tracking-widest font-semibold text-[#0B1E16] dark:text-[#E8F0EA]">
                  OCTOBERFREE
                </span>
                <button
                  onClick={handleCopyAndApply}
                  className="text-[11px] tracking-wider uppercase font-semibold text-[#133E2E] dark:text-[#4AC094] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copied ? (
                    <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
                      <Check className="w-3.5 h-3.5" /> Saved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="w-3.5 h-3.5" /> Copy & Apply
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-3">
              <Button
                onClick={handleShopNow}
                size="lg"
                className="w-full bg-[#133E2E] hover:bg-[#0B1E16] text-[#F4EFE6] dark:bg-[#24664F] dark:hover:bg-[#1B523E] font-medium text-xs rounded-none uppercase tracking-[0.15em] py-6 transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Products & Claim</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>

              <button
                onClick={() => handleOpenChange(false)}
                className="text-[11px] tracking-wider text-[#7A8C81] dark:text-[#889E91] hover:text-[#0B1E16] dark:hover:text-[#F4EFE6] transition-colors font-medium block w-full text-center py-1 uppercase cursor-pointer"
              >
                Continue without discount
              </button>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
