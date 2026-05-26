import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';
import { Card, Badge, DetailHeader } from '@/shared/components';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import type { AccountsReceivableStackParamList } from '@/navigation/types';

import { useAccountReceivablePayments } from '../hooks/useAccountReceivable';
import type { AccountReceivablePayment } from '../types/account-receivable.types';

type Props = NativeStackScreenProps<AccountsReceivableStackParamList, 'AccountReceivableDetail'>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function tipoPagoLabel(tipo: string): string {
  const map: Record<string, string> = {
    EFECTIVO: 'Efectivo',
    CHEQUE: 'Cheque',
    TRASNF: 'Transferencia',
    QR: 'QR',
    'QR-EFECTIVO': 'QR + Efectivo',
  };
  return map[tipo] ?? tipo;
}

// ---------------------------------------------------------------------------
// PaymentCard — single payment row
// ---------------------------------------------------------------------------
function PaymentCard({ payment }: { payment: AccountReceivablePayment }): React.JSX.Element {
  return (
    <Card marginBottom="s">
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="xs">
        <Text variant="subheader" color="text">
          {payment.nro_pago}
        </Text>
        <Badge label={tipoPagoLabel(payment.tipo_pago)} variant="info" />
      </Box>

      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Badge label={formatDate(payment.fecha, 'es-AR')} variant="default" />
        <Text variant="body" color="primary" style={{ fontWeight: '700' }}>
          {formatCurrency(payment.monto, payment.moneda, 'es-BO')}
        </Text>
      </Box>

      {payment.comentarios ? (
        <Text variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
          {payment.comentarios}
        </Text>
      ) : null}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// AccountReceivableDetailScreen
// ---------------------------------------------------------------------------
export function AccountReceivableDetailScreen({ route }: Props): React.JSX.Element {
  const { id, nro } = route.params;
  const { colors } = useTheme<Theme>();
  const { data: payments, isLoading, isError } = useAccountReceivablePayments(id);

  const totalPagado = (payments ?? []).reduce((sum, p) => sum + p.monto, 0);

  return (
    <Box flex={1} backgroundColor="background">
      <DetailHeader title="Cuenta por Cobrar" subtitle={nro} />
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>

        {/* Summary row */}
        {payments && payments.length > 0 && (
          <Box
            backgroundColor="cardBackground"
            borderRadius="m"
            padding="m"
            marginBottom="m"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box alignItems="center">
              <Text variant="caption" color="textSecondary">Pagos</Text>
              <Text variant="subheader" color="text">{payments.length}</Text>
            </Box>
            <Box alignItems="center">
              <Text variant="caption" color="textSecondary">Total pagado</Text>
              <Text variant="subheader" color="success" style={{ fontWeight: '700' }}>
                {formatCurrency(totalPagado, 'BOB', 'es-BO')}
              </Text>
            </Box>
          </Box>
        )}

        {/* Payments section label */}
        <Text
          variant="caption"
          color="textSecondary"
          style={{ marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
          Historial de Pagos
        </Text>

        {/* Loading */}
        {isLoading && (
          <Box flex={1} alignItems="center" justifyContent="center" paddingTop="xl">
            <ActivityIndicator color={colors.primary} />
          </Box>
        )}

        {/* Error */}
        {isError && (
          <Box alignItems="center" paddingTop="xl">
            <Text variant="body" color="danger">No se pudo cargar los pagos.</Text>
          </Box>
        )}

        {/* Empty */}
        {!isLoading && !isError && payments?.length === 0 && (
          <Box alignItems="center" paddingTop="xl">
            <Text variant="body" color="textSecondary">Sin pagos registrados.</Text>
          </Box>
        )}

        {/* List */}
        {!isLoading && !isError && payments?.map((payment) => (
          <PaymentCard key={payment.id} payment={payment} />
        ))}

      </ScrollView>
    </Box>
  );
}
