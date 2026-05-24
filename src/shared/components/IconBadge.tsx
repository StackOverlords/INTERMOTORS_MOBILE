import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';

import type { Theme } from '@/themes';

interface IconBadgeProps {
  icon: React.ReactNode;
  count: number;
  maxCount?: number;
  onPress?: () => void;
}

export function IconBadge({
  icon,
  count,
  maxCount = 99,
  onPress,
}: IconBadgeProps): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  const showBadge = count > 0;
  const label = count > maxCount ? `${maxCount}+` : String(count);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {icon}
      {showBadge && (
        <View style={[styles.badge, { backgroundColor: colors.danger }]}>
          <Text style={styles.badgeText}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 12,
  },
});
