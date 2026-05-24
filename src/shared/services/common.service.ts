import httpClient from '@/services/http';

import type { Brand, Category } from '../types/common.types';

interface ListResponse<T> {
  data: T[];
}

export const commonService = {
  async getCategories(): Promise<Category[]> {
    const response = await httpClient.get<ListResponse<Category>>(
      '/products/commons/categories',
    );
    return response.data.data;
  },

  async getBrands(): Promise<Brand[]> {
    const response = await httpClient.get<ListResponse<Brand>>(
      '/products/commons/brands',
    );
    return response.data.data;
  },
};
