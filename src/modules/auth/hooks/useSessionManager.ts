import { useCallback, useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { getRefreshToken, saveRefreshToken, saveToken } from '@/services/keychain';

import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/authStore';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const REFRESH_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

// ---------------------------------------------------------------------------
// useSessionManager
//
// Keeps the session alive in two scenarios:
//   1. App is in foreground → refresh every 30 minutes via setInterval
//   2. App returns from background → refresh immediately on AppState 'active'
//
// Both paths are guarded by a mutex (isRefreshingRef) to prevent concurrent
// refresh calls — critical because the backend deletes the old refresh token
// on each rotation, so a concurrent call with a stale token would fail.
//
// Mount this hook once in RootNavigator after session hydration is complete.
// The effects only activate when token !== null (i.e. user is authenticated).
// ---------------------------------------------------------------------------
export function useSessionManager(): void {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setToken = useAuthStore((s) => s.setToken);
  const token = useAuthStore((s) => s.token);

  const isRefreshingRef = useRef(false);

  const refreshSession = useCallback(async (): Promise<void> => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;

    try {
      const refreshToken = await getRefreshToken();

      if (!refreshToken) {
        clearAuth();
        return;
      }

      const response = await authService.refresh(refreshToken);

      await saveToken(response.token);
      await saveRefreshToken(response.refresh_token);
      setToken(response.token);
    } catch {
      // Refresh token expired or revoked — session is dead
      clearAuth();
    } finally {
      isRefreshingRef.current = false;
    }
  }, [clearAuth, setToken]);

  // ------------------------------------------------------------------
  // 30-minute proactive refresh while app stays in foreground
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      void refreshSession();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [token, refreshSession]);

  // ------------------------------------------------------------------
  // Refresh when app returns from background → foreground
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!token) return;

    const handleAppStateChange = (nextState: AppStateStatus): void => {
      if (nextState === 'active') {
        void refreshSession();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [token, refreshSession]);
}
