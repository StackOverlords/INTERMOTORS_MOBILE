import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DeclarativeList } from '@/shared/components';
import type { OrdersStackParamList } from '@/navigation/types';

import { OrderCard } from '../components/OrderCard';
import { useOrders } from '../hooks/useOrders';
import type { Order } from '../types/order.types';

export function OrdersListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<OrdersStackParamList>>();
  const { data, isLoading, isFetching, isError, error, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } = useOrders();

  const items = data?.pages.flatMap((p) => p.data) ?? [];
  const isRefreshing = isFetching && !isFetchingNextPage && items.length > 0;

  return (
    <DeclarativeList<Order>
      data={items}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(item) => String(item.id)}
      renderItem={(item) => <OrderCard order={item} onPress={() => navigation.navigate('OrderDetail', { id: item.id, nro: item.nro_pedido })} />}
      emptyTitle="Sin pedidos"
      emptyMessage="No se encontraron pedidos registrados."
      onEndReached={() => { if (hasNextPage && !isFetchingNextPage) void fetchNextPage(); }}
      onRefresh={() => void refetch()}
      isRefreshing={isRefreshing}
    />
  );
}
