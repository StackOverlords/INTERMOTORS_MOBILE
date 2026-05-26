import type { FilterFieldConfig, SelectOption } from '@/shared/types/filter.types';

// ---------------------------------------------------------------------------
// OrdersFilters — flat map of query params for the orders list.
// Numeric IDs are kept as strings here — coerced to number in service layer.
// ---------------------------------------------------------------------------
export type OrdersFilters = Partial<{
  codigo_interno: string;      // numeric as string — coerced to number in service
  proveedor: string;           // numeric ID as string — coerced to number in service
  keywords: string;
  situacion_actual: string;    // P | C | T | A | D
  fecha_inicio: string;
  fecha_fin: string;
  codigo_oem_producto: string;
}>;

// ---------------------------------------------------------------------------
// SITUACION_ACTUAL_OPTIONS — select options for situacion_actual filter
// ---------------------------------------------------------------------------
export const SITUACION_ACTUAL_OPTIONS: SelectOption[] = [
  { label: 'Preparación', value: 'P' },
  { label: 'Cotización', value: 'C' },
  { label: 'Tránsito', value: 'T' },
  { label: 'Almacén', value: 'A' },
  { label: 'Disponible', value: 'D' },
];

// ---------------------------------------------------------------------------
// DEFAULT_ORDERS_FILTERS — config-driven filter fields for the orders list.
// 4 always-visible + 3 toggleable fields.
// ---------------------------------------------------------------------------
export const DEFAULT_ORDERS_FILTERS: FilterFieldConfig[] = [
  // --- Always-visible fields ---
  { key: 'codigo_interno',      label: 'Nro. Pedido',    type: 'number', enabled: true,  toggleable: false, placeholder: 'Número de pedido...' },
  { key: 'proveedor',           label: 'Proveedor (ID)', type: 'number', enabled: true,  toggleable: false, placeholder: 'ID del proveedor...' },
  { key: 'keywords',            label: 'Buscar',         type: 'text',   enabled: true,  toggleable: false, placeholder: 'Comentarios, comprobante...' },
  { key: 'situacion_actual',    label: 'Estado actual',  type: 'select', enabled: true,  toggleable: false },

  // --- Optional/toggleable fields ---
  { key: 'fecha_inicio',        label: 'Desde',          type: 'date',   enabled: false, toggleable: true, placeholder: 'YYYY-MM-DD' },
  { key: 'fecha_fin',           label: 'Hasta',          type: 'date',   enabled: false, toggleable: true, placeholder: 'YYYY-MM-DD' },
  { key: 'codigo_oem_producto', label: 'Código OEM',     type: 'text',   enabled: false, toggleable: true, placeholder: 'Código OEM del producto...' },
];

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
