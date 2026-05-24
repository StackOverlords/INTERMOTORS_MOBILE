import { create } from 'zustand';

import type { SelectedThemeId } from './theme';

export type { SelectedThemeId };

type ThemeStore = {
  /**
   * Currently selected theme.
   * 'system' = follow OS preference (resolves to light or dark-default in ThemeProvider).
   */
  themeId: SelectedThemeId;
  setThemeId: (id: SelectedThemeId) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  themeId: 'system',
  setThemeId: (themeId) => set({ themeId }),
}));
