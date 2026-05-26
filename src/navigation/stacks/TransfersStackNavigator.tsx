import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';

import type { Theme } from '@/themes';
import type { TransfersStackParamList } from '@/navigation/types';
import { TransfersListScreen } from '@/modules/transfers/screens/TransfersListScreen';
import { TransferDetailScreen } from '@/modules/transfers/screens/TransferDetailScreen';

const Stack = createNativeStackNavigator<TransfersStackParamList>();

export function TransfersStackNavigator(): React.JSX.Element {
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
        name="TransfersList"
        component={TransfersListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransferDetail"
        component={TransferDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
