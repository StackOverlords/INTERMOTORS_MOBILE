import React, { ComponentProps } from 'react';

import { Box } from '@/themes';

type BoxProps = ComponentProps<typeof Box>;

type CardProps = BoxProps & {
  children: React.ReactNode;
};

export function Card({ children, ...rest }: CardProps) {
  return (
    <Box
      backgroundColor="cardBackground"
      borderRadius="xl"
      borderWidth={0.5}
      borderColor="border"
      padding="m"
      {...rest}
    >
      {children}
    </Box>
  );
}
