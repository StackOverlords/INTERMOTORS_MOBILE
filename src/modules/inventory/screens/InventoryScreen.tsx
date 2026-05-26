import React from 'react';

import { DeclarativeList } from '@/shared/components';
import { useCategories } from '@/shared/hooks/useCategories';
import type { FilterFieldConfig } from '@/shared/types/filter.types';

import { useInventarioGeneral } from '../hooks/useInventarioGeneral';
import { useInventoryFilters } from '../hooks/useInventoryFilters';
import type { InventarioItem } from '../types/inventory.types';
import { InventarioCard } from '../components/InventarioCard';

// ---------------------------------------------------------------------------
// Filter config
// ---------------------------------------------------------------------------
const INVENTORY_FILTER_FIELDS: FilterFieldConfig[] = [
  { key: 'fecha',                   label: 'Fecha',           type: 'date',    placeholder: 'YYYY-MM-DD', enabled: true,  toggleable: false },
  { key: 'sucursal',                label: 'Sucursal',        type: 'select',                             enabled: true,  toggleable: false },
  { key: 'categoria',               label: 'Categoría',       type: 'select',                             enabled: true,  toggleable: false },
  { key: 'incluir_transito',        label: 'Incluir tránsito',      type: 'boolean',                      enabled: false, toggleable: true  },
  { key: 'ver_solo_con_movimiento', label: 'Solo con movimiento',   type: 'boolean',                      enabled: false, toggleable: true  },
];

// ---------------------------------------------------------------------------
// InventoryScreen
// ---------------------------------------------------------------------------
export function InventoryScreen(): React.JSX.Element {
  const filters = useInventoryFilters();
  const { data, isLoading, isFetching, isError, error, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInventarioGeneral(filters.activeFilters);
  const { data: categories } = useCategories();

  const items = data?.pages.flatMap((p) => p.data) ?? [];
  const isRefreshing = isFetching && !isFetchingNextPage && items.length > 0;

  return (
    <DeclarativeList<InventarioItem>
      data={items}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(item, index) => `${item.codigo}-${index}`}
      renderItem={(item) => <InventarioCard item={item} />}
      filterFields={INVENTORY_FILTER_FIELDS}
      filterValues={filters.activeFilters}
      onFilterChange={filters.handleChange}
      onResetFilters={filters.handleClear}
      filterOptionalMap={{
        categoria: (categories ?? []).map((c) => ({ label: c.categoria, value: String(c.id) })),
      }}
      onEndReached={() => { if (hasNextPage && !isFetchingNextPage) void fetchNextPage(); }}
      onRefresh={() => void refetch()}
      isRefreshing={isRefreshing}
      emptyTitle="Sin resultados"
      emptyMessage="No hay artículos en el inventario para los filtros seleccionados."
    />
  );
}
