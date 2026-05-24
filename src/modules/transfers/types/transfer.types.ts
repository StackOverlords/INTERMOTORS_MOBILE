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
  origen: TransferSucursal;
  destino: TransferSucursal;
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
