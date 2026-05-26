import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';

import { transfersService } from '../services/transfers.service';
import type { TransfersFilters } from '../types/transfer.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// useTransfers — paginated list of transfers for the selected branch.
// Filters change → queryKey changes → React Query resets to page 1 automatically.
// Guard: query disabled when selectedBranchId is null.
// ---------------------------------------------------------------------------
export function useTransfers(filters: TransfersFilters = {}) {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);

  return useInfiniteQuery({
    queryKey: ['transfers', sucursalId, filters],
    queryFn: ({ pageParam }) =>
      transfersService.getTransfers(sucursalId!, pageParam, PAGE_SIZE, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.meta.last_page ? nextPage : undefined;
    },
    enabled: sucursalId !== null,
  });
}

// ---------------------------------------------------------------------------
// useTransfer — single transfer by id
// ---------------------------------------------------------------------------
export function useTransfer(id: number) {
  return useQuery({
    queryKey: ['transfers', id],
    queryFn: () => transfersService.getTransferById(id),
  });
}
