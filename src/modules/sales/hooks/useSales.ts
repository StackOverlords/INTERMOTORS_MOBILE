import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';

import { salesService } from '../services/sales.service';
import type { SalesFilters } from '../types/sale.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// useSales — paginated list of sales for the selected branch.
// Filters change → queryKey changes → React Query resets to page 1 automatically.
// Guard: query disabled when selectedBranchId is null.
// ---------------------------------------------------------------------------
export function useSales(filters: SalesFilters = {}) {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);

  return useInfiniteQuery({
    queryKey: ['sales', sucursalId, filters],
    queryFn: ({ pageParam }) => salesService.getSales(sucursalId!, pageParam, PAGE_SIZE, filters),
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
