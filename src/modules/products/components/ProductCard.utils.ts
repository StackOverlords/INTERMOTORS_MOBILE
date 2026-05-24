// ---------------------------------------------------------------------------
// Stock thresholds — single place to change business rules.
// LOW: stock <= 10 → danger, MID: stock <= 50 → warning, else → success
// ---------------------------------------------------------------------------
export const STOCK_THRESHOLDS = {
  LOW: 10,
  MID: 50,
} as const;

// ---------------------------------------------------------------------------
// Currency config — default is Bolivianos (BOB / es-BO)
// ---------------------------------------------------------------------------
export type CurrencyConfig = {
  code: string;
  locale: string;
};

export const DEFAULT_CURRENCY: CurrencyConfig = {
  code: 'BOB',
  locale: 'es-BO',
};

// ---------------------------------------------------------------------------
// Badge variant union — redeclared locally to avoid cross-module coupling
// with Badge.tsx (which does not export this type).
// ---------------------------------------------------------------------------
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

// ---------------------------------------------------------------------------
// getStockVariant — pure function, no side effects.
// Maps a numeric stock value to the appropriate Badge semantic variant.
// ---------------------------------------------------------------------------
export function getStockVariant(stock: number): BadgeVariant {
  if (stock <= STOCK_THRESHOLDS.LOW) return 'danger';
  if (stock <= STOCK_THRESHOLDS.MID) return 'warning';
  return 'success';
}
