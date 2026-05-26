import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SelectedThemeId } from './theme';

export type { SelectedThemeId };

type ThemeStore = {
  themeId: SelectedThemeId;
  setThemeId: (id: SelectedThemeId) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      themeId: 'system',
      setThemeId: (themeId) => set({ themeId }),
    }),
    {
      name: 'intermotors_theme',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
