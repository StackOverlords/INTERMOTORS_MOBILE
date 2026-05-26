import React from 'react';
import { ScrollView, StyleSheet, Text as RNText, View } from 'react-native';
import { useTheme } from '@shopify/restyle';

import type { Theme } from '@/themes';
import { Badge, ErrorState, LoadingState } from '@/shared/components';
import { formatCurrency, formatDate } from '@/shared/utils/format';

export type DetailField = {
  label: string;
  value: string | number | null | undefined;
  type?: 'text' | 'currency' | 'date' | 'badge';
  badgeVariant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

export type DetailSection = {
  title?: string;
  fields: DetailField[];
};

export type DeclarativeDetailProps = {
  isLoading?: boolean;
  error?: Error | null;
  sections: DetailSection[];
  loadingMessage?: string;
  scrollable?: boolean;
};

function resolveDisplayValue(field: DetailField): string {
  const { value, type } = field;
  if (value === null || value === undefined) return '—';
  if (type === 'currency') return formatCurrency(Number(value), 'BOB', 'es-BO');
  if (type === 'date') return formatDate(value as string, 'es-BO');
  return String(value);
}

function FieldRow({
  field,
  isLast,
  colors,
}: {
  field: DetailField;
  isLast: boolean;
  colors: Theme['colors'];
}) {
  const display = resolveDisplayValue(field);
  const isCurrency = field.type === 'currency';

  return (
    <View>
      <View style={styles.fieldRow}>
        <RNText style={[styles.fieldLabel, { color: colors.textSecondary as string }]}>
          {field.label}
        </RNText>

        {field.type === 'badge' ? (
          <Badge label={display} variant={field.badgeVariant ?? 'default'} />
        ) : (
          <RNText
            style={[
              styles.fieldValue,
              {
                color: isCurrency
                  ? (colors.primary as string)
                  : (colors.text as string),
                fontWeight: isCurrency ? '600' : '500',
              },
            ]}
            numberOfLines={2}
          >
            {display}
          </RNText>
        )}
      </View>

      {!isLast && (
        <View style={[styles.divider, { backgroundColor: colors.border as string }]} />
      )}
    </View>
  );
}

export function DeclarativeDetail({
  isLoading = false,
  error = null,
  sections,
  loadingMessage = 'Cargando…',
  scrollable = true,
}: DeclarativeDetailProps) {
  const { colors } = useTheme<Theme>();

  if (isLoading) return <LoadingState message={loadingMessage} />;
  if (error) return <ErrorState title="Error" message={error.message} />;

  const content = (
    <View style={[styles.container, { backgroundColor: colors.background as string }]}>
      {sections.map((section, si) => (
        <View key={si}>
          {section.title ? (
            <RNText style={[styles.sectionTitle, { color: colors.textSecondary as string }]}>
              {section.title.toUpperCase()}
            </RNText>
          ) : null}

          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: colors.cardBackground as string,
                borderColor: colors.border as string,
              },
            ]}
          >
            {section.fields.map((field, fi) => (
              <FieldRow
                key={fi}
                field={field}
                isLast={fi === section.fields.length - 1}
                colors={colors}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  if (!scrollable) return content;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background as string }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  sectionCard: {
    borderRadius: 10,
    borderWidth: 0.5,
    marginHorizontal: 16,
    marginBottom: 8,
    overflow: 'hidden',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  fieldLabel: {
    fontSize: 11,
    flex: 1,
    marginRight: 12,
  },
  fieldValue: {
    fontSize: 12,
    textAlign: 'right',
    flexShrink: 1,
    maxWidth: '60%',
  },
  divider: {
    height: 0.5,
    marginHorizontal: 12,
  },
});
