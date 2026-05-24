import { useCallback, useRef, useState } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

import type { FilterValues } from '@/shared/types/filter.types';

// ---------------------------------------------------------------------------
// useListFilters — generic filter state hook for any declarative list.
//
// Two-phase model:
//   values        → draft being edited inside the bottom sheet (live updates)
//   activeFilters → committed state that drives the API query
//                   (updated when the user taps "Aplicar")
// ---------------------------------------------------------------------------
export function useListFilters<TValues extends FilterValues = FilterValues>(
  initial: TValues = {} as TValues,
) {
  const [values, setValues] = useState<TValues>(initial);
  const [activeFilters, setActiveFilters] = useState<TValues>(initial);
  const sheetRef = useRef<BottomSheetModal>(null);

  const handleChange = useCallback((next: TValues) => {
    setValues(next);
    setActiveFilters(next);
  }, []);

  const handleClear = useCallback(() => {
    setValues({} as TValues);
    setActiveFilters({} as TValues);
  }, []);

  const handleRemoveFilter = useCallback((key: string) => {
    setValues(prev => { const n = { ...prev }; delete (n as Record<string, unknown>)[key]; return n; });
    setActiveFilters(prev => { const n = { ...prev }; delete (n as Record<string, unknown>)[key]; return n; });
  }, []);

  const openSheet = useCallback(() => { sheetRef.current?.present(); }, []);
  const closeSheet = useCallback(() => { sheetRef.current?.dismiss(); }, []);

  const hasActive = Object.values(activeFilters).some(v => v !== undefined && v !== '');

  return {
    values,
    activeFilters,
    handleChange,
    handleClear,
    handleRemoveFilter,
    hasActive,
    sheetRef,
    openSheet,
    closeSheet,
  };
}
