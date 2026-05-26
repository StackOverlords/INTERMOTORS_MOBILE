import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DeclarativeList } from '@/shared/components';
import { useListFilters } from '@/shared/hooks/useListFilters';
import type { OrdersStackParamList } from '@/navigation/types';

import { OrderCard } from '../components/OrderCard';
import { useOrders } from '../hooks/useOrders';
import {
  DEFAULT_ORDERS_FILTERS,
  SITUACION_ACTUAL_OPTIONS,
} from '../types/order.types';
import type { Order, OrdersFilters } from '../types/order.types';

export function OrdersListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<OrdersStackParamList>>();
  const filters = useListFilters<OrdersFilters>();

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
  } = useOrders(filters.activeFilters);

  const items = data?.pages.flatMap((p) => p.data) ?? [];
  const isRefreshing = isFetching && !isFetchingNextPage && items.length > 0;

  return (
    <DeclarativeList<Order>
      data={items}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(item) => String(item.id)}
      renderItem={(item) => (
        <OrderCard
          order={item}
          onPress={() => navigation.navigate('OrderDetail', { id: item.id, nro: item.nro_pedido })}
        />
      )}
      filterFields={DEFAULT_ORDERS_FILTERS}
      filterValues={filters.activeFilters}
      onFilterChange={filters.handleChange}
      onResetFilters={filters.handleClear}
      filterOptionalMap={{
        situacion_actual: SITUACION_ACTUAL_OPTIONS,
      }}
      emptyTitle="Sin pedidos"
      emptyMessage="No se encontraron pedidos registrados."
      onEndReached={() => { if (hasNextPage && !isFetchingNextPage) void fetchNextPage(); }}
      onRefresh={() => void refetch()}
      isRefreshing={isRefreshing}
    />
  );
}
