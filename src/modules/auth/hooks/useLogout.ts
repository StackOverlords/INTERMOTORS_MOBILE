import AsyncStorage from '@react-native-async-storage/async-storage';

import { deleteToken, deleteRefreshToken } from '@/services/keychain';

import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/authStore';

// ---------------------------------------------------------------------------
// useLogout — clears all auth state and navigates back to login
// ---------------------------------------------------------------------------
export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const logout = async (): Promise<void> => {
    // 1. Fire and forget — don't throw if server is unreachable
    void authService.logout();

    // 2. Remove secure tokens
    await deleteToken();
    await deleteRefreshToken();

    // 3. Remove persisted user — branch is kept so next login auto-selects it
    await AsyncStorage.removeItem('intermotors_auth_user');

    // 4. Reset Zustand store — RootNavigator will react and redirect
    clearAuth();
  };

  return { logout };
}
