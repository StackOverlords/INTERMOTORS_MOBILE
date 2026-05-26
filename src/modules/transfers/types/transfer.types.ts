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
