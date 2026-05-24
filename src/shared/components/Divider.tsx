import React from 'react';
import { StyleSheet } from 'react-native';

import { Box } from '@/themes';
import type { Theme } from '@/themes';

type DividerProps = {
  marginVertical?: keyof Theme['spacing'];
};

export function Divider({ marginVertical }: DividerProps) {
  return (
    <Box
      borderBottomWidth={StyleSheet.hairlineWidth}
      borderBottomColor="border"
      marginVertical={marginVertical}
    />
  );
}
