import { create } from 'zustand';

import type { AppNotification, NotificationsStore } from '../types/notification.types';

// ---------------------------------------------------------------------------
// Static seed — replace with API call when the endpoint is ready.
// The store interface (NotificationsStore) stays unchanged.
// ---------------------------------------------------------------------------
const STATIC_NOTIFICATIONS: AppNotification[] = [
  {
    id: '1',
    title: 'Stock bajo',
    body: 'Filtro de aceite: quedan 3 unidades',
    priority: 'high',
    read: false,
    createdAt: '2026-03-13T08:00:00Z',
  },
  {
    id: '2',
    title: 'Pedido aprobado',
    body: 'El pedido #1042 fue aprobado',
    priority: 'medium',
    read: false,
    createdAt: '2026-03-13T09:30:00Z',
  },
  {
    id: '3',
    title: 'Cotización vencida',
    body: 'La cotización #0234 venció ayer',
    priority: 'low',
    read: true,
    createdAt: '2026-03-12T14:00:00Z',
  },
];

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  items: STATIC_NOTIFICATIONS,

  markAsRead: (id) =>
    set((state) => ({
      items: state.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  markAllAsRead: () =>
    set((state) => ({
      items: state.items.map((n) => ({ ...n, read: true })),
    })),

  addNotification: (notification) =>
    set((state) => ({ items: [notification, ...state.items] })),

  removeNotification: (id) =>
    set((state) => ({ items: state.items.filter((n) => n.id !== id) })),
}));

// ---------------------------------------------------------------------------
// Selectors — unread count is derived, never stored as a field.
// ---------------------------------------------------------------------------
export const selectUnreadCount = (state: NotificationsStore): number =>
  state.items.filter((n) => !n.read).length;
