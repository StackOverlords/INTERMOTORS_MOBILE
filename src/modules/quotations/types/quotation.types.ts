// ---------------------------------------------------------------------------
// QuotationCustomer — mirrors desktop SaleCustomerGetSchema extended in
// QuotationGetSchema (includes telefono + celular fields)
// ---------------------------------------------------------------------------
export interface QuotationCustomer {
  id: number;
  nro_cliente: number;
  cliente: string;
  nit: number | null;
  direccion: string | null;
  contacto: string | null;
  celular: string | null;
  telefono: string | null;
}

// ---------------------------------------------------------------------------
// QuotationResponsible — mirrors desktop SaleResponsibleSchema
// ---------------------------------------------------------------------------
export interface QuotationResponsible {
  id: number;
  nombre: string;
}

// ---------------------------------------------------------------------------
// Quotation — mirrors desktop QuotationGetSchema used in the list view
// ---------------------------------------------------------------------------
export interface Quotation {
  id: number;
  nro_cotizacion: string;
  fecha: string;
  comprobantes: string | null;
  contexto: string | null;
  total: number;
  comentarios: string | null;
  anticipo: number;
  pedido: boolean;
  vehiculo: string | null;
  nmotor: string | null;
  cliente: QuotationCustomer | null;
  responsable: QuotationResponsible | null;
}

// ---------------------------------------------------------------------------
// QuotationListResponse — paginated wrapper matching desktop paginatedResponse
// ---------------------------------------------------------------------------
interface QuotationListMeta {
  total: number;
}

export interface QuotationListResponse {
  data: Quotation[];
  meta: QuotationListMeta;
}
