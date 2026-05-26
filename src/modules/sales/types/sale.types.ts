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

// ---------------------------------------------------------------------------
// SaleDetailProduct — nested product shape in detail items
// ---------------------------------------------------------------------------
export interface SaleDetailProduct {
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
// SaleDetailItem — single item row in a sale
// API returns decimal fields (cantidad, precio, descuento) as strings
// ---------------------------------------------------------------------------
export interface SaleDetailItem {
  id: number;
  producto: SaleDetailProduct;
  cantidad: string;
  precio: string;
  monenda: string;
  descuento: string;
  porcentaje_descuento: string | null;
  orden: number | null;
  cantidad_dev: number;
}

// ---------------------------------------------------------------------------
// SaleDetail — full sale shape returned by GET /sales/:id
// Note: different field names from list (Sale). NOT extending Sale.
// ---------------------------------------------------------------------------
export interface SaleDetail {
  id: number;
  fecha: string;
  nro: string;
  tipo_venta: string | null;
  forma_venta: string | null;
  forma_pago: string | null;
  comprobante: string | null;
  comentarios: string | null;
  vehiculo: string | null;
  nmotor: string | null;
  cliente: SaleCustomer | null;
  responsable_venta: SaleResponsible | null;
  detalles: SaleDetailItem[];
}
