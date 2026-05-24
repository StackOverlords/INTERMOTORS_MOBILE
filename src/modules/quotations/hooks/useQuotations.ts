import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';

import { quotationsService } from '../services/quotations.service';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// useQuotations — paginated list of quotations for the selected branch.
// Guard: query disabled when selectedBranchId is null.
// ---------------------------------------------------------------------------
export function useQuotations() {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);

  return useInfiniteQuery({
    queryKey: ['quotations', sucursalId],
    queryFn: ({ pageParam }) => quotationsService.getQuotations(sucursalId!, pageParam, PAGE_SIZE),
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
