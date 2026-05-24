import React from 'react';
import { TouchableOpacity } from 'react-native';

import { FileText } from 'lucide-react-native';
import { useTheme } from '@shopify/restyle';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';
import { Card, Badge } from '@/shared/components';

import { formatCurrency, formatDate } from '@/shared/utils/format';

import type { Quotation } from '../types/quotation.types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
type QuotationCardProps = {
  quotation: Quotation;
  onPress?: () => void;
};

// ---------------------------------------------------------------------------
// QuotationCard
// ---------------------------------------------------------------------------
export function QuotationCard({ quotation, onPress }: QuotationCardProps) {
  const { colors } = useTheme<Theme>();

  const clienteName = quotation.cliente?.cliente ?? 'Sin cliente';
  const badgeLabel = quotation.pedido ? 'Pedido' : 'Cotización';
  const badgeVariant = quotation.pedido ? 'success' : 'default';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card marginBottom="s" marginHorizontal="m">
        {/* Header row: numero + badge */}
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="xs">
          <Box flexDirection="row" alignItems="center" gap="xs">
            <FileText size={16} color={colors.primary} />
            <Text variant="subheader">#{quotation.nro_cotizacion}</Text>
          </Box>
          <Badge label={badgeLabel} variant={badgeVariant} />
        </Box>

        {/* Cliente */}
        <Text variant="body" marginBottom="xs">
          {clienteName}
        </Text>

        {/* Footer row: fecha + total */}
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text variant="caption" color="textSecondary">
            {formatDate(quotation.fecha, 'es-AR')}
          </Text>
          <Text variant="body" color="primary">
            {formatCurrency(quotation.total, 'ARS', 'es-AR')}
          </Text>
        </Box>
      </Card>
    </TouchableOpacity>
  );
}
