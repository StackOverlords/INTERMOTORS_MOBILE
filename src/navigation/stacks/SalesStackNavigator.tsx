import React from 'react';
import { Platform, StatusBar } from 'react-native';
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
        statusBarTranslucent: Platform.OS === 'android',
        headerStatusBarHeight: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0,
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
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
