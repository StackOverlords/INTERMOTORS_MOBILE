import httpClient from '@/services/http';

import type { Product, ProductFilterValues, ProductListResponse } from '../types/product.types';

// ---------------------------------------------------------------------------
// Products service — read-only, no mutations
// ---------------------------------------------------------------------------
export const productsService = {
  async getProducts(
    sucursalId: number,
    page = 1,
    pageSize = 20,
    filters: ProductFilterValues = {},
  ): Promise<{ data: Product[]; total: number }> {
    // Strip keys with empty/undefined values before sending to the API
    const activeFilterParams = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''),
    );

    const response = await httpClient.get<ProductListResponse>('/products', {
      params: {
        sucursal: sucursalId,
        pagina: page,
        pagina_registros: pageSize,
        ...activeFilterParams,
      },
    });
    return { data: response.data.data, total: response.data.meta.total };
  },

  async getProductById(id: number): Promise<Product> {
    const response = await httpClient.get<{ data: Product }>(`/products/${id}`);
    return response.data.data;
  },
};
