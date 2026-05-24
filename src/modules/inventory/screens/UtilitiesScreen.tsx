import React from 'react';

import { DeclarativeList, ErrorState, ScreenLayout } from '@/shared/components';
import type { FilterFieldConfig } from '@/shared/types/filter.types';
import { defineListFields } from '@/shared/components/lists/defineListFields';

import { useUtilidades } from '../hooks/useUtilidades';
import { useUtilidadesFilters } from '../hooks/useInventoryFilters';
import type { UtilidadesItem } from '../types/inventory.types';

// ---------------------------------------------------------------------------
// Filter config — fecha_inicio and fecha_fin are both required for the query
// ---------------------------------------------------------------------------
const UTILIDADES_FILTER_FIELDS: FilterFieldConfig[] = [
  { key: 'fecha_inicio', label: 'Fecha inicio', type: 'date', placeholder: 'YYYY-MM-DD', enabled: true, toggleable: false },
  { key: 'fecha_fin',    label: 'Fecha fin',    type: 'date', placeholder: 'YYYY-MM-DD', enabled: true, toggleable: false },
];

// ---------------------------------------------------------------------------
// List fields
// ---------------------------------------------------------------------------
const UTILIDADES_FIELDS = defineListFields<UtilidadesItem>([
  { key: 'codigo',        label: 'Código',         accessor: (i) => i.codigo },
  { key: 'producto',      label: 'Producto',        accessor: (i) => i.producto },
  { key: 'ventas',        label: 'Ventas',          accessor: (i) => i.ventas },
  { key: 'importe_costo', label: 'Costo total',     accessor: (i) => i.importe_costo,  variant: 'currency' },
  { key: 'importe_venta', label: 'Venta total',     accessor: (i) => i.importe_venta,  variant: 'currency' },
  { key: 'utilidad',      label: 'Utilidad',        accessor: (i) => i.utilidad,       variant: 'currency' },
]);

// ---------------------------------------------------------------------------
// UtilitiesScreen
// ---------------------------------------------------------------------------
export function UtilitiesScreen(): React.JSX.Element {
  const filters = useUtilidadesFilters();
  const { data, isLoading, isError, error, refetch, noBranch, noDateRange } =
    useUtilidades(filters.activeFilters);

  if (noBranch) {
    return (
      <ScreenLayout>
        <ErrorState
          title="Sin sucursal"
          message="Seleccioná una sucursal para ver utilidades."
        />
      </ScreenLayout>
    );
  }

  return (
    <DeclarativeList<UtilidadesItem>
      data={data ?? []}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(item) => item.codigo}
      fields={UTILIDADES_FIELDS}
      filterFields={UTILIDADES_FILTER_FIELDS}
      filterValues={filters.activeFilters}
      onFilterChange={filters.handleChange}
      onResetFilters={filters.handleClear}
      onRefresh={() => void refetch()}
      emptyTitle={noDateRange ? 'Rango de fechas requerido' : 'Sin resultados'}
      emptyMessage={noDateRange ? 'Seleccioná un rango de fechas para ver utilidades.' : 'No hay datos de utilidades para el rango seleccionado.'}
    />
  );
}
