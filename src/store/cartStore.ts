import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/product';

export interface AppliedCoupon {
  code: string;
  type: 'affiliate' | 'coupon';
  discount_type?: 'fixed' | 'percentage' | 'free_delivery';
  amount?: number;
  min_order_amount?: number;
  expiry_date?: string | null;
}

interface CartStore {
  items: CartItem[];
  affiliateCode: string;
  affiliateDiscount: number;
  appliedCoupon: AppliedCoupon | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variant?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string, size?: string) => void;
  setAffiliateCode: (code: string) => void;
  setAffiliateDiscount: (discount: number) => void;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalWithDiscount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      affiliateCode: '',
      affiliateDiscount: 0,
      appliedCoupon: null,
      
      addItem: (item) => set((state) => {
        const existingIndex = state.items.findIndex(
          (i) => i.productId === item.productId && 
                 i.variant === item.variant && 
                 i.size === item.size
        );

        if (existingIndex > -1) {
          const newItems = [...state.items];
          newItems[existingIndex].quantity += item.quantity;
          return { items: newItems };
        }

        return { items: [...state.items, item] };
      }),

      removeItem: (productId, variant, size) => set((state) => ({
        items: state.items.filter(
          (item) => !(item.productId === productId && 
                     item.variant === variant && 
                     item.size === size)
        ),
      })),

      updateQuantity: (productId, quantity, variant, size) => set((state) => ({
        items: state.items.map((item) =>
          item.productId === productId && 
          item.variant === variant && 
          item.size === size
            ? { ...item, quantity }
            : item
        ),
      })),

      setAffiliateCode: (code) => set({ affiliateCode: code }),

      setAffiliateDiscount: (discount) => set({ affiliateDiscount: discount }),

      setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),

      clearCart: () => set({ items: [], affiliateCode: '', affiliateDiscount: 0, appliedCoupon: null }),

      getTotal: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTotalWithDiscount: () => {
        const total = get().getTotal();
        const discount = get().affiliateDiscount;
        return Math.max(0, total - discount);
      },
    }),
    {
      name: 'melodiva-cart',
    }
  )
);
