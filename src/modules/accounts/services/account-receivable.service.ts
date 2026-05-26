import httpClient from '@/services/http';

import type {
  AccountReceivable,
  AccountReceivableFilters,
  AccountReceivableListResponse,
  AccountReceivablePayment,
} from '../types/account-receivable.types';

// ---------------------------------------------------------------------------
// ACCOUNT_RECEIVABLE_ENDPOINT — SINGULAR, not plural.
// The backend route is /account-receivable (singular).
// Do NOT change this to /accounts-receivable — it will 404.
// ---------------------------------------------------------------------------
const ACCOUNT_RECEIVABLE_ENDPOINT = '/account-receivable';

// ---------------------------------------------------------------------------
// accountReceivableService — read-only, no mutations
// ---------------------------------------------------------------------------
export const accountReceivableService = {
  async getList(
    sucursal: number,
    page = 1,
    pageSize = 20,
    filters: AccountReceivableFilters = {},
  ): Promise<{ data: AccountReceivable[]; total: number }> {
    // Strip keys with empty/undefined values before sending to the API
    const activeFilterParams: Record<string, string | number> = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''),
    );

    // Coerce cliente to number — the backend expects a numeric ID, not a string
    if (activeFilterParams.cliente !== undefined) {
      const parsed = Number(activeFilterParams.cliente);
      if (!isNaN(parsed)) {
        activeFilterParams.cliente = parsed;
      } else {
        delete activeFilterParams.cliente;
      }
    }

    const response = await httpClient.get<AccountReceivableListResponse>(
      ACCOUNT_RECEIVABLE_ENDPOINT,
      {
        params: {
          sucursal,
          pagina: page,
          pagina_registros: pageSize,
          ...activeFilterParams,
        },
      },
    );

    return {
      data: response.data.data,
      total: response.data.meta.total,
    };
  },

  async getPayments(idVenta: number): Promise<AccountReceivablePayment[]> {
    const response = await httpClient.get<{ data: AccountReceivablePayment[] }>(
      `/accounts-receivable/actions/payments/${idVenta}`,
    );
    return response.data.data;
  },
};
