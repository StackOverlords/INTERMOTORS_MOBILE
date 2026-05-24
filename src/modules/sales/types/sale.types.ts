// ---------------------------------------------------------------------------
// SaleCustomer — mirrors desktop SaleCustomerGetSchema fields used in list
// ---------------------------------------------------------------------------
export interface SaleCustomer {
  id: number;
  cliente: string;
  nro_cliente: number;
  direccion: string | null;
  contacto: string | null;
  celular: string | null;
}

// ---------------------------------------------------------------------------
// SaleResponsible — mirrors desktop SaleResponsibleSchema
// ---------------------------------------------------------------------------
export interface SaleResponsible {
  id: number;
  nombre: string;
  apellido_paterno: string | null;
  apellido_materno: string | null;
}

// ---------------------------------------------------------------------------
// Sale — mirrors desktop saleGetAllSchema (list item shape)
// ---------------------------------------------------------------------------
export interface Sale {
  id: number;
  nro_venta: string;
  fecha: string;
  comprobantes: string | null;
  contexto: string | null;
  cliente: SaleCustomer | null;
  responsable: SaleResponsible | null;
  total: number;
  comentarios: string | null;
}

// ---------------------------------------------------------------------------
// SaleListMeta — pagination meta from desktop paginatedResponseSchema
// ---------------------------------------------------------------------------
export interface SaleListMeta {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

// ---------------------------------------------------------------------------
// SaleListResponse — paginated API response shape
// ---------------------------------------------------------------------------
export interface SaleListResponse {
  data: Sale[];
  meta: SaleListMeta;
}
