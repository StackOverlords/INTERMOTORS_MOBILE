import httpClient from '@/services/http';

import type { Transfer, TransferDetail, TransferListResponse } from '../types/transfer.types';

// ---------------------------------------------------------------------------
// Transfers service — read-only, no mutations
// ---------------------------------------------------------------------------
export const transfersService = {
  async getTransfers(
    sucursal: number,
    pagina = 1,
    pagina_registros = 20,
  ): Promise<Transfer[]> {
    const response = await httpClient.get<TransferListResponse>('/transfers', {
      params: { sucursal, pagina, pagina_registros },
    });
    return response.data.data;
  },

  async getTransferById(id: number): Promise<TransferDetail> {
    const response = await httpClient.get<{ data: TransferDetail }>(`/transfers/${id}`);
    return response.data.data;
  },
};
