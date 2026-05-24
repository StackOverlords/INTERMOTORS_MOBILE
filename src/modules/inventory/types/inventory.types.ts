// ---------------------------------------------------------------------------
// Inventory report types — mirrors backend schemas for the three report
// endpoints: /products/reports/general, /products/reports/stockminimo,
// /products/reports/utilidades
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Response item shapes
// ---------------------------------------------------------------------------
export interface InventarioItem {
  codigo: string;
  producto: string;
  compras: number;
  ventas: number;
  stock: number;
  costo_promedio: number;
  valor: number;
}

export interface StockMinimoItem {
  codigo: string;
  producto: string;
  stock_actual: number;
  stock_minimo: number;
  diferencia: number;
}

export interface UtilidadesItem {
  codigo: string;
  producto: string;
  ventas: number;
  importe_costo: number;
  importe_venta: number;
  utilidad: number;
}

// ---------------------------------------------------------------------------
// Paginated response wrapper — used by InventarioGeneral
// ---------------------------------------------------------------------------
export interface PaginatedResponse<T> {
  data: T[];
  pagina: number;
  total_paginas: number;
}

// ---------------------------------------------------------------------------
// Request body shapes — string fields from FilterValues are parsed to their
// correct API types (boolean, number) inside the service before sending.
// ---------------------------------------------------------------------------
export interface InventarioGeneralBody {
  fecha: string;
  sucursal?: number;
  categoria?: number;
  pagina?: number;
  pagina_registros?: number;
  incluir_transito?: boolean;
  ver_solo_con_movimiento?: boolean;
}

export interface StockMinimoBody {
  sucursal: number;
  parametro?: string;
  ver_solo_con_saldo_menorigual_al_minimo?: boolean;
}

export interface UtilidadesBody {
  sucursal: number;
  fecha_inicio: string;
  fecha_fin: string;
}

// ---------------------------------------------------------------------------
// Typed filter value shapes used by inventory filter hooks.
// All values are strings — services parse them before API calls.
// ---------------------------------------------------------------------------
export interface InventoryFilterValues {
  fecha?: string;
  sucursal?: string;
  categoria?: string;
  incluir_transito?: string;       // 'true' | 'false'
  ver_solo_con_movimiento?: string; // 'true' | 'false'
}

export interface MinStockFilterValues {
  parametro?: string;
  ver_solo_con_saldo_menorigual_al_minimo?: string; // 'true' | 'false'
}

export interface UtilidadesFilterValues {
  fecha_inicio?: string;
  fecha_fin?: string;
}
