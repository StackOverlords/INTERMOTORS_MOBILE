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
