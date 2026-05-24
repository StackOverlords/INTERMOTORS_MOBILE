import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';

import type { Theme } from '@/themes';
import type { OrdersStackParamList } from '@/navigation/types';
import { OrdersListScreen } from '@/modules/orders/screens/OrdersListScreen';
import { OrderDetailScreen } from '@/modules/orders/screens/OrderDetailScreen';

const Stack = createNativeStackNavigator<OrdersStackParamList>();

export function OrdersStackNavigator(): React.JSX.Element {
  const { colors } = useTheme<Theme>();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="OrdersList"
        component={OrdersListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ title: 'Pedido' }}
      />
    </Stack.Navigator>
  );
}
