import React from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@shopify/restyle';

import type { Theme } from '@/themes';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import type { AccountReceivable } from '../types/account-receivable.types';

type AccountReceivableCardProps = {
  item: AccountReceivable;
  onPress?: () => void;
};

export function AccountReceivableCard({ item, onPress }: AccountReceivableCardProps) {
  const { colors } = useTheme<Theme>();

  const hasDebt = item.saldo > 0;
  const chipBg = (hasDebt ? colors.dangerBackground : colors.successBackground) as string;
  const chipFg = (hasDebt ? colors.danger : colors.success) as string;
  const saldoColor = (hasDebt ? colors.danger : colors.success) as string;

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
      {/* Row 1: nro_venta · fecha  [badge] */}
      <View style={styles.row}>
        <View style={styles.leftMeta}>
          <RNText style={[styles.id, { color: c.text }]}>{item.nro_venta}</RNText>
          <RNText style={[styles.dot, { color: c.muted }]}> · </RNText>
          <RNText style={[styles.meta, { color: c.muted }]}>
            {formatDate(item.fecha, 'es-BO')}
          </RNText>
        </View>
        <View style={[styles.chip, { backgroundColor: chipBg, borderColor: chipFg }]}>
          <RNText style={[styles.chipText, { color: chipFg }]}>
            {hasDebt ? 'DEUDA' : 'PAGADO'}
          </RNText>
        </View>
      </View>

      {/* Row 2: cliente + saldo */}
      <View style={[styles.row, styles.mainRow]}>
        <RNText style={[styles.name, { color: c.text }]} numberOfLines={1}>
          {item.cliente.cliente}
        </RNText>
        <RNText style={[styles.amount, { color: saldoColor }]}>
          {formatCurrency(item.saldo, 'BOB', 'es-BO')}
        </RNText>
      </View>

      {/* Row 3: responsable (opcional) */}
      {item.responsable ? (
        <RNText style={[styles.micro, { color: c.muted }]} numberOfLines={1}>
          {[item.responsable.nombre, item.responsable.apellido_paterno].filter(Boolean).join(' ')}
        </RNText>
      ) : null}
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
  mainRow: { marginTop: 5 },
  leftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  id: { fontSize: 12, fontWeight: '600', letterSpacing: 0.2 },
  dot: { fontSize: 11 },
  meta: { fontSize: 11 },
  name: { fontSize: 13, fontWeight: '600', flex: 1, marginRight: 8 },
  amount: { fontSize: 14, fontWeight: '700', flexShrink: 0 },
  micro: { fontSize: 10, marginTop: 3 },
  chip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    maxWidth: 80,
    marginLeft: 8,
    flexShrink: 0,
  },
  chipText: { fontSize: 10, fontWeight: '600' },
});
