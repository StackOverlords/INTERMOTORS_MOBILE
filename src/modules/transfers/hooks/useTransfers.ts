import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';

import { transfersService } from '../services/transfers.service';

// ---------------------------------------------------------------------------
// useTransfers — full list of transfers for the selected branch.
// Guard: query disabled when selectedBranchId is null.
// ---------------------------------------------------------------------------
export function useTransfers() {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);

  return useQuery({
    queryKey: ['transfers', sucursalId],
    queryFn: () => transfersService.getTransfers(sucursalId!, 1, 50),
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
