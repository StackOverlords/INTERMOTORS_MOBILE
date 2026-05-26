import type { FilterFieldConfig } from '@/shared/types/filter.types';

// ---------------------------------------------------------------------------
// TransfersFilters — flat map of query params for the transfers list.
// Numeric IDs are kept as strings here — coerced to number in service layer.
// ---------------------------------------------------------------------------
export type TransfersFilters = Partial<{
  codigo_interno: string;      // numeric as string — coerced to number in service
  keywords: string;
  estado_a_sucursal: string;   // boolean sent as string — passed as-is to backend
  estado_en_sucursal: string;  // boolean sent as string — passed as-is to backend
  sucursal_origen: string;     // numeric ID as string — coerced to number in service
  sucursal_destino: string;    // numeric ID as string — coerced to number in service
  fecha_inicio: string;
  fecha_fin: string;
  codigo_oem_producto: string;
}>;

// ---------------------------------------------------------------------------
// DEFAULT_TRANSFERS_FILTERS — config-driven filter fields for the transfers list.
// 4 always-visible + 5 toggleable fields.
// ---------------------------------------------------------------------------
export const DEFAULT_TRANSFERS_FILTERS: FilterFieldConfig[] = [
  // --- Always-visible fields ---
  { key: 'codigo_interno',      label: 'Nro. Traslado',    type: 'number',  enabled: true,  toggleable: false, placeholder: 'Número de traslado...' },
  { key: 'keywords',            label: 'Buscar',           type: 'text',    enabled: true,  toggleable: false, placeholder: 'Comentarios, comprobante...' },
  { key: 'estado_a_sucursal',   label: 'Transferido',      type: 'boolean', enabled: true,  toggleable: false },
  { key: 'estado_en_sucursal',  label: 'Recepcionado',     type: 'boolean', enabled: true,  toggleable: false },

  // --- Optional/toggleable fields ---
  { key: 'sucursal_origen',     label: 'Sucursal origen',  type: 'number',  enabled: false, toggleable: true, placeholder: 'ID sucursal origen...' },
  { key: 'sucursal_destino',    label: 'Sucursal destino', type: 'number',  enabled: false, toggleable: true, placeholder: 'ID sucursal destino...' },
  { key: 'fecha_inicio',        label: 'Desde',            type: 'date',    enabled: false, toggleable: true, placeholder: 'YYYY-MM-DD' },
  { key: 'fecha_fin',           label: 'Hasta',            type: 'date',    enabled: false, toggleable: true, placeholder: 'YYYY-MM-DD' },
  { key: 'codigo_oem_producto', label: 'Código OEM',       type: 'text',    enabled: false, toggleable: true, placeholder: 'Código OEM del producto...' },
];

// ---------------------------------------------------------------------------
// TransferSucursal — branch shape as returned in origen/destino fields
// ---------------------------------------------------------------------------
export interface TransferSucursal {
  id: number;
  nombre: string;
  sigla: string;
  nombre_comercial: string;
  activo: string;
}

// ---------------------------------------------------------------------------
// TransferResponsable — responsible user shape (nullable in Transfer)
// ---------------------------------------------------------------------------
export interface TransferResponsable {
  id: number;
  nombre: string;
  apellido_paterno: string | null;
  apellido_materno: string | null;
  celular: string | null;
}

// ---------------------------------------------------------------------------
// TransferEstado — perspective-relative computed string from backend.
// NOT an enum: the backend generates compound strings like
// "TRANSFERIDO => RECEPCIONADO" depending on the viewer's branch.
// ---------------------------------------------------------------------------
export type TransferEstado = string;

// ---------------------------------------------------------------------------
// Transfer — mirrors backend ProductTransfer list item shape
// ---------------------------------------------------------------------------
export interface Transfer {
  id: number;
  nro_transferencia: string;
  fecha: string;
  comprobante: string | null;
  responsable: TransferResponsable | null;
  total: number;
  comentarios: string | null;
  estado: TransferEstado;
  fecha_recepcion: string | null;
  origen: TransferSucursal | null;
  destino: TransferSucursal | null;
}

// ---------------------------------------------------------------------------
// TransferListMeta — pagination meta from paginated API response
// ---------------------------------------------------------------------------
export interface TransferListMeta {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

// ---------------------------------------------------------------------------
// TransferListResponse — paginated API response shape
// ---------------------------------------------------------------------------
export interface TransferListResponse {
  data: Transfer[];
  meta: TransferListMeta;
}

// ---------------------------------------------------------------------------
// TransferDetailProduct — nested product shape in transfer detail items
// ---------------------------------------------------------------------------
export interface TransferDetailProduct {
  id: number;
  descripcion: string;
  codigo_oem: string | null;
  marca: { marca: string } | null;
  nro_motor: string | null;
  medida: string | null;
  procedencia: { procedencia: string } | null;
  marca_vehiculo: { marca_vehiculo: string } | null;
}

// ---------------------------------------------------------------------------
// TransferDetailItem — single item row in a transfer
// API returns cantidad as string per desktop schema
// ---------------------------------------------------------------------------
export interface TransferDetailItem {
  id: number;
  producto: TransferDetailProduct;
  cantidad: string;
  costo_entrada: number | null;
  precio_salida: number | null;
  precio_entrada_venta: number | null;
  monenda: string | null;
}

// ---------------------------------------------------------------------------
// TransferDetail — full transfer returned by GET /transfers/:id
// Note: different field names from list (Transfer). NOT extending Transfer.
// origen/destino come as plain strings (not objects) in the detail endpoint.
// ---------------------------------------------------------------------------
export interface TransferDetail {
  id: number;
  fecha: string;
  nro: string;
  nro_completo: string;
  nro_comprobante: string | null;
  estado: string;
  responsable: TransferResponsable | null;
  comentarios: string | null;
  sucursal_origen_nombre: string | null;
  sucursal_destino_nombre: string | null;
  fecha_recepcion: string | null;
  detalles: TransferDetailItem[];
}
