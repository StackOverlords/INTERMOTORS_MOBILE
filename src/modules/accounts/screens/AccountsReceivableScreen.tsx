import React from 'react';

import { DeclarativeList } from '@/shared/components';
import { useListFilters } from '@/shared/hooks/useListFilters';
import type { DrawerScreenPropsHelper } from '@/navigation';

import { AccountReceivableCard } from '../components';
import { useAccountReceivable } from '../hooks/useAccountReceivable';
import {
  DEFAULT_AR_FILTERS,
  ESTADO_PAGO_OPTIONS,
  TIPO_PAGO_OPTIONS,
} from '../types/account-receivable.types';
import type { AccountReceivable, AccountReceivableFilters } from '../types/account-receivable.types';

// ---------------------------------------------------------------------------
// AccountsReceivableScreen
// Paginated, filterable list of accounts receivable.
// Connects to GET /account-receivable via useAccountReceivable.
// ---------------------------------------------------------------------------
export function AccountsReceivableScreen(
  _props: DrawerScreenPropsHelper<'AccountsReceivable'>,
): React.JSX.Element {
  const filters = useListFilters<AccountReceivableFilters>();

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
  } = useAccountReceivable(filters.activeFilters);

  const items = data?.pages.flatMap((p) => p.data) ?? [];
  const isRefreshing = isFetching && !isFetchingNextPage && items.length > 0;

  return (
    <DeclarativeList<AccountReceivable>
      data={items}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(item) => String(item.id)}
      renderItem={(item) => <AccountReceivableCard item={item} />}
      filterFields={DEFAULT_AR_FILTERS}
      filterValues={filters.activeFilters}
      onFilterChange={filters.handleChange}
      onResetFilters={filters.handleClear}
      filterOptionalMap={{
        estado_pago: ESTADO_PAGO_OPTIONS,
        tipo_pago: TIPO_PAGO_OPTIONS,
      }}
      emptyTitle="Sin cuentas"
      emptyMessage="No hay cuentas por cobrar disponibles."
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
      }}
      onRefresh={() => void refetch()}
      isRefreshing={isRefreshing}
    />
  );
}
