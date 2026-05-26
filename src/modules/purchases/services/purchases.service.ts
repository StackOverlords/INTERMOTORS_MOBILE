import httpClient from '@/services/http';

import type { PurchaseDetail, PurchaseListResponse } from '../types/purchase.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Purchases service — read-only, no mutations
// ---------------------------------------------------------------------------
export const purchasesService = {
  async getPurchases(sucursal: number, page = 1, pageSize = PAGE_SIZE): Promise<PurchaseListResponse> {
    const response = await httpClient.get<PurchaseListResponse>('/purchases', {
      params: { sucursal, pagina: page, pagina_registros: pageSize },
    });
    return response.data;
  },

  async getPurchaseById(id: number): Promise<PurchaseDetail> {
    const response = await httpClient.get<{ data: PurchaseDetail }>(`/purchases/${id}`);
    return response.data.data;
  },
};
