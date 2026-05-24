import { useListFilters } from '@/shared/hooks/useListFilters';

import type {
  InventoryFilterValues,
  MinStockFilterValues,
  UtilidadesFilterValues,
} from '../types/inventory.types';

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function firstOfMonthISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

// ---------------------------------------------------------------------------
// useInventoryFilters — typed filter state for the InventarioGeneral screen.
// ---------------------------------------------------------------------------
export function useInventoryFilters() {
  return useListFilters<InventoryFilterValues>();
}

// ---------------------------------------------------------------------------
// useMinStockFilters — typed filter state for the MinStock screen.
// ---------------------------------------------------------------------------
export function useMinStockFilters() {
  return useListFilters<MinStockFilterValues>();
}

// ---------------------------------------------------------------------------
// useUtilidadesFilters — pre-initializes with current month range so the
// query fires immediately on mount without requiring manual filter input.
// ---------------------------------------------------------------------------
export function useUtilidadesFilters() {
  return useListFilters<UtilidadesFilterValues>({
    fecha_inicio: firstOfMonthISO(),
    fecha_fin: todayISO(),
  });
}
