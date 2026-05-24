import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Badge, Card } from '@/shared/components';
import { Box, Text } from '@/themes';

import { formatCurrency, formatDate } from '@/shared/utils/format';

import type { Purchase } from '../types/purchase.types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
type PurchaseCardProps = {
  purchase: Purchase;
  onPress?: () => void;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function PurchaseCard({ purchase, onPress }: PurchaseCardProps) {
  const comprobanteLabel = purchase.comprobantes ?? 'Sin comprobante';

  const content = (
    <Card marginBottom="s">
      {/* Numero de compra */}
      <Text variant="subheader" numberOfLines={1} marginBottom="xs">
        Nro. {purchase.nro_compra}
      </Text>

      {/* Proveedor */}
      <Text variant="body" color="text" marginBottom="xs">
        {purchase.proveedor.proveedor}
      </Text>

      {/* Fecha + Comprobante */}
      <Box flexDirection="row" gap="s" marginBottom="s">
        <Badge label={formatDate(purchase.fecha, 'es-AR')} variant="default" />
        <Badge label={comprobanteLabel} variant="info" />
      </Box>

      {/* Responsable + Total row */}
      <Box flexDirection="row" justifyContent="space-between" alignItems="flex-end">
        <Box>
          {purchase.responsable ? (
            <Text variant="caption" color="textSecondary">
              {purchase.responsable.nombre}
            </Text>
          ) : null}
        </Box>
        <Box alignItems="flex-end">
          <Text variant="caption" color="textSecondary">
            Total
          </Text>
          <Text variant="body" color="primary">
            {formatCurrency(purchase.total, 'ARS', 'es-AR')}
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
