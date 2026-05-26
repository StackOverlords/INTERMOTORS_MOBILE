import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';

import { quotationsService } from '../services/quotations.service';
import type { QuotationsFilters } from '../types/quotation.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// useQuotations — paginated list of quotations for the selected branch.
// Filters change → queryKey changes → React Query resets to page 1 automatically.
// Guard: query disabled when selectedBranchId is null.
// ---------------------------------------------------------------------------
export function useQuotations(filters: QuotationsFilters = {}) {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);

  return useInfiniteQuery({
    queryKey: ['quotations', sucursalId, filters],
    queryFn: ({ pageParam }) => quotationsService.getQuotations(sucursalId!, pageParam, PAGE_SIZE, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((acc, p) => acc + p.data.length, 0);
      return loadedCount < lastPage.meta.total ? allPages.length + 1 : undefined;
    },
    enabled: sucursalId !== null,
  });
}

// ---------------------------------------------------------------------------
// useQuotation — single quotation by id
// ---------------------------------------------------------------------------
export function useQuotation(id: number) {
  return useQuery({
    queryKey: ['quotations', id],
    queryFn: () => quotationsService.getQuotationById(id),
  });
}
