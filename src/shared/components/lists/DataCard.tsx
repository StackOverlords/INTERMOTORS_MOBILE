import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Box, Text } from '@/themes';
import { Badge } from '@/shared/components/Badge';
import { Card } from '@/shared/components/Card';
import { formatCurrency, formatDate } from '@/shared/utils/format';
import type { BadgeVariant, ListFieldConfig } from './defineListFields';

// ---------------------------------------------------------------------------
// DataCard — symmetric label/value card driven by ListFieldConfig<T>.
// Pure display component — no filter or action props.
// ---------------------------------------------------------------------------
interface DataCardProps<T> {
  item: T;
  fields: ListFieldConfig<T>[];
  onPress?: () => void;
}

function resolveDisplay<T>(field: ListFieldConfig<T>, raw: unknown, item: T): string {
  if (field.format) return field.format(raw, item);
  switch (field.variant) {
    case 'currency': return formatCurrency(Number(raw), 'ARS', 'es-AR');
    case 'date':     return formatDate(String(raw ?? ''), 'es-AR');
    default:         return String(raw ?? '');
  }
}

interface FieldRowProps {
  label: string;
  display: string;
  raw: unknown;
  variant?: ListFieldConfig<unknown>['variant'];
  badgeVariant?: ListFieldConfig<unknown>['badgeVariant'];
}

function FieldRow({ label, display, raw, variant, badgeVariant }: FieldRowProps) {
  if (variant === 'badge') {
    const bv: BadgeVariant =
      typeof badgeVariant === 'function'
        ? badgeVariant(raw)
        : (badgeVariant ?? 'default');
    return (
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="xs">
        <Text variant="caption" color="textSecondary">{label}</Text>
        <Badge label={display} variant={bv} />
      </Box>
    );
  }

  return (
    <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="xs">
      <Text variant="caption" color="textSecondary">{label}</Text>
      <Text
        variant="body"
        color={variant === 'currency' ? 'primary' : 'text'}
        style={{ maxWidth: '60%' }}
        numberOfLines={1}
      >
        {display}
      </Text>
    </Box>
  );
}

export function DataCard<T>({ item, fields, onPress }: DataCardProps<T>) {
  const content = (
    <Card marginBottom="s" marginHorizontal="m">
      {fields.map(field => {
        const raw = field.accessor(item);
        const display = resolveDisplay(field, raw, item);
        return (
          <FieldRow
            key={field.key}
            label={field.label}
            display={display}
            raw={raw}
            variant={field.variant}
            badgeVariant={field.badgeVariant}
          />
        );
      })}
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
