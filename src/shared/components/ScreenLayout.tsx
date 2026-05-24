import React from 'react';

import { Box } from '@/themes';

type ScreenLayoutProps = {
  children: React.ReactNode;
  padded?: boolean;
};

export function ScreenLayout({ children, padded = false }: ScreenLayoutProps) {
  return (
    <Box
      flex={1}
      backgroundColor="background"
      padding={padded ? 'm' : undefined}
    >
      {children}
    </Box>
  );
}
