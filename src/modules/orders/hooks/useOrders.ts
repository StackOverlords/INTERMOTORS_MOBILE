import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';

import { ordersService } from '../services/orders.service';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// useOrders — paginated list of orders for the selected branch.
// Guard: query disabled when selectedBranchId is null.
// ---------------------------------------------------------------------------
export function useOrders() {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);

  return useInfiniteQuery({
    queryKey: ['orders', sucursalId],
    queryFn: ({ pageParam }) => ordersService.getOrders(sucursalId!, pageParam, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((acc, p) => acc + p.data.length, 0);
      return loadedCount < lastPage.meta.total ? allPages.length + 1 : undefined;
    },
    enabled: sucursalId !== null,
  });
}

// ---------------------------------------------------------------------------
// useOrder — single order by id
// ---------------------------------------------------------------------------
export function useOrder(id: number) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersService.getOrderById(id),
  });
}
