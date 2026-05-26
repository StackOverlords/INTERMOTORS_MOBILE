import httpClient from '@/services/http';

import type { QuotationDetail, QuotationListResponse } from '../types/quotation.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Quotations service — read-only, no mutations
// ---------------------------------------------------------------------------
export const quotationsService = {
  async getQuotations(sucursal: number, page = 1, pageSize = PAGE_SIZE): Promise<QuotationListResponse> {
    const response = await httpClient.get<QuotationListResponse>('/quotations', {
      params: { sucursal, pagina: page, pagina_registros: pageSize },
    });
    return response.data;
  },

  async getQuotationById(id: number): Promise<QuotationDetail> {
    const response = await httpClient.get<{ data: QuotationDetail }>(`/quotations/${id}`);
    return response.data.data;
  },
};
