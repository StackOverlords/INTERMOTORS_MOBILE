import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DeclarativeList } from '@/shared/components';
import { useListFilters } from '@/shared/hooks/useListFilters';
import type { SalesStackParamList } from '@/navigation/types';

import { SaleCard } from '../components/SaleCard';
import { useSales } from '../hooks/useSales';
import { DEFAULT_SALES_FILTERS } from '../types/sale.types';
import type { Sale, SalesFilters } from '../types/sale.types';

export function SalesListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<SalesStackParamList>>();
  const filters = useListFilters<SalesFilters>();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useSales(filters.activeFilters);

  const items = data?.pages.flatMap((p) => p.data) ?? [];
  const isRefreshing = isFetching && !isFetchingNextPage && items.length > 0;

  return (
    <DeclarativeList<Sale>
      data={items}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(item) => String(item.id)}
      renderItem={(item) => (
        <SaleCard
          sale={item}
          onPress={() => navigation.navigate('SaleDetail', { id: item.id, nro: item.nro_venta })}
        />
      )}
      filterFields={DEFAULT_SALES_FILTERS}
      filterValues={filters.activeFilters}
      onFilterChange={filters.handleChange}
      onResetFilters={filters.handleClear}
      emptyTitle="Sin ventas"
      emptyMessage="No hay ventas disponibles en este momento."
      onEndReached={() => { if (hasNextPage && !isFetchingNextPage) void fetchNextPage(); }}
      onRefresh={() => void refetch()}
      isRefreshing={isRefreshing}
    />
  );
}
