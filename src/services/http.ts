import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { ENV } from '@/config/environment';
import { navigationRef } from '@/navigation/navigationRef';
import { deleteToken, getToken } from '@/services/keychain';

console.log('[HTTP] baseURL:', ENV.API_BASE_URL);

// ============================================================================
// INTERCEPTOR FACTORIES — shared between all axios instances
// ============================================================================

function attachRequestInterceptor(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log('[HTTP] →', config.method?.toUpperCase(), config.baseURL + config.url);

      return config;
    },
    (error: unknown) => Promise.reject(error),
  );
}

function attachResponseInterceptor(instance: AxiosInstance): void {
  instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: unknown) => {
      if (axios.isAxiosError(error)) {
        console.log('[HTTP] ✗ error:', error.message, '| status:', error.response?.status, '| url:', error.config?.url);

        if (error.response?.status === 401 && navigationRef.isReady()) {
          await deleteToken();
          navigationRef.navigate('Auth' as never);
        }
      }

      return Promise.reject(error);
    },
  );
}

// ============================================================================
// apiClient — standard 10s timeout, used by all non-report endpoints
// ============================================================================
const apiClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

attachRequestInterceptor(apiClient);
attachResponseInterceptor(apiClient);

// ============================================================================
// reportHttpClient — 120s timeout for long-running report endpoints.
// Shares the same auth + 401-redirect interceptors as apiClient.
// Use this for: POST /products/reports/*, POST /sales/reports/*
// ============================================================================
export const reportHttpClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

attachRequestInterceptor(reportHttpClient);
attachResponseInterceptor(reportHttpClient);

export default apiClient;
