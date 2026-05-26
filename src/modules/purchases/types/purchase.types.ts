import type { FilterFieldConfig } from '@/shared/types/filter.types';

// ---------------------------------------------------------------------------
// PurchasesFilters — flat map of query params for the purchases list
// Numeric IDs are kept as strings here — coerced to number in service layer
// ---------------------------------------------------------------------------
export type PurchasesFilters = Partial<{
  codigo_interno: string;         // numeric as string — coerced to number in service
  proveedor: string;              // numeric ID as string — coerced to number in service
  keywords: string;
  fecha_inicio: string;
  fecha_fin: string;
  codigo_oem_producto: string;
}>;

// ---------------------------------------------------------------------------
// DEFAULT_PURCHASES_FILTERS — config-driven filter fields for the purchases list.
// 3 always-visible + 3 toggleable fields.
// ---------------------------------------------------------------------------
export const DEFAULT_PURCHASES_FILTERS: FilterFieldConfig[] = [
  // --- Always-visible fields ---
  { key: 'codigo_interno',      label: 'Nro. Compra',    type: 'number', enabled: true,  toggleable: false, placeholder: 'Número de compra...' },
  { key: 'proveedor',           label: 'Proveedor (ID)', type: 'number', enabled: true,  toggleable: false, placeholder: 'ID del proveedor...' },
  { key: 'keywords',            label: 'Buscar',         type: 'text',   enabled: true,  toggleable: false, placeholder: 'Comentarios, comprobante...' },

  // --- Optional/toggleable fields ---
  { key: 'fecha_inicio',        label: 'Desde',          type: 'date',   enabled: false, toggleable: true,  placeholder: 'YYYY-MM-DD' },
  { key: 'fecha_fin',           label: 'Hasta',          type: 'date',   enabled: false, toggleable: true,  placeholder: 'YYYY-MM-DD' },
  { key: 'codigo_oem_producto', label: 'Código OEM',     type: 'text',   enabled: false, toggleable: true,  placeholder: 'Código OEM del producto...' },
];

// ---------------------------------------------------------------------------
// PurchaseProvider — mirrors desktop purchaseProviderGetSchema fields
// ---------------------------------------------------------------------------
export interface PurchaseProvider {
  id: number;
  proveedor: string;
}

// ---------------------------------------------------------------------------
// PurchaseResponsible — mirrors desktop purchaseResponsibleSchema
// ---------------------------------------------------------------------------
export interface PurchaseResponsible {
  id: number;
  nombre: string;
  apellido_paterno: string | null;
  apellido_materno: string | null;
}

// ---------------------------------------------------------------------------
// Purchase — mirrors desktop purchaseGetAllSchema (list item shape)
// ---------------------------------------------------------------------------
export interface Purchase {
  id: number;
  nro_compra: string;
  fecha: string;
  comprobantes: string | null;
  contexto: string | null;
  proveedor: PurchaseProvider;
  responsable: PurchaseResponsible | null;
  total: number;
  comentarios: string | null;
}

// ---------------------------------------------------------------------------
// PurchaseListMeta — pagination meta from desktop paginatedResponseSchema
// ---------------------------------------------------------------------------
export interface PurchaseListMeta {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

// ---------------------------------------------------------------------------
// PurchaseListResponse — paginated API response shape
// ---------------------------------------------------------------------------
export interface PurchaseListResponse {
  data: Purchase[];
  meta: PurchaseListMeta;
}

// ---------------------------------------------------------------------------
// PurchaseDetailProduct — nested product shape in purchase detail items
// ---------------------------------------------------------------------------
export interface PurchaseDetailProduct {
  id: number;
  descripcion: string;
  codigo_interno: string | number;
  codigo_oem: string | null;
  medida: string | null;
  nro_motor: string | null;
  categoria: { categoria: string } | null;
  marca: { marca: string } | null;
  unidad_medida: { unidad_medida: string } | null;
  procedencia: { procedencia: string } | null;
  marca_vehiculo: { marca_vehiculo: string } | null;
}

// ---------------------------------------------------------------------------
// PurchaseDetailItem — single item row in a purchase (mirrors PurchaseDetailSchema)
// API returns cantidad/costo as strings
// ---------------------------------------------------------------------------
export interface PurchaseDetailItem {
  id: number;
  producto: PurchaseDetailProduct;
  cantidad: string;
  costo: string;
  moneda: string | null;
  tc_compra: string | null;
}

// ---------------------------------------------------------------------------
// PurchaseDetail — full purchase returned by GET /purchases/:id
// Note: different field names from list (Purchase). NOT extending Purchase.
// ---------------------------------------------------------------------------
export interface PurchaseDetail {
  id: number;
  fecha: string;
  nro: string;
  tipo_compra: string | null;
  comprobante: string | null;
  comentarios: string | null;
  proveedor: PurchaseProvider;
  responsable: PurchaseResponsible | null;
  cantidad_detalles: number;
  detalles: PurchaseDetailItem[];
}
