import React, { useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Swipeable } from 'react-native-gesture-handler';
import { useTheme } from '@shopify/restyle';
import { BarChart2, Check, ChevronDown, Cog, ShoppingCart } from 'lucide-react-native';

import { Badge, Divider } from '@/shared/components';
import { Box, Text } from '@/themes';
import { formatCurrency } from '@/shared/utils/format';
import type { Theme } from '@/themes';
import { useCartStore } from '@/modules/cart/stores/cartStore';

import type { Product } from '../types/product.types';
import {
  DEFAULT_CURRENCY,
  getStockVariant,
  type CurrencyConfig,
} from './ProductCard.utils';

const ACTION_WIDTH = 68;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
type ProductCardProps = {
  product: Product;
  currency?: CurrencyConfig;
  onDetailPress?: () => void;
};

// ---------------------------------------------------------------------------
// DetailRow — label + value en la sección expandida
// ---------------------------------------------------------------------------
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box flexDirection="row" justifyContent="space-between" alignItems="center" paddingVertical="xs">
      <Text variant="caption" color="textSecondary" style={{ flex: 1 }}>
        {label}
      </Text>
      <Text variant="caption" style={{ flex: 1, textAlign: 'right', fontWeight: '500' }}>
        {value}
      </Text>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ProductCard({ product, currency, onDetailPress }: ProductCardProps) {
  const curr = currency ?? DEFAULT_CURRENCY;
  const stockInt = Math.floor(product.stock_actual);
  const stockVariant = getStockVariant(stockInt);
  const theme = useTheme<Theme>();

  const [expanded, setExpanded] = useState(false);
  const rotation = useSharedValue(0);
  const swipeableRef = useRef<Swipeable>(null);

  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const isInCart = useCartStore((s) =>
    s.items.some((i) => i.productId === String(product.id)),
  );

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  function toggle() {
    const next = !expanded;
    rotation.value = withTiming(next ? 180 : 0, { duration: 220 });
    setExpanded(next);
  }

  function handleCartToggle() {
    if (isInCart) {
      removeItem(String(product.id));
    } else {
      addItem({
        productId: String(product.id),
        productName: product.descripcion,
        quantity: 1,
        unitPrice: product.precio_venta,
        currency: curr.code,
      });
    }
    swipeableRef.current?.close();
  }

  function renderRightActions() {
    return (
      <View style={swipeStyles.actionsRow}>
        {/* Stats */}
        <TouchableOpacity
          style={[swipeStyles.actionBtn, {
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.border,
          }]}
          onPress={() => { swipeableRef.current?.close(); onDetailPress?.(); }}
          activeOpacity={0.75}
        >
          <BarChart2 size={18} color={theme.colors.info} />
        </TouchableOpacity>

        {/* Cart */}
        <TouchableOpacity
          style={[swipeStyles.actionBtn, {
            backgroundColor: theme.colors.cardBackground,
            borderColor: theme.colors.border,
          }]}
          onPress={handleCartToggle}
          activeOpacity={0.75}
        >
          <View style={swipeStyles.cartIconWrap}>
            <ShoppingCart
              size={18}
              color={isInCart ? theme.colors.success : theme.colors.primary}
            />
            {isInCart && (
              <View style={[swipeStyles.checkBadge, { backgroundColor: theme.colors.success }]}>
                <Check size={7} color="#fff" strokeWidth={3.5} />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      friction={2}
      overshootRight={false}
      containerStyle={swipeStyles.swipeContainer}
    >
      <Box
        backgroundColor="cardBackground"
        borderRadius="l"
        borderWidth={0.5}
        borderColor="border"
        style={{ overflow: 'hidden' }}
      >
      <TouchableOpacity onPress={toggle} activeOpacity={0.75}>
        <Box flexDirection="row" alignItems="center" padding="m" gap="m">

          {/* Thumbnail */}
          <View style={{ position: 'relative', flexShrink: 0 }}>
            <Box
              width={44}
              height={44}
              borderRadius="m"
              backgroundColor="surface"
              alignItems="center"
              justifyContent="center"
              style={{ overflow: 'hidden' }}
            >
              {product.imagen ? (
                <Image
                  source={{ uri: product.imagen }}
                  style={{ width: 44, height: 44 }}
                  resizeMode="contain"
                />
              ) : (
                <Cog size={22} color={theme.colors.textSecondary} />
              )}
            </Box>
            {isInCart && (
              <View style={[cardStyles.cartBadge, { backgroundColor: theme.colors.success }]}>
                <ShoppingCart size={8} color="#fff" strokeWidth={2.5} />
              </View>
            )}
          </View>

          {/* Info block */}
          <Box flex={1} gap="xs">
            {/* Fila 1: nombre + precio */}
            <Box flexDirection="row" alignItems="flex-start" justifyContent="space-between" gap="s">
              <Text
                variant="body"
                numberOfLines={expanded ? undefined : 1}
                style={{ flex: 1, fontWeight: '600', fontSize: 14 }}
              >
                {product.descripcion}
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: '700', color: theme.colors.primary, flexShrink: 0 }}
              >
                {formatCurrency(product.precio_venta, curr.code, curr.locale)}
              </Text>
            </Box>

            {/* Fila 2: código + marca  — stock badge + chevron */}
            <Box flexDirection="row" alignItems="center" justifyContent="space-between">
              <Text variant="caption" color="textSecondary" numberOfLines={1} style={{ flex: 1 }}>
                #{product.codigo_interno}
                {product.marca ? ` · ${product.marca}` : ''}
              </Text>
              <Box flexDirection="row" alignItems="center" gap="xs">
                <Badge label={`${stockInt} u.`} variant={stockVariant} />
                <Animated.View style={chevronStyle}>
                  <ChevronDown size={14} color={theme.colors.textSecondary} />
                </Animated.View>
              </Box>
            </Box>
          </Box>

        </Box>
      </TouchableOpacity>

      {/* ------------------------------------------------------------------ */}
      {/* Expanded section                                                    */}
      {/* ------------------------------------------------------------------ */}
      {expanded && (
        <Box paddingHorizontal="m" paddingBottom="m">
          <Divider marginVertical="m" />

          {/* Badges + datos rápidos */}
          <Box gap="s">
            <Box flexDirection="row" flexWrap="wrap" gap="xs">
              <Badge label={product.categoria} />
              <Badge label={`${stockInt} u.`} variant={stockVariant} />
            </Box>

            <Box flexDirection="row" gap="m">
              <Box flexDirection="row" gap="xs">
                <Text variant="caption" color="textSecondary">Precio alt.</Text>
                <Text variant="caption" style={{ fontWeight: '600' }}>
                  {formatCurrency(product.precio_venta_alt, curr.code, curr.locale)}
                </Text>
              </Box>
              <Box flexDirection="row" gap="xs">
                <Text variant="caption" color="textSecondary">Proc.</Text>
                <Text variant="caption" style={{ fontWeight: '500' }}>{product.procedencia}</Text>
              </Box>
              <Box flexDirection="row" gap="xs">
                <Text variant="caption" color="textSecondary">U.M.</Text>
                <Text variant="caption" style={{ fontWeight: '500' }}>{product.unidad_medida}</Text>
              </Box>
            </Box>
          </Box>

          {/* Datos técnicos — solo los que existen */}
          {(product.modelo || product.codigo_oem || product.codigo_upc || product.medida) && (
            <Box
              backgroundColor="surface"
              borderRadius="m"
              padding="s"
              marginTop="m"
            >
              {product.modelo    ? <DetailRow label="Modelo"  value={product.modelo} /> : null}
              {product.codigo_oem ? <DetailRow label="OEM"    value={product.codigo_oem} /> : null}
              {product.codigo_upc ? <DetailRow label="UPC"    value={product.codigo_upc} /> : null}
              {product.medida    ? <DetailRow label="Medida"  value={product.medida} /> : null}
            </Box>
          )}

          {/* Stock breakdown */}
          <Box
            flexDirection="row"
            backgroundColor="surface"
            borderRadius="m"
            padding="s"
            marginTop="s"
            gap="m"
          >
            <Box flex={1} alignItems="center">
              <Text variant="caption" color="textSecondary">Stock</Text>
              <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors[
                stockVariant === 'danger' ? 'danger' : stockVariant === 'warning' ? 'warning' : 'success'
              ] }}>
                {stockInt}
              </Text>
            </Box>
            {product.stock_minimo !== null && (
              <Box flex={1} alignItems="center">
                <Text variant="caption" color="textSecondary">Mínimo</Text>
                <Text style={{ fontSize: 15, fontWeight: '600' }}>{Math.floor(product.stock_minimo)}</Text>
              </Box>
            )}
            {product.pedido_transito > 0 && (
              <Box flex={1} alignItems="center">
                <Text variant="caption" color="textSecondary">Tránsito</Text>
                <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.info }}>
                  {product.pedido_transito}
                </Text>
              </Box>
            )}
            <Box flex={1} alignItems="center">
              <Text variant="caption" color="textSecondary">Resto</Text>
              <Text style={{ fontSize: 15, fontWeight: '600' }}>
                {Math.floor(product.stock_resto)}
              </Text>
            </Box>
          </Box>
        </Box>
      )}
      </Box>
    </Swipeable>
  );
}

// ---------------------------------------------------------------------------
// Swipe action styles — plain StyleSheet (no theme access needed here)
// ---------------------------------------------------------------------------
const cardStyles = StyleSheet.create({
  cartBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const swipeStyles = StyleSheet.create({
  swipeContainer: {
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 10,
    paddingRight: 4,
    marginBottom: 8,
  },
  actionBtn: {
    width: ACTION_WIDTH,
    height: ACTION_WIDTH,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIconWrap: {
    position: 'relative',
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
