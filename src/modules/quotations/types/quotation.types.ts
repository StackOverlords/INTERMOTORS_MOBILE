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

// ---------------------------------------------------------------------------
// QuotationDetailProduct — nested product shape in quotation detail items
// ---------------------------------------------------------------------------
export interface QuotationDetailProduct {
  id: number;
  descripcion: string;
  codigo_oem: string | null;
  codigo_upc: string | null;
  categoria: { categoria: string } | null;
  marca: { marca: string } | null;
  unidad_medida: { unidad_medida: string } | null;
  nro_motor: string | null;
  medida: string | null;
  procedencia: { procedencia: string } | null;
  marca_vehiculo: { marca_vehiculo: string } | null;
}

// ---------------------------------------------------------------------------
// QuotationDetailItem — single item row in a quotation
// API returns decimal fields as strings
// ---------------------------------------------------------------------------
export interface QuotationDetailItem {
  id: number;
  producto: QuotationDetailProduct;
  cantidad: string;
  precio: string;
  monenda: string;
  descuento: string;
  porcentaje_descuento: string | null;
  orden: number | null;
}

// ---------------------------------------------------------------------------
// QuotationDetail — full quotation returned by GET /quotations/:id
// Note: different field names from list (Quotation). NOT extending Quotation.
// ---------------------------------------------------------------------------
export interface QuotationDetail {
  id: number;
  fecha: string;
  nro: string;
  tipo_cotizacion: string | null;
  comprobante: string | null;
  comentarios: string | null;
  anticipo: number;
  es_pedido: boolean;
  vehiculo: string | null;
  nmotor: string | null;
  cliente: QuotationCustomer | null;
  responsable_cotizacion: QuotationResponsible | null;
  detalles: QuotationDetailItem[];
}
