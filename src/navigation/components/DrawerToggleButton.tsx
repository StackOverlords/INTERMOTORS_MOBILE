import React from 'react';
import { TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { Menu } from 'lucide-react-native';

import type { Theme } from '@/themes';

export function DrawerToggleButton(): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      style={{ paddingHorizontal: 16, paddingVertical: 8 }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Menu color={colors.text} size={24} />
    </TouchableOpacity>
  );
}
