import httpClient from '@/services/http';

import type { SaleDetail, SaleListResponse, SalesFilters } from '../types/sale.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Sales service — read-only, no mutations
// ---------------------------------------------------------------------------
export const salesService = {
  async getSales(
    sucursal: number,
    page = 1,
    pageSize = PAGE_SIZE,
    filters: SalesFilters = {},
  ): Promise<SaleListResponse> {
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

    // Coerce cliente to number — backend expects numeric ID
    if (activeFilterParams.cliente !== undefined) {
      const parsed = Number(activeFilterParams.cliente);
      if (!isNaN(parsed)) {
        activeFilterParams.cliente = parsed;
      } else {
        delete activeFilterParams.cliente;
      }
    }

    const response = await httpClient.get<SaleListResponse>('/sales', {
      params: {
        sucursal,
        pagina: page,
        pagina_registros: pageSize,
        ...activeFilterParams,
      },
    });
    return response.data;
  },

  async getSaleById(id: number): Promise<SaleDetail> {
    const response = await httpClient.get<{ data: SaleDetail }>(`/sales/${id}`);
    return response.data.data;
  },
};
