// ---------------------------------------------------------------------------
// Order — mirrors the desktop OrderGetSchema fields used in mobile
// Endpoint: GET /placeorders (list) and GET /placeorders/:id (detail)
// ---------------------------------------------------------------------------

export interface OrderSupplier {
  id: number;
  proveedor: string;
  direccion: string | null;
  nit: string | null;
  contacto: string | null;
}

export interface OrderResponsable {
  id: number;
  nombre: string;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  celular: string | null;
  dni: number | null;
}

// Desktop situacion_actual values observed in orderGetSchema
export type OrderEstado =
  | 'Pendiente'
  | 'En Tránsito'
  | 'Recibido'
  | 'Cancelado'
  | string; // fallback for unknown server values

export interface Order {
  id: number;
  nro_pedido: string;
  fecha: string;
  comprobante: string | null;
  contexto: string;
  proveedor: OrderSupplier | null;
  responsable: OrderResponsable | null;
  numero_items: number;
  total: number;
  comentarios: string | null;
  fecha_llegada: string | null;
  fecha_transito: string | null;
  situacion_actual: OrderEstado;
}

// ---------------------------------------------------------------------------
// OrderListResponse — matches desktop paginatedResponse { data, meta }
// ---------------------------------------------------------------------------
interface OrderListMeta {
  total: number;
}

export interface OrderListResponse {
  data: Order[];
  meta: OrderListMeta;
}

// ---------------------------------------------------------------------------
// OrderDetailProduct — nested product shape in order detail items
// ---------------------------------------------------------------------------
export interface OrderDetailProduct {
  id: number;
  codigo_interno: string | number;
  codigo_oem: string | null;
  codigo_upc: string | null;
  descripcion: string;
  marca: { marca: string } | null;
  unidad_medida: { unidad_medida: string } | null;
  nro_motor: string | null;
  medida: string | null;
  procedencia: { procedencia: string } | null;
  marca_vehiculo: { marca_vehiculo: string } | null;
}

// ---------------------------------------------------------------------------
// OrderDetailItem — single item row in an order (mirrors OrderDetailGetByIdSchema)
// ---------------------------------------------------------------------------
export interface OrderDetailItem {
  id: number;
  orden: number | null;
  producto: OrderDetailProduct;
  cantidad: number;
  costo: number;
  moneda: string;
  tc_compra: number | null;
  precio_venta: number;
  precio_venta_alt: number;
  inc_precio_venta: number | null;
  inc_precio_venta_alt: number | null;
}

// ---------------------------------------------------------------------------
// OrderDetail — full order returned by GET /placeorders/:id
// Note: different field names from list (Order). NOT extending Order.
// ---------------------------------------------------------------------------
export interface OrderDetail {
  id: number;
  fecha: string;
  nro: string;
  tipo_pedido: string | null;
  comprobante: string | null;
  comentarios: string | null;
  situacion_actual: OrderEstado;
  proveedor: OrderSupplier | null;
  responsable: OrderResponsable | null;
  cantidad_detalles: number;
  fecha_llegada: string | null;
  fecha_transito: string | null;
  detalles: OrderDetailItem[];
}
