import React, { useCallback, useRef, useState } from 'react';
import { Pressable, Text as RNText } from 'react-native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

import { Box, Text } from '@/themes';
import {
  DeclarativeList,
  EmptyState,
  ScreenLayout,
  defineListFields,
} from '@/shared/components';
import { FilterBottomSheet } from '@/shared/components/FilterBottomSheet/FilterBottomSheet';
import type { FilterFieldConfig, FilterValues } from '@/shared/types/filter.types';

import { useSalesReport } from '../hooks/useSalesReport';
import type { SalesReportFilters, SalesReportItem } from '../types/salesReport.types';

// ---------------------------------------------------------------------------
// Filter field config — fecha_inicio required, fecha_fin optional
// ---------------------------------------------------------------------------
const FILTER_FIELDS: FilterFieldConfig[] = [
  {
    key: 'fecha_inicio',
    label: 'Fecha inicio',
    type: 'date',
    placeholder: 'YYYY-MM-DD',
    enabled: true,
    toggleable: false,
  },
  {
    key: 'fecha_fin',
    label: 'Fecha fin',
    type: 'date',
    placeholder: 'YYYY-MM-DD',
    enabled: true,
    toggleable: false,
  },
];

// ---------------------------------------------------------------------------
// List field definitions
// ---------------------------------------------------------------------------
const SALES_REPORT_FIELDS = defineListFields<SalesReportItem>([
  { key: 'producto',      label: 'Producto',    accessor: (i) => i.producto },
  { key: 'sucursal',      label: 'Sucursal',    accessor: (i) => i.sucursal },
  { key: 'cantidad',      label: 'Cantidad',    accessor: (i) => i.cantidad },
  { key: 'total',         label: 'Total',       accessor: (i) => i.total,    variant: 'currency' },
]);

// ---------------------------------------------------------------------------
// Date helpers — produce YYYY-MM-DD strings in device local time
// ---------------------------------------------------------------------------
function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function firstOfMonthISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

const DEFAULT_FILTERS: SalesReportFilters = {
  fecha_inicio: firstOfMonthISO(),
  fecha_fin: todayISO(),
};

// ---------------------------------------------------------------------------
// SalesReportScreen
// ---------------------------------------------------------------------------
export function SalesReportScreen(): React.JSX.Element {
  const sheetRef = useRef<BottomSheetModal>(null);

  const [filterValues, setFilterValues] = useState<FilterValues>({
    fecha_inicio: DEFAULT_FILTERS.fecha_inicio,
    fecha_fin: DEFAULT_FILTERS.fecha_fin,
  });

  // Pre-initialized with default range so the query fires on mount.
  const [submittedFilters, setSubmittedFilters] = useState<SalesReportFilters | null>(DEFAULT_FILTERS);

  const [showValidationHint, setShowValidationHint] = useState(false);

  const { data, isLoading, isError, error } = useSalesReport(submittedFilters);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleApply = useCallback((values: FilterValues) => {
    setFilterValues(values);

    if (!values.fecha_inicio?.trim()) {
      setShowValidationHint(true);
      return;
    }

    setShowValidationHint(false);
    setSubmittedFilters({
      fecha_inicio: values.fecha_inicio.trim(),
      fecha_fin: values.fecha_fin?.trim() || undefined,
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilterValues({
      fecha_inicio: DEFAULT_FILTERS.fecha_inicio,
      fecha_fin: DEFAULT_FILTERS.fecha_fin,
    });
    setSubmittedFilters(DEFAULT_FILTERS);
    setShowValidationHint(false);
  }, []);

  const openSheet = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  // -------------------------------------------------------------------------
  // Idle state — no query submitted yet; show prompt + filter button
  // -------------------------------------------------------------------------
  if (submittedFilters === null) {
    return (
      <ScreenLayout>
        <Box flex={1} alignItems="center" justifyContent="center" padding="l">
          <EmptyState
            title="Reporte de Ventas"
            message="Seleccioná un rango de fechas y tocá Filtros para ver resultados."
          />

          {showValidationHint && (
            <Box
              marginTop="s"
              backgroundColor="dangerBackground"
              borderRadius="m"
              paddingHorizontal="m"
              paddingVertical="s"
            >
              <Text color="danger" style={{ fontSize: 13, textAlign: 'center' }}>
                La fecha de inicio es obligatoria.
              </Text>
            </Box>
          )}

          <Pressable onPress={openSheet} style={{ marginTop: 16 }}>
            <Box
              backgroundColor="primary"
              borderRadius="m"
              paddingHorizontal="xl"
              alignItems="center"
              justifyContent="center"
              style={{ height: 44 }}
            >
              <RNText style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                Filtros
              </RNText>
            </Box>
          </Pressable>
        </Box>

        <FilterBottomSheet
          bottomSheetRef={sheetRef as React.RefObject<BottomSheetModal>}
          fields={FILTER_FIELDS}
          values={filterValues}
          onChange={handleApply}
          onClear={handleResetFilters}
        />
      </ScreenLayout>
    );
  }

  // -------------------------------------------------------------------------
  // Results view — query is active; DeclarativeList manages its own sheet
  // -------------------------------------------------------------------------
  return (
    <DeclarativeList<SalesReportItem>
      data={data ?? []}
      isLoading={isLoading}
      error={isError ? (error as Error) : null}
      keyExtractor={(item) => `${item.sucursal}-${item.codigo}`}
      fields={SALES_REPORT_FIELDS}
      filterFields={FILTER_FIELDS}
      filterValues={filterValues}
      onFilterChange={handleApply}
      onResetFilters={handleResetFilters}
      emptyTitle="Sin resultados"
      emptyMessage="No hay ventas para el período seleccionado."
    />
  );
}
