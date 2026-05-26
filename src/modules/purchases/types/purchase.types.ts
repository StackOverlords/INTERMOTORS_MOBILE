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
