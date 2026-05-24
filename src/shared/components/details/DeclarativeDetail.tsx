import React from 'react';
import { ScrollView } from 'react-native';

import { Box, Text } from '@/themes';
import { Badge, Divider, ErrorState, LoadingState } from '@/shared/components';
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
};

function resolveDisplayValue(field: DetailField): string {
  const { value, type } = field;

  if (value === null || value === undefined) return '—';

  if (type === 'currency') return formatCurrency(value as number, 'BOB', 'es-BO');
  if (type === 'date') return formatDate(value as string, 'es-BO');

  return String(value);
}

export function DeclarativeDetail({
  isLoading = false,
  error = null,
  sections,
  loadingMessage = 'Cargando…',
}: DeclarativeDetailProps) {
  if (isLoading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return <ErrorState title="Error" message={error.message} />;
  }

  return (
    <ScrollView>
      <Box backgroundColor="background">
        {sections.map((section, sectionIndex) => (
          <Box key={sectionIndex}>
            {section.title ? (
              <Text
                variant="caption"
                color="textSecondary"
                paddingHorizontal="m"
                paddingTop="m"
                paddingBottom="xs"
              >
                {section.title.toUpperCase()}
              </Text>
            ) : null}

            <Box
              backgroundColor="cardBackground"
              borderRadius="l"
              borderWidth={0.5}
              borderColor="border"
              marginHorizontal="m"
              marginBottom="m"
            >
              {section.fields.map((field, fieldIndex) => (
                <Box key={fieldIndex}>
                  <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    paddingHorizontal="m"
                    paddingVertical="s"
                  >
                    <Text variant="body" color="textSecondary">
                      {field.label}
                    </Text>

                    {field.type === 'badge' ? (
                      <Badge
                        label={resolveDisplayValue(field)}
                        variant={field.badgeVariant ?? 'default'}
                      />
                    ) : (
                      <Text
                        variant="body"
                        style={{ fontWeight: '500', textAlign: 'right', flex: 1, marginLeft: 16 }}
                      >
                        {resolveDisplayValue(field)}
                      </Text>
                    )}
                  </Box>

                  {fieldIndex < section.fields.length - 1 && <Divider />}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </ScrollView>
  );
}
