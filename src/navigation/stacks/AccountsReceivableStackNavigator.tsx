import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';

import type { Theme } from '@/themes';
import type { AccountsReceivableStackParamList } from '@/navigation/types';
import { AccountsReceivableScreen } from '@/modules/accounts/screens/AccountsReceivableScreen';
import { AccountReceivableDetailScreen } from '@/modules/accounts/screens/AccountReceivableDetailScreen';

const Stack = createNativeStackNavigator<AccountsReceivableStackParamList>();

export function AccountsReceivableStackNavigator(): React.JSX.Element {
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
        name="AccountsReceivableList"
        component={AccountsReceivableScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountReceivableDetail"
        component={AccountReceivableDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
