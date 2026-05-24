import React from 'react';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

type VariantTokens = {
  background: keyof Theme['colors'];
  foreground: keyof Theme['colors'];
};

const VARIANT_MAP: Record<BadgeVariant, VariantTokens> = {
  default: {
    background: 'surface',
    foreground: 'textSecondary',
  },
  success: {
    background: 'successBackground',
    foreground: 'success',
  },
  warning: {
    background: 'warningBackground',
    foreground: 'warning',
  },
  danger: {
    background: 'dangerBackground',
    foreground: 'danger',
  },
  info: {
    background: 'infoBackground',
    foreground: 'info',
  },
};

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const tokens = VARIANT_MAP[variant];

  return (
    <Box
      backgroundColor={tokens.background}
      borderRadius="full"
      paddingHorizontal="s"
      paddingVertical="xs"
      alignSelf="flex-start"
    >
      <Text variant="caption" color={tokens.foreground}>
        {label}
      </Text>
    </Box>
  );
}
