import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';

import { purchasesService } from '../services/purchases.service';
import type { PurchasesFilters } from '../types/purchase.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// usePurchases — paginated list of purchases for the selected branch.
// Filters change → queryKey changes → React Query resets to page 1 automatically.
// Guard: query disabled when selectedBranchId is null.
// ---------------------------------------------------------------------------
export function usePurchases(filters: PurchasesFilters = {}) {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);

  return useInfiniteQuery({
    queryKey: ['purchases', sucursalId, filters],
    queryFn: ({ pageParam }) => purchasesService.getPurchases(sucursalId!, pageParam, PAGE_SIZE, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.meta.last_page ? nextPage : undefined;
    },
    enabled: sucursalId !== null,
  });
}

// ---------------------------------------------------------------------------
// usePurchase — single purchase by id
// ---------------------------------------------------------------------------
export function usePurchase(id: number) {
  return useQuery({
    queryKey: ['purchases', id],
    queryFn: () => purchasesService.getPurchaseById(id),
  });
}
