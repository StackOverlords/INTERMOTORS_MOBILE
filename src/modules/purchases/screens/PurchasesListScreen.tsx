import React from 'react';

import { DeclarativeList } from '@/shared/components';
import type { DrawerScreenPropsHelper } from '@/navigation';

import { PurchaseCard } from '../components/PurchaseCard';
import { usePurchases } from '../hooks/usePurchases';
import type { Purchase } from '../types/purchase.types';

// ---------------------------------------------------------------------------
// PurchasesListScreen — real implementation backed by GET /purchases
// ---------------------------------------------------------------------------
export function PurchasesListScreen(_props: DrawerScreenPropsHelper<'Purchases'>) {
  const { data, isLoading, isFetching, isError, error, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } = usePurchases();

  const items = data?.pages.flatMap((p) => p.data) ?? [];
  const isRefreshing = isFetching && !isFetchingNextPage && items.length > 0;

  return (
    <DeclarativeList<Purchase>
      data={items}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(p) => String(p.id)}
      renderItem={(item) => <PurchaseCard purchase={item} />}
      emptyTitle="Sin compras"
      emptyMessage="No hay compras disponibles."
      onEndReached={() => { if (hasNextPage && !isFetchingNextPage) void fetchNextPage(); }}
      onRefresh={() => void refetch()}
      isRefreshing={isRefreshing}
    />
  );
}
