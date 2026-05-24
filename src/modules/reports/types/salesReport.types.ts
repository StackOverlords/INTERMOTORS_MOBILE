// ---------------------------------------------------------------------------
// Sales report types — mirrors backend schemas for:
//   POST /sales/reports/general
//   POST /sales/reports/masvendido
// Both endpoints receive multipart/form-data and return non-paginated results.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Response item shape — shared by both report endpoints
// ---------------------------------------------------------------------------
export interface SalesReportItem {
  sucursal: string;
  codigo: string;
  producto: string;
  cantidad: number;
  precio_medio: number;
  importe_costo: number;
  total: number;
}

// ---------------------------------------------------------------------------
// Filter shapes — used by hooks and service
// ---------------------------------------------------------------------------
export interface SalesReportFilters {
  fecha_inicio: string;     // required, YYYY-MM-DD
  fecha_fin?: string;       // optional
  sucursal?: number;        // optional branch ID — omitted when undefined
}

export interface BestSellersFilters extends SalesReportFilters {
  ranking: number;          // required, min 1
}
