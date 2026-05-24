import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Badge, Card } from '@/shared/components';
import { Box, Text } from '@/themes';

import { formatCurrency, formatDate } from '@/shared/utils/format';

import type { Sale } from '../types/sale.types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
type SaleCardProps = {
  sale: Sale;
  onPress?: () => void;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function SaleCard({ sale, onPress }: SaleCardProps) {
  const clienteLabel = sale.cliente?.cliente ?? 'Sin cliente';
  const comprobanteLabel = sale.comprobantes ?? 'Sin comprobante';

  const content = (
    <Card marginBottom="s">
      {/* Numero de venta */}
      <Text variant="subheader" numberOfLines={1} marginBottom="xs">
        Nro. {sale.nro_venta}
      </Text>

      {/* Cliente */}
      <Text variant="body" color="text" marginBottom="xs">
        {clienteLabel}
      </Text>

      {/* Fecha + Comprobante */}
      <Box flexDirection="row" gap="s" marginBottom="s">
        <Badge label={formatDate(sale.fecha, 'es-AR')} variant="default" />
        <Badge label={comprobanteLabel} variant="info" />
      </Box>

      {/* Responsable + Total row */}
      <Box flexDirection="row" justifyContent="space-between" alignItems="flex-end">
        <Box>
          {sale.responsable ? (
            <Text variant="caption" color="textSecondary">
              {sale.responsable.nombre}
            </Text>
          ) : null}
        </Box>
        <Box alignItems="flex-end">
          <Text variant="caption" color="textSecondary">
            Total
          </Text>
          <Text variant="body" color="primary">
            {formatCurrency(sale.total, 'ARS', 'es-AR')}
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
