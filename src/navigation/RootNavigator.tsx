import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shopify/restyle';

import { getRefreshToken, saveToken, saveRefreshToken, deleteToken, deleteRefreshToken } from '@/services/keychain';
import { Box } from '@/themes';
import type { Theme } from '@/themes';
import type { AuthUser } from '@/modules/auth/types/auth.types';
import { authService } from '@/modules/auth/services/auth.service';
import { useAuthStore } from '@/modules/auth/stores/authStore';
import { useSessionManager } from '@/modules/auth/hooks/useSessionManager';
import { BranchSelectorScreen } from '@/modules/auth/screens/BranchSelectorScreen';
import type { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

// ---------------------------------------------------------------------------
// Navigator
// ---------------------------------------------------------------------------
const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  const { colors } = useTheme<Theme>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = useAuthStore((s) => s.token !== null);
  const hasBranch = useAuthStore((s) => s.selectedBranchId !== null);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setBranch = useAuthStore((s) => s.setBranch);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession(): Promise<void> {
      // 1. Check for a valid refresh token (source of truth for session validity)
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        // 2. Always refresh on cold start — get fresh token pair
        const response = await authService.refresh(refreshToken);

        await saveToken(response.token);
        await saveRefreshToken(response.refresh_token);

        // 3. Restore persisted user (refresh endpoint doesn't return user data)
        const rawUser = await AsyncStorage.getItem('intermotors_auth_user');
        const user: AuthUser | null = rawUser
          ? (JSON.parse(rawUser) as AuthUser)
          : null;

        if (user && !cancelled) {
          setAuth(response.token, user);
        }

        // 4. Restore selected branch
        const rawBranchId = await AsyncStorage.getItem('intermotors_branch_id');
        if (rawBranchId && !cancelled) {
          setBranch(Number(rawBranchId));
        }
      } catch {
        // Refresh token expired or revoked — wipe everything and go to login
        await deleteToken();
        await deleteRefreshToken();
        await AsyncStorage.multiRemove(['intermotors_auth_user', 'intermotors_branch_id']);
      }

      if (!cancelled) {
        setIsLoading(false);
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, [setAuth, setBranch]);

  useSessionManager();

  if (isLoading) {
    return (
      <Box flex={1} backgroundColor="background" alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" color={colors.primary} />
      </Box>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : !hasBranch ? (
        <Stack.Screen name="Branch" component={BranchSelectorScreen} />
      ) : (
        <Stack.Screen name="Main" component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
}
