import React from 'react';

import { Badge, Card } from '@/shared/components';
import { Box, Text } from '@/themes';
import { formatCurrency, formatDate } from '@/shared/utils/format';

import type { AccountReceivable } from '../types/account-receivable.types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
type AccountReceivableCardProps = {
  item: AccountReceivable;
};

// ---------------------------------------------------------------------------
// AccountReceivableCard
// - saldo > 0 → danger color (red) + "DEUDA" badge
// - saldo === 0 → success color (green) + "PAGADO" badge
// - responsable section is omitted when null (no crash)
// ---------------------------------------------------------------------------
export function AccountReceivableCard({ item }: AccountReceivableCardProps) {
  const hasDebt = item.saldo > 0;
  const saldoColor = hasDebt ? 'danger' : 'success';
  const statusBadgeVariant = hasDebt ? 'danger' : 'success';
  const statusLabel = hasDebt ? 'DEUDA' : 'PAGADO';

  return (
    <Card marginBottom="s">
      {/* Numero de venta + status badge */}
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="xs">
        <Text variant="subheader" numberOfLines={1} style={{ flex: 1, marginRight: 8 }}>
          Nro. {item.nro_venta}
        </Text>
        <Badge label={statusLabel} variant={statusBadgeVariant} />
      </Box>

      {/* Cliente */}
      <Text variant="body" color="text" marginBottom="xs">
        {item.cliente.cliente}
      </Text>

      {/* Fecha + Plazo de pago */}
      <Box flexDirection="row" gap="s" marginBottom="s">
        <Badge label={formatDate(item.fecha, 'es-AR')} variant="default" />
        <Badge label={item.plazo_pago} variant="info" />
      </Box>

      {/* Financial summary row */}
      <Box flexDirection="row" justifyContent="space-between" marginBottom="xs">
        <Box alignItems="flex-start">
          <Text variant="caption" color="textSecondary">
            Vendido
          </Text>
          <Text variant="body" color="text">
            {formatCurrency(item.total_vendido, 'BOB', 'es-BO')}
          </Text>
        </Box>
        <Box alignItems="center">
          <Text variant="caption" color="textSecondary">
            Pagado
          </Text>
          <Text variant="body" color="text">
            {formatCurrency(item.total_pagado, 'BOB', 'es-BO')}
          </Text>
        </Box>
        <Box alignItems="flex-end">
          <Text variant="caption" color="textSecondary">
            Saldo
          </Text>
          {/* saldo color: danger (red) when > 0, success (green) when = 0 */}
          <Text variant="body" color={saldoColor} style={{ fontWeight: '700' }}>
            {formatCurrency(item.saldo, 'BOB', 'es-BO')}
          </Text>
        </Box>
      </Box>

      {/* Responsable — only rendered when not null */}
      {item.responsable ? (
        <Text variant="caption" color="textSecondary">
          {item.responsable.nombre}
          {item.responsable.apellido_paterno ? ` ${item.responsable.apellido_paterno}` : ''}
        </Text>
      ) : null}
    </Card>
  );
}
