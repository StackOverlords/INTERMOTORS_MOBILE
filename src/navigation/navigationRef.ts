import { createNavigationContainerRef } from '@react-navigation/native';

import type { RootStackParamList } from './types';

// ---------------------------------------------------------------------------
// Global navigation ref — allows navigation from outside React tree
// (e.g. HTTP interceptors, services, background handlers)
// ---------------------------------------------------------------------------
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Navigate to any screen in the root stack.
 * Safe to call even before the navigator is mounted — the call is a no-op
 * when `isReady()` returns false, which is intentional: deep links or
 * auth redirects should not crash when the navigator is still loading.
 */
export function navigate<T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T],
): void {
  if (navigationRef.isReady()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigationRef as any).navigate(name, params);
  }
}
