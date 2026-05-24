import React from 'react';

import { Box, Text } from '@/themes';

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  message?: string;
};

export function EmptyState({ icon, title, message }: EmptyStateProps) {
  return (
    <Box flex={1} alignItems="center" justifyContent="center" padding="l">
      {icon ? <Box marginBottom="m">{icon}</Box> : null}
      <Text variant="subheader" textAlign="center" marginBottom="s">
        {title}
      </Text>
      {message ? (
        <Text variant="body" color="textSecondary" textAlign="center">
          {message}
        </Text>
      ) : null}
    </Box>
  );
}
