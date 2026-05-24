import React from 'react';

import { DeclarativeList } from '@/shared/components';
import type { DrawerScreenPropsHelper } from '@/navigation';

import { QuotationCard } from '../components/QuotationCard';
import { useQuotations } from '../hooks/useQuotations';
import type { Quotation } from '../types/quotation.types';

export function QuotationsListScreen(
  _props: DrawerScreenPropsHelper<'Quotations'>,
): React.JSX.Element {
  const { data, isLoading, isFetching, isError, error, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } = useQuotations();

  const items = data?.pages.flatMap((p) => p.data) ?? [];
  const isRefreshing = isFetching && !isFetchingNextPage && items.length > 0;

  return (
    <DeclarativeList<Quotation>
      data={items}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(item) => String(item.id)}
      renderItem={(item) => <QuotationCard quotation={item} />}
      emptyTitle="Sin cotizaciones"
      emptyMessage="No hay cotizaciones disponibles."
      onEndReached={() => { if (hasNextPage && !isFetchingNextPage) void fetchNextPage(); }}
      onRefresh={() => void refetch()}
      isRefreshing={isRefreshing}
    />
  );
}
