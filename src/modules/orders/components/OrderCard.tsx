import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Badge, Card } from '@/shared/components';
import { Box, Text } from '@/themes';

import { formatCurrency, formatDate } from '@/shared/utils/format';

import type { Order, OrderEstado } from '../types/order.types';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

const ESTADO_BADGE_MAP: Record<string, BadgeVariant> = {
  Pendiente: 'warning',
  'En Tránsito': 'info',
  Recibido: 'success',
  Cancelado: 'danger',
};

function estadoToBadgeVariant(estado: OrderEstado): BadgeVariant {
  return ESTADO_BADGE_MAP[estado] ?? 'default';
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
type OrderCardProps = {
  order: Order;
  onPress?: () => void;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function OrderCard({ order, onPress }: OrderCardProps) {
  const supplierName = order.proveedor?.proveedor ?? '—';

  const content = (
    <Card marginBottom="s">
      {/* Order number */}
      <Text variant="subheader" numberOfLines={1} marginBottom="xs">
        Pedido #{order.nro_pedido}
      </Text>

      {/* Supplier name */}
      <Text variant="caption" color="textSecondary" marginBottom="s">
        {supplierName}
      </Text>

      {/* Estado badge */}
      <Box marginBottom="s">
        <Badge
          label={order.situacion_actual}
          variant={estadoToBadgeVariant(order.situacion_actual)}
        />
      </Box>

      {/* Date + Total row */}
      <Box flexDirection="row" justifyContent="space-between" alignItems="flex-end">
        <Box>
          <Text variant="caption" color="textSecondary">
            Fecha
          </Text>
          <Text variant="body">{formatDate(order.fecha, 'es-BO')}</Text>
        </Box>
        <Box alignItems="flex-end">
          <Text variant="caption" color="textSecondary">
            Total
          </Text>
          <Text variant="body" color="primary">
            {formatCurrency(order.total, 'BOB', 'es-BO')}
          </Text>
        </Box>
      </Box>
    </Card>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}
