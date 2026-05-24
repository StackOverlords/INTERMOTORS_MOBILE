import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from '@shopify/restyle';

import { Box } from '@/themes';
import type { Theme } from '@/themes';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface SpinnerProps {
  /** 'small' para loaders inline, 'large' para pantallas completas */
  size?: 'small' | 'large';
  /** Token de color del tema. Default: 'primary' */
  color?: keyof Theme['colors'];
  /** Padding vertical alrededor del indicador. Útil como footer de lista */
  paddingVertical?: number;
}

// ---------------------------------------------------------------------------
// Spinner — ActivityIndicator con soporte completo del tema
// ---------------------------------------------------------------------------
export function Spinner({ size = 'small', color = 'primary', paddingVertical }: SpinnerProps) {
  const theme = useTheme<Theme>();

  if (paddingVertical !== undefined) {
    return (
      <Box alignItems="center" justifyContent="center" style={{ paddingVertical }}>
        <ActivityIndicator size={size} color={theme.colors[color]} />
      </Box>
    );
  }

  return <ActivityIndicator size={size} color={theme.colors[color]} />;
}
