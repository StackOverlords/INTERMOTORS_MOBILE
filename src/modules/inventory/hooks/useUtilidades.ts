import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';

import { inventoryService } from '../services/inventory.service';
import type { UtilidadesFilterValues } from '../types/inventory.types';

// ---------------------------------------------------------------------------
// useUtilidades — full profitability report for a branch and date range.
// NOT paginated — the server returns all records at once.
//
// Returns:
//   noBranch    — true when selectedBranchId is null
//   noDateRange — true when fecha_inicio or fecha_fin is missing
// The query is disabled in either case; the screen renders appropriate states.
// ---------------------------------------------------------------------------
export function useUtilidades(filters: UtilidadesFilterValues = {}) {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);
  const noBranch = sucursalId === null;
  const noDateRange = !filters.fecha_inicio || !filters.fecha_fin;

  const query = useQuery({
    queryKey: ['inventory-utilidades', sucursalId, filters],
    queryFn: () =>
      inventoryService.getUtilidades({
        sucursal: sucursalId!,
        fecha_inicio: filters.fecha_inicio!,
        fecha_fin: filters.fecha_fin!,
      }),
    enabled: !noBranch && !noDateRange,
  });

  return { ...query, noBranch, noDateRange };
}
