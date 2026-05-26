import httpClient from '@/services/http';

import type { OrderDetail, OrderListResponse } from '../types/order.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// Orders service — read-only, no mutations
// Endpoint base: /placeorders (mirrors desktop ORDER_ENDPOINTS)
// ---------------------------------------------------------------------------
export const ordersService = {
  async getOrders(sucursal: number, page = 1, pageSize = PAGE_SIZE): Promise<OrderListResponse> {
    const response = await httpClient.get<OrderListResponse>('/placeorders', {
      params: { sucursal, pagina: page, pagina_registros: pageSize },
    });
    return response.data;
  },

  async getOrderById(id: number): Promise<OrderDetail> {
    const response = await httpClient.get<{ data: OrderDetail }>(`/placeorders/${id}`);
    return response.data.data;
  },
};
