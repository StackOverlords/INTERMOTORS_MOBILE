import React from 'react';

import { DeclarativeList } from '@/shared/components';
import type { DrawerScreenPropsHelper } from '@/navigation';

import { SaleCard } from '../components/SaleCard';
import { useSales } from '../hooks/useSales';
import type { Sale } from '../types/sale.types';

export function SalesListScreen(_props: DrawerScreenPropsHelper<'Sales'>) {
  const { data, isLoading, isFetching, isError, error, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } = useSales();

  const items = data?.pages.flatMap((p) => p.data) ?? [];
  const isRefreshing = isFetching && !isFetchingNextPage && items.length > 0;

  return (
    <DeclarativeList<Sale>
      data={items}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(item) => String(item.id)}
      renderItem={(item) => <SaleCard sale={item} />}
      emptyTitle="Sin ventas"
      emptyMessage="No hay ventas disponibles en este momento."
      onEndReached={() => { if (hasNextPage && !isFetchingNextPage) void fetchNextPage(); }}
      onRefresh={() => void refetch()}
      isRefreshing={isRefreshing}
    />
  );
}
