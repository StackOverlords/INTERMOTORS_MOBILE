import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DeclarativeList } from '@/shared/components';
import { useListFilters } from '@/shared/hooks/useListFilters';
import type { PurchasesStackParamList } from '@/navigation/types';

import { PurchaseCard } from '../components/PurchaseCard';
import { usePurchases } from '../hooks/usePurchases';
import { DEFAULT_PURCHASES_FILTERS } from '../types/purchase.types';
import type { Purchase, PurchasesFilters } from '../types/purchase.types';

// ---------------------------------------------------------------------------
// PurchasesListScreen — real implementation backed by GET /purchases
// ---------------------------------------------------------------------------
export function PurchasesListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<PurchasesStackParamList>>();
  const filters = useListFilters<PurchasesFilters>();

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
  } = usePurchases(filters.activeFilters);

  const items = data?.pages.flatMap((p) => p.data) ?? [];
  const isRefreshing = isFetching && !isFetchingNextPage && items.length > 0;

  return (
    <DeclarativeList<Purchase>
      data={items}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(p) => String(p.id)}
      renderItem={(item) => (
        <PurchaseCard
          purchase={item}
          onPress={() => navigation.navigate('PurchaseDetail', { id: item.id, nro: item.nro_compra })}
        />
      )}
      filterFields={DEFAULT_PURCHASES_FILTERS}
      filterValues={filters.activeFilters}
      onFilterChange={filters.handleChange}
      onResetFilters={filters.handleClear}
      emptyTitle="Sin compras"
      emptyMessage="No hay compras disponibles."
      onEndReached={() => { if (hasNextPage && !isFetchingNextPage) void fetchNextPage(); }}
      onRefresh={() => void refetch()}
      isRefreshing={isRefreshing}
    />
  );
}
