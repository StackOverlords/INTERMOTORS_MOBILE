import React, { useMemo } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '@shopify/restyle';

import { Text } from '@/themes';
import type { Theme } from '@/themes';
import type { FilterFieldConfig, FilterValues } from '@/shared/types/filter.types';

// ---------------------------------------------------------------------------
// GenericFilterChips — removable chip bar for any list's active filters.
// Returns null when no values are active.
// ---------------------------------------------------------------------------
interface GenericFilterChipsProps<TValues extends FilterValues = FilterValues> {
  fields: FilterFieldConfig[];
  values: TValues;
  resolveLabel?: (field: FilterFieldConfig, value: string) => string;
  onRemove: (key: string) => void;
}

export function GenericFilterChips<TValues extends FilterValues = FilterValues>({
  fields,
  values,
  resolveLabel,
  onRemove,
}: GenericFilterChipsProps<TValues>) {
  const theme = useTheme<Theme>();

  const chips = useMemo(() => {
    return fields
      .filter(field => {
        const val = values[field.key];
        return val !== undefined && val !== '';
      })
      .map(field => ({
        key: field.key,
        fieldLabel: field.label,
        valueLabel: resolveLabel
          ? resolveLabel(field, values[field.key]!)
          : values[field.key]!,
      }));
  }, [fields, values, resolveLabel]);

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
            <Text
              color="primary"
              style={{ fontSize: 12, fontWeight: '600', maxWidth: 110 }}
              numberOfLines={1}
            >
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
