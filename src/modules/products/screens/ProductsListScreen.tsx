import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DeclarativeList } from '@/shared/components';
import type { ProductsStackParamList } from '@/navigation/types';
import type { FilterFieldConfig } from '@/shared/types/filter.types';
import { useCategories } from '@/shared/hooks/useCategories';
import { useBrands } from '@/shared/hooks/useBrands';

import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { useProductFilters } from '../hooks/useProductFilters';
import { DEFAULT_PRODUCT_FILTERS } from '../types/product.types';
import type { Product } from '../types/product.types';

export function ProductsListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProductsStackParamList>>();
  const filters = useProductFilters();
  const { data, isLoading, isFetching, isError, error, refetch, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useProducts(filters.activeFilters);
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const products = data?.pages.flatMap(p => p.data) ?? [];
  const isRefreshing = isFetching && !isFetchingNextPage && products.length > 0;

  const resolveLabel = useCallback((field: FilterFieldConfig, value: string): string => {
    if (field.key === 'categoria') return categories?.find(c => String(c.id) === value)?.categoria ?? value;
    if (field.key === 'marca')     return brands?.find(b => b.marca === value)?.marca ?? value;
    return value;
  }, [categories, brands]);

  return (
    <DeclarativeList<Product>
      data={products}
      isLoading={isLoading}
      error={isError ? error : null}
      keyExtractor={(p) => String(p.id)}
      renderItem={(p) => <ProductCard product={p} onDetailPress={() => navigation.navigate('ProductDetail', { id: p.id })} />}
      filterFields={DEFAULT_PRODUCT_FILTERS}
      filterValues={filters.activeFilters}
      onFilterChange={filters.handleChange}
      onResetFilters={filters.handleClear}
      resolveLabel={resolveLabel}
      filterOptionalMap={{
        categoria: (categories ?? []).map(c => ({ label: c.categoria, value: String(c.id) })),
        marca:     (brands ?? []).map(b => ({ label: b.marca, value: b.marca })),
      }}
      onEndReached={() => { if (hasNextPage && !isFetchingNextPage) void fetchNextPage(); }}
      onRefresh={() => void refetch()}
      isRefreshing={isRefreshing}
    />
  );
}
