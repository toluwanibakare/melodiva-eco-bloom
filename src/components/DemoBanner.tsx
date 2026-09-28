import React, { useState, useEffect } from 'react';
import { api, auth } from '@/lib/api';
import { demoStore } from '@/lib/demoStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, X, Tag, Power, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useToast } from '@/hooks/use-toast';

export const DemoBanner: React.FC = () => {
  const { toast } = useToast();
  const { addItem } = useCartStore();
  const [isDemo, setIsDemo] = useState(demoStore.isDemoActive());

  // Default to minimized on mobile screens (< 640px)
  const [minimized, setMinimized] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640;
    }
    return false;
  });

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
      title: 'Demo Items Added',
      description: '500g Exquisite Black Soap & 500ml Kernel Oil added to your cart!',
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: 'Code Copied',
      description: `Promo code ${code} copied. Paste at checkout for 10% discount!`,
    });
  };

  if (!isDemo) {
    return null;
  }

  if (minimized) {
    return (
      <div className="fixed bottom-3 left-3 sm:left-4 z-40">
        <Button
          onClick={() => setMinimized(false)}
          size="sm"
          className="btn-primary text-[11px] font-bold rounded-full shadow-lg px-3 py-1.5 h-8 flex items-center gap-1.5 border border-primary/30"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Demo Controls</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:right-auto sm:left-4 sm:max-w-sm z-50 bg-card border-2 border-primary/40 text-card-foreground p-3.5 rounded-2xl shadow-2xl backdrop-blur-md animate-fade-in">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-black text-[9px] uppercase px-2 py-0.5">
            Demo Mode Active
          </Badge>
          <span className="text-xs font-bold text-foreground truncate max-w-[150px]">Melodiva Demo User</span>
        </div>
        <button
          onClick={() => setMinimized(true)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          title="Minimize Demo Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-2 space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/60 border border-border">
          <span className="flex items-center gap-1.5 font-mono text-primary font-bold text-xs">
            <Tag className="w-3.5 h-3.5" /> MELODIVA10
          </span>
          <button
            onClick={() => handleCopyCode('MELODIVA10')}
            className="text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-md hover:bg-primary/30 transition-all"
          >
            Copy Code
          </button>
        </div>

        <p className="text-[11px] leading-tight">
          Checkout, order history, tracking & affiliate dashboard are pre-filled.
        </p>
      </div>

      <div className="pt-1.5 flex items-center gap-2">
        <Button
          onClick={handleAddDemoItems}
          size="sm"
          className="flex-1 h-8 text-[11px] font-bold btn-primary rounded-xl gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add Test Cart</span>
        </Button>

        <Button
          onClick={handleDisableDemo}
          size="sm"
          variant="outline"
          className="h-8 text-[11px] font-bold border-destructive/40 text-destructive hover:bg-destructive/10 rounded-xl gap-1"
          title="Disable Demo Mode"
        >
          <Power className="w-3.5 h-3.5" />
          <span>Disable</span>
        </Button>
      </div>
    </div>
  );
};
