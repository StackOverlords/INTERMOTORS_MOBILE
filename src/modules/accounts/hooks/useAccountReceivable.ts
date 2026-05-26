import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';

import { accountReceivableService } from '../services/account-receivable.service';
import type { AccountReceivableFilters } from '../types/account-receivable.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// useAccountReceivable — infinite-scrollable list of accounts receivable.
// Filters change → queryKey changes → React Query resets to page 1 automatically.
// Guard: query disabled when selectedBranchId is null.
// ---------------------------------------------------------------------------
export function useAccountReceivable(filters: AccountReceivableFilters = {}) {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);

  return useInfiniteQuery({
    queryKey: ['account-receivable', sucursalId, filters],
    queryFn: ({ pageParam }) =>
      accountReceivableService.getList(sucursalId!, pageParam, PAGE_SIZE, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((acc, p) => acc + p.data.length, 0);
      return loadedCount < lastPage.total ? allPages.length + 1 : undefined;
    },
    enabled: sucursalId !== null,
  });
}

// ---------------------------------------------------------------------------
// useAccountReceivablePayments — payment history for a single sale.
// ---------------------------------------------------------------------------
export function useAccountReceivablePayments(idVenta: number) {
  return useQuery({
    queryKey: ['account-receivable-payments', idVenta],
    queryFn: () => accountReceivableService.getPayments(idVenta),
  });
}
