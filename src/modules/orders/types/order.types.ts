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
