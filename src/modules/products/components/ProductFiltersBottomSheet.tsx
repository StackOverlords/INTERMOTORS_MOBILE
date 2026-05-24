import React, { useMemo } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

import { FilterBottomSheet } from '@/shared/components/FilterBottomSheet';
import { useBrands } from '@/shared/hooks/useBrands';
import { useCategories } from '@/shared/hooks/useCategories';
import type { SelectOption } from '@/shared/types/filter.types';
import { DEFAULT_PRODUCT_FILTERS } from '../types/product.types';
import type { ProductFilterValues } from '../types/product.types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface ProductFiltersBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
  values: ProductFilterValues;
  onChange: (values: ProductFilterValues) => void;
  onClear: () => void;
}

// ---------------------------------------------------------------------------
// Component — injects DEFAULT_PRODUCT_FILTERS + dynamic select options
// ---------------------------------------------------------------------------
export function ProductFiltersBottomSheet({
  bottomSheetRef,
  values,
  onChange,
  onClear,
}: ProductFiltersBottomSheetProps) {
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();

  const optionsMap = useMemo<Record<string, SelectOption[]>>(() => ({
    categoria: (categories ?? []).map(c => ({
      label: c.categoria,
      value: String(c.id), // backend espera el ID como string en query param
    })),
    marca: (brands ?? []).map(b => ({
      label: b.marca,
      value: b.marca, // backend filtra por nombre, igual que en desktop
    })),
  }), [categories, brands]);

  return (
    <FilterBottomSheet
      bottomSheetRef={bottomSheetRef}
      fields={DEFAULT_PRODUCT_FILTERS}
      values={values}
      optionsMap={optionsMap}
      onChange={onChange}
      onClear={onClear}
    />
  );
}
