import React, { useState, useEffect } from 'react';
import { api, auth } from '@/lib/api';
import { demoStore } from '@/lib/demoStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShoppingBag, X, Tag, UserCheck, Power } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/hooks/use-toast';

export const DemoBanner: React.FC = () => {
  const { toast } = useToast();
  const { addItem, items } = useCartStore();
  const [isDemo, setIsDemo] = useState(demoStore.isDemoActive());
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const handleAuthChange = () => {
      setIsDemo(demoStore.isDemoActive());
    };
    const unsubscribe = auth.onAuthStateChange(() => {
      handleAuthChange();
    });
    return () => {
      unsubscribe.data.subscription.unsubscribe();
    };
  }, []);

  const handleEnableDemo = () => {
    api.enableDemoMode();
    setIsDemo(true);
    auth.notify('SIGNED_IN', { user: demoStore.getDemoProfile() });
    toast({
      title: 'Demo Mode Activated! ⚡',
      description: 'Logged in as Demo User. Address & profile pre-filled. Code: MELODIVA10 for 10% OFF.',
    });
  };

  const handleDisableDemo = () => {
    api.disableDemoMode();
    setIsDemo(false);
    auth.notify('SIGNED_OUT', null);
    toast({
      title: 'Demo Mode Disabled',
      description: 'Restored standard session mode.',
    });
  };

  const handleAddDemoItems = () => {
    addItem({
      id: 'black-soap-exquisite-500',
      name: 'Black Soap - Exquisite (500g)',
      price: 4500,
      image: '/assets/bs_et-500.jpg',
      size: '500g',
      type: 'black-soap',
      variant: 'Exquisite',
    });
    addItem({
      id: 'kernel-oil-500',
      name: 'Pure Kernel Oil (500ml)',
      price: 2800,
      image: '/assets/ke_500.jpg',
      size: '500ml',
      type: 'kernel-oil',
    });
    toast({
      title: 'Demo Items Added to Cart 🛒',
      description: '500g Exquisite Black Soap & 500ml Kernel Oil added to your shopping cart!',
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Code Copied! 📋',
      description: `Promo code ${code} copied. Paste at checkout for 10% discount!`,
    });
  };

  if (!isDemo) {
    return (
      <div className="bg-gradient-to-r from-emerald-700 via-primary to-emerald-800 text-white text-xs font-medium py-2 px-4 shadow-md border-b border-emerald-600/30">
        <div className="container mx-auto max-w-[1600px] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
            <span>
              <strong>Vercel Live Preview Mode:</strong> Test full app flow without signing up!
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleEnableDemo}
              size="sm"
              className="h-7 text-[11px] font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all rounded-full px-3 shadow-sm"
            >
              <UserCheck className="w-3 h-3 mr-1" />
              1-Click Demo Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-bounce">
        <Button
          onClick={() => setMinimized(false)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-2xl px-4 py-2 flex items-center gap-2 border-2 border-emerald-400"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Demo Controls</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border-2 border-emerald-500/50 backdrop-blur-md animate-fade-in-up">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500 text-slate-950 font-black text-[10px] uppercase">
            ⚡ Demo Active
          </Badge>
          <span className="text-xs font-bold text-slate-200">Melodiva Demo User</span>
        </div>
        <button
          onClick={() => setMinimized(true)}
          className="text-slate-400 hover:text-white transition-colors"
          title="Minimize Demo Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-2.5 space-y-2 text-xs text-slate-300">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="flex items-center gap-1.5 font-mono text-amber-300 font-bold">
            <Tag className="w-3.5 h-3.5 text-amber-400" /> MELODIVA10
          </span>
          <button
            onClick={() => handleCopyCode('MELODIVA10')}
            className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-md hover:bg-amber-400/30 transition-all"
          >
            Copy Code
          </button>
        </div>

        <p className="text-[11px] text-slate-400 leading-tight">
          Checkout, order history, tracking & affiliate dashboard are pre-filled for testing.
        </p>
      </div>

      <div className="pt-2 flex items-center gap-2">
        <Button
          onClick={handleAddDemoItems}
          size="sm"
          className="flex-1 h-8 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add Test Cart</span>
        </Button>

        <Button
          onClick={handleDisableDemo}
          size="sm"
          variant="outline"
          className="h-8 text-[11px] font-bold border-red-500/40 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl gap-1"
          title="Disable Demo Mode"
        >
          <Power className="w-3.5 h-3.5" />
          <span>Disable</span>
        </Button>
      </div>
    </div>
  );
};
