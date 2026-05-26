import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { ThemeProvider as RestyleThemeProvider } from '@shopify/restyle';

import { THEME_REGISTRY } from './theme';
import type { ThemeId } from './theme';
import { useThemeStore } from './themeStore';

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider = ({ children }: AppThemeProviderProps): React.JSX.Element | null => {
  const systemScheme = useColorScheme();
  const themeId = useThemeStore((s) => s.themeId);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Wait for zustand persist to rehydrate from AsyncStorage before rendering
    const unsub = useThemeStore.persist.onFinishHydration(() => setHydrated(true));
    if (useThemeStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return unsub;
  }, []);

  if (!hydrated) {
    return null;
  }

  const resolvedId: ThemeId =
    themeId === 'system'
      ? systemScheme === 'dark'
        ? 'dark-amoled'
        : 'light'
      : themeId;

  const isDark = resolvedId.startsWith('dark');

  return (
    <RestyleThemeProvider theme={THEME_REGISTRY[resolvedId]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />
      {children}
    </RestyleThemeProvider>
  );
};
