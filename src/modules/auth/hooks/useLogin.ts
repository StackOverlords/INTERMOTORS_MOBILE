import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { saveToken, saveRefreshToken } from '@/services/keychain';

import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/authStore';
import type { LoginCredentials, LoginResponse } from '../types/auth.types';

// ---------------------------------------------------------------------------
// useLogin — wraps the login mutation with side-effects
// ---------------------------------------------------------------------------
export function useLogin(): UseMutationResult<LoginResponse, Error, LoginCredentials> {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: async (response) => {
      const { token, refresh_token, id, name, full_name, email, sucursales } = response.resultado.data;

      const user: import('../types/auth.types').AuthUser = {
        id,
        name,
        full_name,
        email,
        sucursales,
      };

      // 1. Persist tokens in secure storage
      await saveToken(token);
      await saveRefreshToken(refresh_token);

      // 2. Hydrate Zustand store (selectedBranchId stays null — BranchSelector sets it)
      useAuthStore.getState().setAuth(token, user);

      // 3. Persist user for session recovery across app restarts
      await AsyncStorage.setItem('intermotors_auth_user', JSON.stringify(user));

      // 4. Auto-restore last selected branch if still valid for this user
      const savedBranchId = await AsyncStorage.getItem('intermotors_branch_id');
      if (savedBranchId) {
        const branchId = Number(savedBranchId);
        const isValid = sucursales.some((s) => s.id === branchId);
        if (isValid) {
          useAuthStore.getState().setBranch(branchId);
        }
      }
    },
  });
}
