import { reportHttpClient } from '@/services/http';

import type {
  InventarioGeneralBody,
  InventarioItem,
  PaginatedResponse,
  StockMinimoBody,
  StockMinimoItem,
  UtilidadesBody,
  UtilidadesItem,
} from '../types/inventory.types';

// ---------------------------------------------------------------------------
// Inventory service — all endpoints use POST with JSON body.
// Uses reportHttpClient (120s timeout) because report queries can be slow.
// ---------------------------------------------------------------------------
export const inventoryService = {
  /**
   * Fetches a paginated general inventory report.
   * Pagination is driven by the `pagina` field in the request body.
   */
  async getGeneral(
    body: InventarioGeneralBody,
    page: number,
  ): Promise<PaginatedResponse<InventarioItem>> {
    const response = await reportHttpClient.post<PaginatedResponse<InventarioItem>>(
      '/products/reports/general',
      { ...body, pagina: page },
    );
    return response.data;
  },

  /**
   * Fetches the full minimum-stock report for a branch.
   * NOT paginated — server returns the entire dataset at once.
   */
  async getMinStock(body: StockMinimoBody): Promise<StockMinimoItem[]> {
    const response = await reportHttpClient.post<StockMinimoItem[]>(
      '/products/reports/stockminimo',
      body,
    );
    return response.data;
  },

  /**
   * Fetches the profitability (utilidades) report for a branch and date range.
   * NOT paginated — server returns the entire dataset at once.
   */
  async getUtilidades(body: UtilidadesBody): Promise<UtilidadesItem[]> {
    const response = await reportHttpClient.post<UtilidadesItem[]>(
      '/products/reports/utilidades',
      body,
    );
    return response.data;
  },
};
