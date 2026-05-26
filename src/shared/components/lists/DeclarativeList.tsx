import React, { useCallback, useRef } from 'react';
import { FlatList, Pressable } from 'react-native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

import { Box, Text } from '@/themes';
import { EmptyState, ErrorState, LoadingState, Spinner } from '@/shared/components';
import { FilterBottomSheet } from '@/shared/components/FilterBottomSheet/FilterBottomSheet';
import type { FilterFieldConfig, FilterValues, SelectOption } from '@/shared/types/filter.types';

import { GenericFilterChips } from '../filters/GenericFilterChips';
import { DataCard } from './DataCard';
import type { ListFieldConfig } from './defineListFields';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type DeclarativeListBase<T> = {
  data: T[];
  isLoading?: boolean;
  error?: Error | null;
  keyExtractor: (item: T, index: number) => string;
  filterFields?: FilterFieldConfig[];
  filterValues?: FilterValues;
  onFilterChange?: (values: FilterValues) => void;
  onResetFilters?: () => void;
  resolveLabel?: (field: FilterFieldConfig, value: string) => string;
  filterOptionalMap?: Record<string, SelectOption[]>;
  onEndReached?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  loadingMessage?: string;
};

type RenderVariant<T> =
  | { fields: ListFieldConfig<T>[]; renderItem?: never }
  | { fields?: never; renderItem: (item: T) => React.ReactNode };

export type DeclarativeListProps<T> = DeclarativeListBase<T> & RenderVariant<T>;

// ---------------------------------------------------------------------------
// Toolbar — filter count + open-sheet trigger
// ---------------------------------------------------------------------------
function Toolbar({ count, onOpenSheet }: { count: number; onOpenSheet: () => void }) {
  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="m"
      paddingVertical="s"
    >
      <Text variant="caption" color="textSecondary">
        {count} ítems
      </Text>
      <Pressable onPress={onOpenSheet} hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}>
        <Text color="primary" style={{ fontSize: 13, fontWeight: '500' }}>
          Filtros
        </Text>
      </Pressable>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// DeclarativeList — coordinator
// ---------------------------------------------------------------------------
export function DeclarativeList<T>(props: DeclarativeListProps<T>) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const openSheet = useCallback(() => { sheetRef.current?.present(); }, []);

  const {
    data = [],
    isLoading = false,
    error = null,
    keyExtractor,
    filterFields,
    filterValues,
    onFilterChange,
    onResetFilters,
    resolveLabel,
    filterOptionalMap = {},
    onEndReached,
    onRefresh,
    isRefreshing = false,
    emptyTitle = 'Sin resultados',
    emptyMessage,
    loadingMessage = 'Cargando…',
  } = props;

  const hasFilters = !!filterFields;
  const hasActive =
    filterValues != null &&
    Object.values(filterValues).some(v => v !== undefined && v !== '');

  if (isLoading && data.length === 0 && !error) {
    return (
      <Box flex={1} backgroundColor="background">
        {hasFilters && <Toolbar count={0} onOpenSheet={openSheet} />}
        {hasFilters && hasActive && filterFields && filterValues && (
          <GenericFilterChips
            fields={filterFields}
            values={filterValues}
            resolveLabel={resolveLabel}
            onRemove={key => onFilterChange?.({ ...filterValues, [key]: undefined })}
          />
        )}
        <LoadingState message={loadingMessage} />
        {hasFilters && filterFields && filterValues && (
          <FilterBottomSheet
            bottomSheetRef={sheetRef as React.RefObject<BottomSheetModal>}
            fields={filterFields}
            values={filterValues}
            optionsMap={filterOptionalMap}
            onChange={v => onFilterChange?.(v)}
            onClear={() => onResetFilters?.()}
          />
        )}
      </Box>
    );
  }

  return (
    <Box flex={1} backgroundColor="background">
      {hasFilters && <Toolbar count={data.length} onOpenSheet={openSheet} />}

      {hasFilters && hasActive && filterFields && filterValues && (
        <GenericFilterChips
          fields={filterFields}
          values={filterValues}
          resolveLabel={resolveLabel}
          onRemove={key => onFilterChange?.({ ...filterValues, [key]: undefined })}
        />
      )}

      {error ? (
        <ErrorState title="Error" message={error.message} onRetry={onRefresh} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => {
            const { fields, renderItem: customRenderItem } = props;
            if (fields) return <DataCard item={item} fields={fields} />;
            return <>{customRenderItem!(item)}</>;
          }}
          onEndReached={onEndReached}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
          ListEmptyComponent={<EmptyState title={emptyTitle} message={emptyMessage} />}
          ListFooterComponent={
            isLoading && data.length > 0
              ? <Spinner size="small" paddingVertical={16} />
              : null
          }
          contentContainerStyle={data.length === 0 ? { flex: 1 } : { paddingVertical: 8 }}
        />
      )}

      {hasFilters && filterFields && filterValues && (
        <FilterBottomSheet
          bottomSheetRef={sheetRef as React.RefObject<BottomSheetModal>}
          fields={filterFields}
          values={filterValues}
          optionsMap={filterOptionalMap}
          onChange={v => onFilterChange?.(v)}
          onClear={() => onResetFilters?.()}
        />
      )}
    </Box>
  );
}
