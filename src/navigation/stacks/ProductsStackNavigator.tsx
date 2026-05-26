import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';

import type { Theme } from '@/themes';
import type { ProductsStackParamList } from '@/navigation/types';
import { ProductsListScreen } from '@/modules/products/screens/ProductsListScreen';
import { ProductDetailScreen } from '@/modules/products/screens/ProductDetailScreen';

const Stack = createNativeStackNavigator<ProductsStackParamList>();

export function ProductsStackNavigator(): React.JSX.Element {
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
        name="ProductsList"
        component={ProductsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
