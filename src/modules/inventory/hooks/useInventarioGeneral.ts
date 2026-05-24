import { useInfiniteQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';

import { inventoryService } from '../services/inventory.service';
import type { InventoryFilterValues } from '../types/inventory.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// todayISO — returns today's date in YYYY-MM-DD format (device local time).
// Used as the default `fecha` when no filter is applied.
// ---------------------------------------------------------------------------
function todayISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ---------------------------------------------------------------------------
// useInventarioGeneral — paginated general inventory report.
// Reads selectedBranchId from authStore; query is disabled when null.
// Filter strings are parsed to their correct API types before the request.
// ---------------------------------------------------------------------------
export function useInventarioGeneral(filters: InventoryFilterValues = {}) {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);

  return useInfiniteQuery({
    queryKey: ['inventory-general', sucursalId, filters],
    queryFn: ({ pageParam }) => {
      // Parse filter strings → API types
      const sucursal = filters.sucursal ? Number(filters.sucursal) : (sucursalId ?? undefined);
      const categoria = filters.categoria ? Number(filters.categoria) : undefined;
      const incluir_transito = filters.incluir_transito === 'true' ? true : undefined;
      const ver_solo_con_movimiento = filters.ver_solo_con_movimiento === 'true' ? true : undefined;
      const fecha = filters.fecha ?? todayISO();

      return inventoryService.getGeneral(
        {
          fecha,
          sucursal,
          categoria,
          pagina_registros: PAGE_SIZE,
          incluir_transito,
          ver_solo_con_movimiento,
        },
        pageParam,
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.total_paginas ? nextPage : undefined;
    },
    enabled: sucursalId !== null,
  });
}
