import httpClient from '@/services/http';

import type { Transfer, TransferDetail, TransferListResponse, TransfersFilters } from '../types/transfer.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Transfers service — read-only, no mutations
// ---------------------------------------------------------------------------
export const transfersService = {
  async getTransfers(
    sucursal: number,
    page = 1,
    pageSize = PAGE_SIZE,
    filters: TransfersFilters = {},
  ): Promise<TransferListResponse> {
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

    // Coerce sucursal_origen to number — backend expects numeric ID
    if (activeFilterParams.sucursal_origen !== undefined) {
      const parsed = Number(activeFilterParams.sucursal_origen);
      if (!isNaN(parsed)) {
        activeFilterParams.sucursal_origen = parsed;
      } else {
        delete activeFilterParams.sucursal_origen;
      }
    }

    // Coerce sucursal_destino to number — backend expects numeric ID
    if (activeFilterParams.sucursal_destino !== undefined) {
      const parsed = Number(activeFilterParams.sucursal_destino);
      if (!isNaN(parsed)) {
        activeFilterParams.sucursal_destino = parsed;
      } else {
        delete activeFilterParams.sucursal_destino;
      }
    }

    const response = await httpClient.get<TransferListResponse>('/transfers', {
      params: {
        sucursal,
        pagina: page,
        pagina_registros: pageSize,
        ...activeFilterParams,
      },
    });
    return response.data;
  },

  async getTransferById(id: number): Promise<TransferDetail> {
    const response = await httpClient.get<{ data: TransferDetail }>(`/transfers/${id}`);
    return response.data.data;
  },
};
