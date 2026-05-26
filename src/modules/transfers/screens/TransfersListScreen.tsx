import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DeclarativeList } from '@/shared/components';
import { useListFilters } from '@/shared/hooks/useListFilters';
import type { TransfersStackParamList } from '@/navigation/types';

import { TransferCard } from '../components/TransferCard';
import { useTransfers } from '../hooks/useTransfers';
import { DEFAULT_TRANSFERS_FILTERS } from '../types/transfer.types';
import type { Transfer, TransfersFilters } from '../types/transfer.types';

export function TransfersListScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<TransfersStackParamList>>();
  const filters = useListFilters<TransfersFilters>();

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
  } = useTransfers(filters.activeFilters);

  const items = data?.pages.flatMap((p) => p.data) ?? [];
  const isRefreshing = isFetching && !isFetchingNextPage && items.length > 0;

  return (
    <DeclarativeList<Transfer>
      data={items}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(t) => String(t.id)}
      renderItem={(item) => (
        <TransferCard
          transfer={item}
          onPress={() => navigation.navigate('TransferDetail', { id: item.id, nro: item.nro_transferencia })}
        />
      )}
      filterFields={DEFAULT_TRANSFERS_FILTERS}
      filterValues={filters.activeFilters}
      onFilterChange={filters.handleChange}
      onResetFilters={filters.handleClear}
      emptyTitle="Sin transferencias"
      emptyMessage="No hay transferencias disponibles."
      onEndReached={() => { if (hasNextPage && !isFetchingNextPage) void fetchNextPage(); }}
      onRefresh={() => void refetch()}
      isRefreshing={isRefreshing}
    />
  );
}
