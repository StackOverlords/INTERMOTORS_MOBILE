import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';

import { salesService } from '../services/sales.service';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// useSales — paginated list of sales for the selected branch.
// Guard: query disabled when selectedBranchId is null.
// ---------------------------------------------------------------------------
export function useSales() {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);

  return useInfiniteQuery({
    queryKey: ['sales', sucursalId],
    queryFn: ({ pageParam }) => salesService.getSales(sucursalId!, pageParam, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.meta.last_page ? nextPage : undefined;
    },
    enabled: sucursalId !== null,
  });
}

// ---------------------------------------------------------------------------
// useSale — single sale by id
// ---------------------------------------------------------------------------
export function useSale(id: number) {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: () => salesService.getSaleById(id),
  });
}
