import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DeclarativeList } from '@/shared/components';
import { useListFilters } from '@/shared/hooks/useListFilters';
import type { QuotationsStackParamList } from '@/navigation/types';

import { QuotationCard } from '../components/QuotationCard';
import { useQuotations } from '../hooks/useQuotations';
import { DEFAULT_QUOTATIONS_FILTERS } from '../types/quotation.types';
import type { Quotation, QuotationsFilters } from '../types/quotation.types';

export function QuotationsListScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<QuotationsStackParamList>>();
  const filters = useListFilters<QuotationsFilters>();

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
  } = useQuotations(filters.activeFilters);

  const items = data?.pages.flatMap((p) => p.data) ?? [];
  const isRefreshing = isFetching && !isFetchingNextPage && items.length > 0;

  return (
    <DeclarativeList<Quotation>
      data={items}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(item) => String(item.id)}
      renderItem={(item) => (
        <QuotationCard
          quotation={item}
          onPress={() => navigation.navigate('QuotationDetail', { id: item.id, nro: item.nro_cotizacion })}
        />
      )}
      filterFields={DEFAULT_QUOTATIONS_FILTERS}
      filterValues={filters.activeFilters}
      onFilterChange={filters.handleChange}
      onResetFilters={filters.handleClear}
      emptyTitle="Sin cotizaciones"
      emptyMessage="No hay cotizaciones disponibles."
      onEndReached={() => { if (hasNextPage && !isFetchingNextPage) void fetchNextPage(); }}
      onRefresh={() => void refetch()}
      isRefreshing={isRefreshing}
    />
  );
}
