import React from 'react';
import { Platform, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { ChevronLeft } from 'lucide-react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';

type Props = {
  title: string;
  subtitle?: string;
};

// Read status bar height bypassing any navigator safe-area context overrides.
// Android: StatusBar.currentHeight is authoritative (not affected by Drawer context).
// iOS: initialWindowMetrics.insets.top is read at app launch before any context override.
const STATUS_BAR_HEIGHT =
  Platform.OS === 'android'
    ? (StatusBar.currentHeight ?? 0)
    : (initialWindowMetrics?.insets.top ?? 0);

export function DetailHeader({ title, subtitle }: Props): React.JSX.Element {
  const navigation = useNavigation();
  const { colors } = useTheme<Theme>();

  return (
    <Box backgroundColor="surface" style={{ paddingTop: STATUS_BAR_HEIGHT }}>
      <Box
        flexDirection="row"
        alignItems="center"
        paddingRight="m"
        style={{ height: 56 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ paddingHorizontal: 12, paddingVertical: 8 }}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Box flex={1} justifyContent="center">
          <Text variant="subheader" color="text" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" color="textSecondary" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}
