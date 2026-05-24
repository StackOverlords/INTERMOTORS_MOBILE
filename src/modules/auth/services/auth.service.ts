import axios from 'axios';

import { ENV } from '@/config/environment';
import httpClient from '@/services/http';

import type { LoginCredentials, LoginResponse, RefreshResponse } from '../types/auth.types';

// ---------------------------------------------------------------------------
// Clean Axios instance — no interceptors.
// Used for /refresh so the refresh_token is sent as Bearer (not the access_token).
// The main httpClient interceptor always injects the access_token — wrong for /refresh.
// ---------------------------------------------------------------------------
const authClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ---------------------------------------------------------------------------
// Auth service — wraps the /login, /refresh and /logout endpoints
// ---------------------------------------------------------------------------

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>('/login', credentials);
    return response.data;
  },

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const response = await authClient.post<RefreshResponse>('/refresh', null, {
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await httpClient.post('/logout');
    } catch {
      // fire and forget — never throw on logout
    }
  },
};
