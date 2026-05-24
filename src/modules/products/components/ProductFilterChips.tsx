import React, { useMemo } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@shopify/restyle';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';
import { useBrands } from '@/shared/hooks/useBrands';
import { useCategories } from '@/shared/hooks/useCategories';
import type { ProductFilterValues } from '../types/product.types';
import { DEFAULT_PRODUCT_FILTERS } from '../types/product.types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface ProductFilterChipsProps {
  activeFilters: ProductFilterValues;
  onRemove: (key: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ProductFilterChips({ activeFilters, onRemove }: ProductFilterChipsProps) {
  const theme = useTheme<Theme>();

  // Mismos hooks que usa ProductFiltersBottomSheet — React Query los sirve del caché,
  // no hace ninguna petición extra.
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  // Resuelve el label a mostrar en el chip para un campo + valor dado
  const chips = useMemo(() => {
    return DEFAULT_PRODUCT_FILTERS
      .filter(field => {
        const val = activeFilters[field.key];
        return val !== undefined && val !== '';
      })
      .map(field => {
        const rawValue = activeFilters[field.key]!;
        let valueLabel = rawValue;

        if (field.key === 'categoria') {
          const cat = categories?.find(c => String(c.id) === rawValue);
          valueLabel = cat?.categoria ?? rawValue;
        } else if (field.key === 'marca') {
          const brand = brands?.find(b => b.marca === rawValue);
          valueLabel = brand?.marca ?? rawValue;
        }

        return { key: field.key, fieldLabel: field.label, valueLabel };
      });
  }, [activeFilters, categories, brands]);

  if (chips.length === 0) return null;

  return (
    <View style={{ height: 36 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: theme.spacing.m,
          gap: theme.spacing.xs,
        }}
      >
        {chips.map(chip => (
          <View
            key={chip.key}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: theme.colors.primary,
              borderRadius: 999,
              paddingVertical: 4,
              paddingLeft: 10,
              paddingRight: 6,
            }}
          >
            <Text color="primary" style={{ fontSize: 12, fontWeight: '500' }}>
              {chip.fieldLabel}:{' '}
            </Text>
            <Text color="primary" style={{ fontSize: 12, fontWeight: '600', maxWidth: 110 }} numberOfLines={1}>
              {chip.valueLabel}
            </Text>
            <Pressable
              onPress={() => onRemove(chip.key)}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 6 }}
              style={{ marginLeft: 4 }}
            >
              <X size={12} color={theme.colors.primary} strokeWidth={2.5} />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
