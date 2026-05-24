import React from 'react';
import { TouchableOpacity } from 'react-native';

import { AlertCircle } from 'lucide-react-native';
import { useTheme } from '@shopify/restyle';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Algo salió mal',
  message,
  onRetry,
}: ErrorStateProps) {
  const { colors } = useTheme<Theme>();

  return (
    <Box flex={1} alignItems="center" justifyContent="center" padding="l">
      <Box marginBottom="m">
        <AlertCircle size={48} color={colors.danger} />
      </Box>
      <Text variant="subheader" textAlign="center" marginBottom="s">
        {title}
      </Text>
      {message ? (
        <Text variant="body" color="textSecondary" textAlign="center" marginBottom="m">
          {message}
        </Text>
      ) : null}
      {onRetry ? (
        <TouchableOpacity onPress={onRetry} activeOpacity={0.8}>
          <Box
            borderWidth={1}
            borderColor="primary"
            borderRadius="m"
            paddingHorizontal="l"
            paddingVertical="s"
          >
            <Text variant="body" color="primary">
              Reintentar
            </Text>
          </Box>
        </TouchableOpacity>
      ) : null}
    </Box>
  );
}
