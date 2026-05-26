import React, { useCallback, useRef } from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useTheme } from '@shopify/restyle';

import type { Theme } from '@/themes';
import { formatCurrency } from '@/shared/utils/format';
import { getStockVariant } from '@/modules/products/components/ProductCard.utils';
import type { InventarioItem } from '../types/inventory.types';

type Props = { item: InventarioItem };

function renderBackdrop(props: BottomSheetBackdropProps) {
  return (
    <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
  );
}

function DetailRow({ label, value, muted, text, valueColor }: { label: string; value: string; muted: string; text: string; valueColor?: string }) {
  return (
    <View style={detail.row}>
      <RNText style={[detail.label, { color: muted }]}>{label}</RNText>
      <RNText style={[detail.value, { color: valueColor ?? text }]}>{value}</RNText>
    </View>
  );
}

export function InventarioCard({ item }: Props) {
  const { colors, spacing } = useTheme<Theme>();
  const sheetRef = useRef<BottomSheetModal>(null);

  const stockInt = Math.floor(item.stock);
  const variant = getStockVariant(stockInt);
  const chipBg = colors[`${variant}Background` as keyof typeof colors] as string;
  const chipFg = colors[variant as keyof typeof colors] as string;
  const stockColor = colors[variant as keyof typeof colors] as string;

  const c = {
    bg: colors.cardBackground as string,
    border: colors.border as string,
    text: colors.text as string,
    muted: colors.textSecondary as string,
    primary: colors.primary as string,
  };

  const handleOpen = useCallback(() => sheetRef.current?.present(), []);

  return (
    <>
      <TouchableOpacity
        onPress={handleOpen}
        activeOpacity={0.75}
        style={[styles.card, { backgroundColor: c.bg, borderColor: c.border }]}
      >
        {/* Row 1: código  [stock badge] */}
        <View style={styles.row}>
          <RNText style={[styles.id, { color: c.text }]}>{item.codigo}</RNText>
          <View style={[styles.chip, { backgroundColor: chipBg, borderColor: chipFg }]}>
            <RNText style={[styles.chipText, { color: chipFg }]}>{stockInt} u.</RNText>
          </View>
        </View>

        {/* Row 2: producto + valor */}
        <View style={[styles.row, styles.mainRow]}>
          <RNText style={[styles.name, { color: c.text }]} numberOfLines={1}>
            {item.producto}
          </RNText>
          <RNText style={[styles.amount, { color: c.primary }]}>
            {formatCurrency(item.valor, 'BOB', 'es-BO')}
          </RNText>
        </View>

        {/* Row 3: costo promedio */}
        <RNText style={[styles.micro, { color: c.muted }]}>
          Costo prom. {formatCurrency(item.costo_promedio, 'BOB', 'es-BO')}
        </RNText>
      </TouchableOpacity>

      <BottomSheetModal
        ref={sheetRef}
        enableDynamicSizing
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.cardBackground }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: spacing.m,
            paddingBottom: spacing.xl,
          }}
        >
          {/* Header */}
          <RNText style={[sheet.title, { color: c.text }]} numberOfLines={2}>
            {item.producto}
          </RNText>
          <RNText style={[sheet.subtitle, { color: c.muted }]}>{item.codigo}</RNText>

          <View style={[sheet.divider, { backgroundColor: colors.border }]} />

          {/* Stock */}
          <DetailRow label="Stock actual" value={`${stockInt} u.`} muted={c.muted} text={c.text} valueColor={stockColor} />

          <View style={[sheet.divider, { backgroundColor: colors.border }]} />

          {/* Valores */}
          <DetailRow label="Costo promedio" value={formatCurrency(item.costo_promedio, 'BOB', 'es-BO')} muted={c.muted} text={c.text} />
          <DetailRow label="Valor total" value={formatCurrency(item.valor, 'BOB', 'es-BO')} muted={c.muted} text={c.text} valueColor={c.primary} />

          <View style={[sheet.divider, { backgroundColor: colors.border }]} />

          {/* Movimientos */}
          <DetailRow label="Compras" value={String(item.compras)} muted={c.muted} text={c.text} />
          <DetailRow label="Ventas" value={String(item.ventas)} muted={c.muted} text={c.text} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}

// ---------------------------------------------------------------------------
// Card styles
// ---------------------------------------------------------------------------
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
  id: { fontSize: 12, fontWeight: '600', letterSpacing: 0.2 },
  name: { fontSize: 13, fontWeight: '600', flex: 1, marginRight: 8 },
  amount: { fontSize: 14, fontWeight: '700', flexShrink: 0 },
  micro: { fontSize: 10, marginTop: 3 },
  chip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.5,
    marginLeft: 8,
    flexShrink: 0,
  },
  chipText: { fontSize: 10, fontWeight: '500' },
});

// ---------------------------------------------------------------------------
// Bottom sheet styles
// ---------------------------------------------------------------------------
const sheet = StyleSheet.create({
  title: { fontSize: 15, fontWeight: '700', marginTop: 4 },
  subtitle: { fontSize: 12, marginTop: 2, marginBottom: 4 },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: 12 },
});

const detail = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: { fontSize: 13 },
  value: { fontSize: 13, fontWeight: '600' },
});
