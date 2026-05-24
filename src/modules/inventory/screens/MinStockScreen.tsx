import React from 'react';

import { DeclarativeList, ErrorState, ScreenLayout } from '@/shared/components';
import type { FilterFieldConfig } from '@/shared/types/filter.types';
import { defineListFields } from '@/shared/components/lists/defineListFields';

import { useMinStock } from '../hooks/useMinStock';
import { useMinStockFilters } from '../hooks/useInventoryFilters';
import type { StockMinimoItem } from '../types/inventory.types';

// ---------------------------------------------------------------------------
// Filter config
// ---------------------------------------------------------------------------
const MIN_STOCK_FILTER_FIELDS: FilterFieldConfig[] = [
  { key: 'parametro',                              label: 'Buscar producto',           type: 'text',    placeholder: 'Nombre o código…', enabled: true,  toggleable: false },
  { key: 'ver_solo_con_saldo_menorigual_al_minimo', label: 'Solo menores al mínimo',   type: 'boolean',                                  enabled: false, toggleable: true  },
];

// ---------------------------------------------------------------------------
// List fields
// ---------------------------------------------------------------------------
const MIN_STOCK_FIELDS = defineListFields<StockMinimoItem>([
  { key: 'codigo',       label: 'Código',       accessor: (i) => i.codigo },
  { key: 'producto',     label: 'Producto',     accessor: (i) => i.producto },
  { key: 'stock_actual', label: 'Stock actual', accessor: (i) => i.stock_actual },
  { key: 'stock_minimo', label: 'Stock mínimo', accessor: (i) => i.stock_minimo },
  { key: 'diferencia',   label: 'Diferencia',   accessor: (i) => i.diferencia },
]);

// ---------------------------------------------------------------------------
// MinStockScreen
// ---------------------------------------------------------------------------
export function MinStockScreen(): React.JSX.Element {
  const filters = useMinStockFilters();
  const { data, isLoading, isError, error, refetch, noBranch } = useMinStock(filters.activeFilters);

  if (noBranch) {
    return (
      <ScreenLayout>
        <ErrorState
          title="Sin sucursal"
          message="Seleccioná una sucursal para ver el stock mínimo."
        />
      </ScreenLayout>
    );
  }

  return (
    <DeclarativeList<StockMinimoItem>
      data={data ?? []}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(item) => item.codigo}
      fields={MIN_STOCK_FIELDS}
      filterFields={MIN_STOCK_FILTER_FIELDS}
      filterValues={filters.activeFilters}
      onFilterChange={filters.handleChange}
      onResetFilters={filters.handleClear}
      onRefresh={() => void refetch()}
      emptyTitle="Sin resultados"
      emptyMessage="No hay artículos con stock mínimo para los filtros seleccionados."
    />
  );
}
