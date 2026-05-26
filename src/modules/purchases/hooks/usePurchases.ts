import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';

import { purchasesService } from '../services/purchases.service';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// usePurchases — paginated list of purchases for the selected branch.
// Guard: query disabled when selectedBranchId is null.
// ---------------------------------------------------------------------------
export function usePurchases() {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);

  return useInfiniteQuery({
    queryKey: ['purchases', sucursalId],
    queryFn: ({ pageParam }) => purchasesService.getPurchases(sucursalId!, pageParam, PAGE_SIZE),
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
