import httpClient from '@/services/http';

import type { Sale, SaleListResponse } from '../types/sale.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Sales service — read-only, no mutations
// ---------------------------------------------------------------------------
export const salesService = {
  async getSales(sucursal: number, page = 1, pageSize = PAGE_SIZE): Promise<SaleListResponse> {
    const response = await httpClient.get<SaleListResponse>('/sales', {
      params: { sucursal, pagina: page, pagina_registros: pageSize },
    });
    return response.data;
  },

  async getSaleById(id: number): Promise<Sale> {
    const response = await httpClient.get<{ data: Sale }>(`/sales/${id}`);
    return response.data.data;
  },
};
