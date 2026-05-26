import httpClient from '@/services/http';

import type { OrderDetail, OrderListResponse, OrdersFilters } from '../types/order.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Orders service — read-only, no mutations
// Endpoint base: /placeorders (mirrors desktop ORDER_ENDPOINTS)
// ---------------------------------------------------------------------------
export const ordersService = {
  async getOrders(
    sucursal: number,
    page = 1,
    pageSize = PAGE_SIZE,
    filters: OrdersFilters = {},
  ): Promise<OrderListResponse> {
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

    const response = await httpClient.get<OrderListResponse>('/placeorders', {
      params: {
        sucursal,
        pagina: page,
        pagina_registros: pageSize,
        ...activeFilterParams,
      },
    });
    return response.data;
  },

  async getOrderById(id: number): Promise<OrderDetail> {
    const response = await httpClient.get<{ data: OrderDetail }>(`/placeorders/${id}`);
    return response.data.data;
  },
};
