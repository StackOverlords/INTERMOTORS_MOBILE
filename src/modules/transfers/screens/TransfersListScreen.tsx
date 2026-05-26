import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DeclarativeList } from '@/shared/components';
import type { TransfersStackParamList } from '@/navigation/types';

import { TransferCard } from '../components/TransferCard';
import { useTransfers } from '../hooks/useTransfers';
import type { Transfer } from '../types/transfer.types';

export function TransfersListScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<TransfersStackParamList>>();
  const { data: transfers, isLoading, isError, error, refetch, isFetching } = useTransfers();

  const items = transfers ?? [];
  const isRefreshing = isFetching && items.length > 0;

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
      emptyTitle="Sin transferencias"
      emptyMessage="No hay transferencias disponibles."
      onRefresh={() => void refetch()}
      isRefreshing={isRefreshing}
    />
  );
}
