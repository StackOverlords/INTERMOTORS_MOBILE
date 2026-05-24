import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';

import { inventoryService } from '../services/inventory.service';
import type { MinStockFilterValues } from '../types/inventory.types';

// ---------------------------------------------------------------------------
// useMinStock — full minimum-stock report for the selected branch.
// NOT paginated — the server returns all records at once.
//
// Returns a `noBranch` flag when selectedBranchId is null so the screen can
// render an appropriate ErrorState instead of an empty list.
// ---------------------------------------------------------------------------
export function useMinStock(filters: MinStockFilterValues = {}) {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);
  const noBranch = sucursalId === null;

  const query = useQuery({
    queryKey: ['inventory-minstock', sucursalId, filters],
    queryFn: () => {
      // Parse filter strings → API types
      const parametro = filters.parametro ?? undefined;
      const ver_solo_con_saldo = filters.ver_solo_con_saldo_menorigual_al_minimo === 'true'
        ? true
        : undefined;

      return inventoryService.getMinStock({
        sucursal: sucursalId!,
        parametro,
        ver_solo_con_saldo_menorigual_al_minimo: ver_solo_con_saldo,
      });
    },
    enabled: !noBranch,
  });

  return { ...query, noBranch };
}
