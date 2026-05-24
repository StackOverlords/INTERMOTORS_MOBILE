import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';

import type { Theme } from '@/themes';
import type { QuotationsStackParamList } from '@/navigation/types';
import { QuotationsListScreen } from '@/modules/quotations/screens/QuotationsListScreen';
import { QuotationDetailScreen } from '@/modules/quotations/screens/QuotationDetailScreen';

const Stack = createNativeStackNavigator<QuotationsStackParamList>();

export function QuotationsStackNavigator(): React.JSX.Element {
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
        name="QuotationsList"
        component={QuotationsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuotationDetail"
        component={QuotationDetailScreen}
        options={{ title: 'Cotización' }}
      />
    </Stack.Navigator>
  );
}
