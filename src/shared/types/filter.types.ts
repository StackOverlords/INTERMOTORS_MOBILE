// ---------------------------------------------------------------------------
// Filter — config-driven filter system types.
// Used by FilterBottomSheet and any module that exposes filterable lists.
// ---------------------------------------------------------------------------

export type FilterFieldType = 'text' | 'number' | 'select' | 'date' | 'boolean';

/** Option item for select-type fields */
export interface SelectOption {
  label: string;
  value: string; // siempre string — HTTP params son strings
}

export interface FilterFieldConfig {
  /** Maps to the backend query param key */
  key: string;
  /** Human-readable label shown in the UI */
  label: string;
  type: FilterFieldType;
  placeholder?: string;
  /** If false, the field is NOT rendered */
  enabled: boolean;
  /** If true, the user can toggle visibility of this field */
  toggleable: boolean;
}

/** Flat map of active filter values — keys mirror FilterFieldConfig.key */
export type FilterValues = Partial<Record<string, string>>;

/** @deprecated Use FilterValues instead */
export type ProductFilterValues = FilterValues;
