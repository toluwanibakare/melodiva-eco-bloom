import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types/product';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variant?: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string, size?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
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

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const items = get().items;
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'melodiva-cart',
    }
  )
);
