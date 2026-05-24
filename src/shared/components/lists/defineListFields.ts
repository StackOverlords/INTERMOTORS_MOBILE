export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface ListFieldConfig<T> {
  key: string;
  label: string;
  accessor: (item: T) => unknown;
  format?: (value: unknown, item: T) => string;
  variant?: 'text' | 'badge' | 'currency' | 'date';
  badgeVariant?: BadgeVariant | ((value: unknown) => BadgeVariant);
}

export function defineListFields<T>(fields: ListFieldConfig<T>[]): ListFieldConfig<T>[] {
  return fields;
}
