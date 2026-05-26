import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';

import type { Theme } from '@/themes';
import type { PurchasesStackParamList } from '@/navigation/types';
import { PurchasesListScreen } from '@/modules/purchases/screens/PurchasesListScreen';
import { PurchaseDetailScreen } from '@/modules/purchases/screens/PurchaseDetailScreen';

const Stack = createNativeStackNavigator<PurchasesStackParamList>();

export function PurchasesStackNavigator(): React.JSX.Element {
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
        name="PurchasesList"
        component={PurchasesListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PurchaseDetail"
        component={PurchaseDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
