import React from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@shopify/restyle';

import type { Theme } from '@/themes';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import type { Quotation } from '../types/quotation.types';

type QuotationCardProps = {
  quotation: Quotation;
  onPress?: () => void;
};

export function QuotationCard({ quotation, onPress }: QuotationCardProps) {
  const { colors } = useTheme<Theme>();

  const isPedido = !!quotation.pedido;
  const chipBg = (isPedido ? colors.successBackground : colors.surface) as string;
  const chipFg = (isPedido ? colors.success : colors.textSecondary) as string;

  const c = {
    bg: colors.cardBackground as string,
    border: colors.border as string,
    text: colors.text as string,
    muted: colors.textSecondary as string,
    primary: colors.primary as string,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      disabled={!onPress}
      style={[styles.card, { backgroundColor: c.bg, borderColor: c.border }]}
    >
      {/* Row 1: ID · fecha  [badge] */}
      <View style={styles.row}>
        <View style={styles.leftMeta}>
          <RNText style={[styles.id, { color: c.text }]}>#{quotation.nro_cotizacion}</RNText>
          <RNText style={[styles.dot, { color: c.muted }]}> · </RNText>
          <RNText style={[styles.meta, { color: c.muted }]}>
            {formatDate(quotation.fecha, 'es-BO')}
          </RNText>
        </View>
        <View style={[styles.chip, { backgroundColor: chipBg, borderColor: chipFg }]}>
          <RNText style={[styles.chipText, { color: chipFg }]}>
            {isPedido ? 'Pedido' : 'Cotización'}
          </RNText>
        </View>
      </View>

      {/* Row 2: cliente + total */}
      <View style={[styles.row, styles.mainRow]}>
        <RNText style={[styles.name, { color: c.text }]} numberOfLines={1}>
          {quotation.cliente?.cliente ?? 'Sin cliente'}
        </RNText>
        <RNText style={[styles.amount, { color: c.primary }]}>
          {formatCurrency(Number(quotation.total), 'BOB', 'es-BO')}
        </RNText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 0.5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainRow: {
    marginTop: 5,
  },
  leftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  id: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  dot: {
    fontSize: 11,
  },
  meta: {
    fontSize: 11,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
    flexShrink: 0,
  },
  chip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    marginLeft: 8,
    flexShrink: 0,
  },
  chipText: {
    fontSize: 10,
    fontWeight: '500',
  },
});
