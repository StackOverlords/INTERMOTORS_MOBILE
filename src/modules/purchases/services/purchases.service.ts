import httpClient from '@/services/http';

import type { PurchaseDetail, PurchaseListResponse, PurchasesFilters } from '../types/purchase.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Purchases service — read-only, no mutations
// ---------------------------------------------------------------------------
export const purchasesService = {
  async getPurchases(
    sucursal: number,
    page = 1,
    pageSize = PAGE_SIZE,
    filters: PurchasesFilters = {},
  ): Promise<PurchaseListResponse> {
    // Strip keys with empty/undefined values before sending to the API
    const activeFilterParams: Record<string, string | number> = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''),
    );

    // Coerce codigo_interno to number — backend expects numeric ID
    if (activeFilterParams.codigo_interno !== undefined) {
      const parsed = Number(activeFilterParams.codigo_interno);
      if (!isNaN(parsed)) {
        activeFilterParams.codigo_interno = parsed;
      } else {
        delete activeFilterParams.codigo_interno;
      }
    }

    // Coerce proveedor to number — backend expects numeric ID
    if (activeFilterParams.proveedor !== undefined) {
      const parsed = Number(activeFilterParams.proveedor);
      if (!isNaN(parsed)) {
        activeFilterParams.proveedor = parsed;
      } else {
        delete activeFilterParams.proveedor;
      }
    }

    const response = await httpClient.get<PurchaseListResponse>('/purchases', {
      params: {
        sucursal,
        pagina: page,
        pagina_registros: pageSize,
        ...activeFilterParams,
      },
    });
    return response.data;
  },

  async getPurchaseById(id: number): Promise<PurchaseDetail> {
    const response = await httpClient.get<{ data: PurchaseDetail }>(`/purchases/${id}`);
    return response.data.data;
  },
};
