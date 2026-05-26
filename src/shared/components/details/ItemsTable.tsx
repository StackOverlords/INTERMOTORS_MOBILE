import React, { useCallback, useRef, useState } from 'react';
import {
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';

import { Text } from '@/themes';
import type { Theme } from '@/themes/theme';
import { formatCurrency } from '@/shared/utils/format';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ItemRow = {
  id: number | string;
  nro: number;
  descripcion: string;
  codigo?: string | null;
  marca?: string | null;
  cantidad: number;
  precio: number;
  moneda?: string | null;
  subtotal: number;
  descuentoPct?: number | null;
  cantidadDev?: number;
  nroMotor?: string | null;
  medida?: string | null;
  procedencia?: string | null;
  marcaVehiculo?: string | null;
};

export type ItemsTableProps = {
  items: ItemRow[];
  title?: string;
  totalAmount: number;
  totalCantidad?: number;
  emptyMessage?: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function fmtQty(n: number): string {
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(2);
}

// ---------------------------------------------------------------------------
// Sheet field row
// ---------------------------------------------------------------------------
function SheetRow({
  label,
  value,
  primary,
  danger,
  isLast,
  colors,
}: {
  label: string;
  value: string;
  primary?: boolean;
  danger?: boolean;
  isLast?: boolean;
  colors: Theme['colors'];
}) {
  const valueColor = danger
    ? (colors.danger as string)
    : primary
      ? (colors.primary as string)
      : (colors.text as string);

  return (
    <View style={[sheetStyles.row, isLast && sheetStyles.rowLast, { borderBottomColor: colors.border as string }]}>
      <RNText style={[sheetStyles.label, { color: colors.textSecondary as string }]}>
        {label}
      </RNText>
      <RNText
        style={[
          sheetStyles.value,
          { color: valueColor, fontWeight: primary ? '600' : '500' },
        ]}
      >
        {value}
      </RNText>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Bottom sheet content
// ---------------------------------------------------------------------------
function ItemDetailContent({
  item,
  colors,
}: {
  item: ItemRow;
  colors: Theme['colors'];
}) {
  const cantidadNum = Number(item.cantidad) || 0;
  const devNum = item.cantidadDev !== undefined ? Number(item.cantidadDev) : undefined;
  const cantidadReal = devNum !== undefined ? cantidadNum - devNum : cantidadNum;
  const precioNum = Number(item.precio) || 0;
  const subtotalNum = Number(item.subtotal) || 0;
  const moneda = item.moneda ?? 'BOB';

  return (
    <View style={[sheetStyles.content, { backgroundColor: colors.background as string }]}>
      {/* Product name */}
      <View style={[sheetStyles.nameBlock, { borderBottomColor: colors.border as string }]}>
        <RNText style={[sheetStyles.nro, { color: colors.textSecondary as string }]}>
          #{item.nro}
        </RNText>
        <RNText style={[sheetStyles.name, { color: colors.text as string }]}>
          {item.descripcion}
        </RNText>
      </View>

      {/* Field rows */}
      {(() => {
        const rows: React.ReactElement[] = [];
        if (item.codigo) rows.push(<SheetRow key="oem" label="OEM" value={item.codigo} colors={colors} />);
        if (item.marca) rows.push(<SheetRow key="mar" label="Marca" value={item.marca} colors={colors} />);
        if (item.marcaVehiculo) rows.push(<SheetRow key="mvh" label="Marca Vehículo" value={item.marcaVehiculo} colors={colors} />);
        if (item.nroMotor) rows.push(<SheetRow key="mot" label="N° Motor" value={item.nroMotor} colors={colors} />);
        if (item.medida) rows.push(<SheetRow key="med" label="Medida" value={item.medida} colors={colors} />);
        if (item.procedencia) rows.push(<SheetRow key="pro" label="Procedencia" value={item.procedencia} colors={colors} />);
        rows.push(
          <SheetRow
            key="qty"
            label="Cantidad"
            value={devNum ? `${fmtQty(cantidadReal)} (dev. ${fmtQty(devNum)})` : fmtQty(cantidadReal)}
            colors={colors}
          />,
        );
        rows.push(
          <SheetRow key="prc" label="Precio unit." value={formatCurrency(precioNum, moneda, 'es-BO')} colors={colors} />,
        );
        if (item.descuentoPct) {
          rows.push(
            <SheetRow key="dsc" label="Descuento" value={`${Number(item.descuentoPct).toFixed(1)}%`} danger colors={colors} />,
          );
        }
        rows.push(
          <SheetRow key="sub" label="Subtotal" value={formatCurrency(subtotalNum, moneda, 'es-BO')} primary colors={colors} />,
        );
        // mark last row
        const last = rows.length - 1;
        const tagged = rows.map((r, i) => React.cloneElement(r, { isLast: i === last }));
        return (
          <View style={[sheetStyles.fields, { backgroundColor: colors.cardBackground as string, borderColor: colors.border as string }]}>
            {tagged}
          </View>
        );
      })()}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Table header
// ---------------------------------------------------------------------------
function TableHeader({ colors }: { colors: Theme['colors'] }) {
  const c = colors.textSecondary as string;
  return (
    <View style={[styles.row, styles.headerRow, { backgroundColor: colors.cardBackground as string, borderBottomColor: colors.border as string }]}>
      <RNText style={[styles.colNro, styles.headerText, { color: c }]}>#</RNText>
      <RNText style={[styles.colDesc, styles.headerText, { color: c }]}>Producto</RNText>
      <RNText style={[styles.colQty, styles.headerText, { color: c }]}>Cant.</RNText>
      <RNText style={[styles.colTotal, styles.headerText, { color: c }]}>Total</RNText>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Table row — compact, tappable
// ---------------------------------------------------------------------------
function ItemRowView({
  item,
  colors,
  isLast,
  onPress,
}: {
  item: ItemRow;
  colors: Theme['colors'];
  isLast: boolean;
  onPress: () => void;
}) {
  const cantidadNum = Number(item.cantidad) || 0;
  const devNum = item.cantidadDev !== undefined ? Number(item.cantidadDev) : undefined;
  const cantidadReal = devNum !== undefined ? cantidadNum - devNum : cantidadNum;
  const subtotalNum = Number(item.subtotal) || 0;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.65}
      style={[
        styles.row,
        styles.dataRow,
        { borderBottomColor: colors.border as string },
        isLast && styles.lastRow,
      ]}
    >
      <RNText style={[styles.colNro, styles.cellText, { color: colors.textSecondary as string }]}>
        {item.nro}
      </RNText>
      <RNText
        style={[styles.colDesc, styles.descText, { color: colors.text as string }]}
        numberOfLines={1}
      >
        {item.descripcion}
      </RNText>
      <RNText style={[styles.colQty, styles.cellText, { color: colors.text as string, textAlign: 'center' }]}>
        {fmtQty(cantidadReal)}
      </RNText>
      <RNText style={[styles.colTotal, styles.totalText, { color: colors.primary as string }]}>
        {formatCurrency(subtotalNum, item.moneda ?? 'BOB', 'es-BO')}
      </RNText>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
function TableFooter({
  totalCantidad,
  totalAmount,
  colors,
}: {
  totalCantidad: number;
  totalAmount: number;
  colors: Theme['colors'];
}) {
  const totalCantNum = Number(totalCantidad) || 0;
  const totalAmountNum = Number(totalAmount) || 0;

  return (
    <View style={[styles.row, styles.footerRow, { backgroundColor: colors.cardBackground as string, borderTopColor: colors.border as string }]}>
      <View style={styles.colNro} />
      <RNText style={[styles.colDesc, styles.footerLabel, { color: colors.textSecondary as string }]}>
        Total
      </RNText>
      <RNText style={[styles.colQty, styles.footerQty, { color: colors.text as string, textAlign: 'center' }]}>
        {fmtQty(totalCantNum)}
      </RNText>
      <RNText style={[styles.colTotal, styles.footerTotal, { color: colors.primary as string }]}>
        {formatCurrency(totalAmountNum, 'BOB', 'es-BO')}
      </RNText>
    </View>
  );
}

// ---------------------------------------------------------------------------
// ItemsTable
// ---------------------------------------------------------------------------
export function ItemsTable({
  items,
  title = 'Productos',
  totalAmount,
  totalCantidad,
  emptyMessage = 'Sin productos',
}: ItemsTableProps) {
  const { colors } = useTheme<Theme>();
  const sheetRef = useRef<BottomSheetModal>(null);
  const [selectedItem, setSelectedItem] = useState<ItemRow | null>(null);

  const computedTotalCantidad =
    totalCantidad ??
    items.reduce((acc, r) => {
      const q = Number(r.cantidad) || 0;
      const d = r.cantidadDev !== undefined ? Number(r.cantidadDev) : 0;
      return acc + (q - d);
    }, 0);

  const handleRowPress = useCallback((item: ItemRow) => {
    setSelectedItem(item);
    sheetRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
    ),
    [],
  );

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background as string }]}>
        {/* Section title */}
        <Text variant="caption" color="textSecondary" style={styles.sectionLabel}>
          {title.toUpperCase()} · {items.length} {items.length === 1 ? 'item' : 'items'}
        </Text>

        {/* Table */}
        <View style={[styles.table, { borderColor: colors.border as string, backgroundColor: colors.cardBackground as string }]}>
          <TableHeader colors={colors} />

          {items.length === 0 ? (
            <Text variant="caption" color="textSecondary" style={styles.empty}>
              {emptyMessage}
            </Text>
          ) : (
            items.map((item, index) => (
              <ItemRowView
                key={String(item.id)}
                item={item}
                colors={colors}
                isLast={index === items.length - 1}
                onPress={() => handleRowPress(item)}
              />
            ))
          )}

          {items.length > 0 && (
            <TableFooter
              totalCantidad={computedTotalCantidad}
              totalAmount={totalAmount}
              colors={colors}
            />
          )}
        </View>
      </View>

      {/* Item detail bottom sheet */}
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={['50%']}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background as string }}
        handleIndicatorStyle={{ backgroundColor: colors.border as string }}
      >
        <BottomSheetScrollView>
          {selectedItem && (
            <ItemDetailContent item={selectedItem} colors={colors} />
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </>
  );
}

// ---------------------------------------------------------------------------
// Table styles
// ---------------------------------------------------------------------------
const COL_NRO = 26;
const COL_QTY = 42;
const COL_TOTAL = 84;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    paddingHorizontal: 4,
    paddingTop: 12,
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  table: {
    borderRadius: 10,
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  headerRow: {
    borderBottomWidth: 0.5,
    paddingVertical: 5,
  },
  dataRow: {
    borderBottomWidth: 0.5,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  footerRow: {
    borderTopWidth: 0.5,
    paddingVertical: 7,
  },
  headerText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cellText: {
    fontSize: 12,
    fontWeight: '500',
  },
  descText: {
    fontSize: 12,
    fontWeight: '500',
  },
  totalText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  footerLabel: {
    fontSize: 11,
  },
  footerQty: {
    fontSize: 12,
    fontWeight: '700',
  },
  footerTotal: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  empty: {
    textAlign: 'center',
    paddingVertical: 16,
  },
  colNro: {
    width: COL_NRO,
    textAlign: 'center',
    fontSize: 11,
  },
  colDesc: {
    flex: 1,
    paddingHorizontal: 6,
  },
  colQty: {
    width: COL_QTY,
  },
  colTotal: {
    width: COL_TOTAL,
    fontSize: 12,
  },
});

// ---------------------------------------------------------------------------
// Sheet styles
// ---------------------------------------------------------------------------
const sheetStyles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  nameBlock: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    marginBottom: 12,
    gap: 2,
  },
  nro: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  fields: {
    borderRadius: 10,
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    fontSize: 11,
    flex: 1,
    marginRight: 12,
  },
  value: {
    fontSize: 12,
    textAlign: 'right',
    flexShrink: 1,
  },
});
