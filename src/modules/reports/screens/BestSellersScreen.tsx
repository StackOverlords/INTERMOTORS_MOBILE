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

import { useBestSellers } from '../hooks/useBestSellers';
import type { BestSellersFilters, SalesReportItem } from '../types/salesReport.types';

// ---------------------------------------------------------------------------
// Filter field config — fecha_inicio required, fecha_fin optional,
// ranking required (numeric keyboard via type: 'number')
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
  {
    key: 'ranking',
    label: 'Top N productos',
    type: 'number',
    placeholder: 'Ej: 10',
    enabled: true,
    toggleable: false,
  },
];

// ---------------------------------------------------------------------------
// List field definitions
// ---------------------------------------------------------------------------
const BEST_SELLERS_FIELDS = defineListFields<SalesReportItem>([
  { key: 'producto',      label: 'Producto',    accessor: (i) => i.producto },
  { key: 'sucursal',      label: 'Sucursal',    accessor: (i) => i.sucursal },
  { key: 'cantidad',      label: 'Cantidad',    accessor: (i) => i.cantidad },
  { key: 'total',         label: 'Total',       accessor: (i) => i.total,    variant: 'currency' },
]);

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------
function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function firstOfMonthISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

const DEFAULT_RANKING = 10;

const DEFAULT_FILTERS: BestSellersFilters = {
  fecha_inicio: firstOfMonthISO(),
  fecha_fin: todayISO(),
  ranking: DEFAULT_RANKING,
};

// ---------------------------------------------------------------------------
// BestSellersScreen
// ---------------------------------------------------------------------------
export function BestSellersScreen(): React.JSX.Element {
  const sheetRef = useRef<BottomSheetModal>(null);

  const [filterValues, setFilterValues] = useState<FilterValues>({
    fecha_inicio: DEFAULT_FILTERS.fecha_inicio,
    fecha_fin: DEFAULT_FILTERS.fecha_fin,
    ranking: String(DEFAULT_RANKING),
  });

  // Pre-initialized with default range so the query fires on mount.
  const [submittedFilters, setSubmittedFilters] = useState<BestSellersFilters | null>(DEFAULT_FILTERS);

  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useBestSellers(submittedFilters);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleApply = useCallback((values: FilterValues) => {
    setFilterValues(values);

    if (!values.fecha_inicio?.trim()) {
      setValidationMessage('La fecha de inicio es obligatoria.');
      return;
    }

    const rankingRaw = values.ranking?.trim();
    const rankingNum = rankingRaw ? parseInt(rankingRaw, 10) : NaN;

    if (!rankingRaw || isNaN(rankingNum) || rankingNum < 1) {
      setValidationMessage('El ranking debe ser un número mayor o igual a 1.');
      return;
    }

    setValidationMessage(null);
    setSubmittedFilters({
      fecha_inicio: values.fecha_inicio.trim(),
      fecha_fin: values.fecha_fin?.trim() || undefined,
      ranking: rankingNum,
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilterValues({
      fecha_inicio: DEFAULT_FILTERS.fecha_inicio,
      fecha_fin: DEFAULT_FILTERS.fecha_fin,
      ranking: String(DEFAULT_RANKING),
    });
    setSubmittedFilters(DEFAULT_FILTERS);
    setValidationMessage(null);
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
            title="Más Vendidos"
            message="Ingresá un rango de fechas y el número de productos (ranking) para ver resultados."
          />

          {validationMessage && (
            <Box
              marginTop="s"
              backgroundColor="dangerBackground"
              borderRadius="m"
              paddingHorizontal="m"
              paddingVertical="s"
            >
              <Text color="danger" style={{ fontSize: 13, textAlign: 'center' }}>
                {validationMessage}
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
      fields={BEST_SELLERS_FIELDS}
      filterFields={FILTER_FIELDS}
      filterValues={filterValues}
      onFilterChange={handleApply}
      onResetFilters={handleResetFilters}
      emptyTitle="Sin resultados"
      emptyMessage="No hay productos vendidos para el período y ranking seleccionados."
    />
  );
}
