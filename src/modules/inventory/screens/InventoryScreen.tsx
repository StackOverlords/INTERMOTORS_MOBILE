import React from 'react';

import { DeclarativeList } from '@/shared/components';
import { useCategories } from '@/shared/hooks/useCategories';
import type { FilterFieldConfig } from '@/shared/types/filter.types';
import { defineListFields } from '@/shared/components/lists/defineListFields';

import { useInventarioGeneral } from '../hooks/useInventarioGeneral';
import { useInventoryFilters } from '../hooks/useInventoryFilters';
import type { InventarioItem } from '../types/inventory.types';

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
// List fields — driven by defineListFields for type safety
// ---------------------------------------------------------------------------
const INVENTORY_FIELDS = defineListFields<InventarioItem>([
  { key: 'codigo',        label: 'Código',         accessor: (i) => i.codigo },
  { key: 'producto',      label: 'Producto',        accessor: (i) => i.producto },
  { key: 'stock',         label: 'Stock',           accessor: (i) => i.stock },
  { key: 'valor',         label: 'Valor',           accessor: (i) => i.valor,          variant: 'currency' },
  { key: 'costo_promedio', label: 'Costo promedio', accessor: (i) => i.costo_promedio,  variant: 'currency' },
]);

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
      fields={INVENTORY_FIELDS}
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
