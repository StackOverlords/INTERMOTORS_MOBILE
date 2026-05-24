import { create } from 'zustand';

import type { AuthUser } from '../types/auth.types';

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------
type AuthStoreState = {
  token: string | null;
  user: AuthUser | null;
  selectedBranchId: number | null;
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
type AuthStoreActions = {
  setAuth: (token: string, user: AuthUser) => void;
  setToken: (token: string) => void;
  setBranch: (branchId: number) => void;
  clearAuth: () => void;
};


type AuthStore = AuthStoreState & AuthStoreActions;

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
export const useAuthStore = create<AuthStore>((set) => ({
  // State
  token: null,
  user: null,
  selectedBranchId: null,

  // Actions
  setAuth: (token, user) => set({ token, user }),
  setToken: (token) => set({ token }),
  setBranch: (branchId) => set({ selectedBranchId: branchId }),
  clearAuth: () => set({ token: null, user: null, selectedBranchId: null }),
}));
