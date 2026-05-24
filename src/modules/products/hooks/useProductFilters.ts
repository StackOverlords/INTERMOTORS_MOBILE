import type { FilterValues } from '@/shared/types/filter.types';
import { useListFilters } from '@/shared/hooks/useListFilters';

export function useProductFilters() {
  const filters = useListFilters<FilterValues>();
  return {
    ...filters,
    hasActiveFilters: filters.hasActive,
  };
}
