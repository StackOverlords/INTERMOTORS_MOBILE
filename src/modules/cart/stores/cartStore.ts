import { create } from 'zustand';

import type { CartItem, CartStore } from '../types/cart.types';

// ---------------------------------------------------------------------------
// Static seed — replace this array with API data when the endpoint is ready.
// The store interface (CartStore) stays unchanged.
// ---------------------------------------------------------------------------
const STATIC_ITEMS: CartItem[] = [
  {
    productId: '1',
    productName: 'Filtro de aceite',
    quantity: 2,
    unitPrice: 1500,
    currency: 'ARS',
  },
  {
    productId: '2',
    productName: 'Pastillas de freno',
    quantity: 1,
    unitPrice: 4200,
    currency: 'ARS',
  },
];

export const useCartStore = create<CartStore>((set) => ({
  items: STATIC_ITEMS,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i,
      ),
    })),

  clearCart: () => set({ items: [] }),
}));

// ---------------------------------------------------------------------------
// Selectors — always compute derived state here, never in the component.
// count = sum of quantities, not items.length (1 item qty:3 = count 3)
// ---------------------------------------------------------------------------
export const selectCartCount = (state: CartStore): number =>
  state.items.reduce((acc, item) => acc + item.quantity, 0);
