import React from 'react';

import { Box, Text } from '@/themes';

type SectionHeaderProps = {
  title: string;
  rightSlot?: React.ReactNode;
};

export function SectionHeader({ title, rightSlot }: SectionHeaderProps) {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Text
        variant="caption"
        color="textSecondary"
        style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
      >
        {title}
      </Text>
      {rightSlot != null && rightSlot}
    </Box>
  );
}
