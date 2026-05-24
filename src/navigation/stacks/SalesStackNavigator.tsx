import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';

import type { Theme } from '@/themes';
import type { SalesStackParamList } from '@/navigation/types';
import { SalesListScreen } from '@/modules/sales/screens/SalesListScreen';
import { SaleDetailScreen } from '@/modules/sales/screens/SaleDetailScreen';

const Stack = createNativeStackNavigator<SalesStackParamList>();

export function SalesStackNavigator(): React.JSX.Element {
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
        name="SalesList"
        component={SalesListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SaleDetail"
        component={SaleDetailScreen}
        options={{ title: 'Venta' }}
      />
    </Stack.Navigator>
  );
}
