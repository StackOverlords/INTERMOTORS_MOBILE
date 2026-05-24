import { useInfiniteQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/modules/auth/stores/authStore';
import { productsService } from '../services/products.service';
import type { ProductFilterValues } from '../types/product.types';

const PAGE_SIZE = 20;

// ---------------------------------------------------------------------------
// useProducts — infinite-scrollable list of products for the selected branch.
// Filters change → queryKey changes → React Query resets to page 1 automatically.
// ---------------------------------------------------------------------------
export function useProducts(filters: ProductFilterValues = {}) {
  const sucursalId = useAuthStore((s) => s.selectedBranchId);

  return useInfiniteQuery({
    queryKey: ['products', sucursalId, filters],
    queryFn: ({ pageParam }) =>
      productsService.getProducts(sucursalId!, pageParam, PAGE_SIZE, filters),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((acc, p) => acc + p.data.length, 0);
      return loadedCount < lastPage.total ? allPages.length + 1 : undefined;
    },
    enabled: sucursalId !== null,
  });
}

// ---------------------------------------------------------------------------
// useProduct — single product by id
// ---------------------------------------------------------------------------
export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsService.getProductById(id),
  });
}
