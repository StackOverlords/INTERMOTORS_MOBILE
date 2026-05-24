import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '@/modules/auth/screens/LoginScreen';
import { BranchSelectorScreen } from '@/modules/auth/screens/BranchSelectorScreen';
import type { AuthStackParamList } from './types';

// ---------------------------------------------------------------------------
// Navigator
// ---------------------------------------------------------------------------
const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="BranchSelector" component={BranchSelectorScreen} />
    </Stack.Navigator>
  );
}
