import React from 'react';
import { ActivityIndicator } from 'react-native';

import { useTheme } from '@shopify/restyle';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';

type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  const { colors } = useTheme<Theme>();

  return (
    <Box flex={1} alignItems="center" justifyContent="center" padding="l">
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? (
        <Text variant="caption" color="textSecondary" marginTop="m" textAlign="center">
          {message}
        </Text>
      ) : null}
    </Box>
  );
}
