import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { ShoppingCart, Bell } from 'lucide-react-native';

import type { Theme } from '@/themes';
import { IconBadge } from '@/shared/components';
import { useCartStore, selectCartCount } from '@/modules/cart/stores/cartStore';
import { useNotificationsStore, selectUnreadCount } from '@/modules/notifications/stores/notificationsStore';

export function HeaderIcons(): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  const cartCount = useCartStore(selectCartCount);
  const notifCount = useNotificationsStore(selectUnreadCount);

  return (
    <View style={styles.row}>
      <IconBadge icon={<ShoppingCart color={colors.text} size={22} />} count={cartCount} />
      <IconBadge icon={<Bell color={colors.text} size={22} />} count={notifCount} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 8,
  },
});
