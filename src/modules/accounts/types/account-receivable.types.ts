import type { FilterFieldConfig, SelectOption } from '@/shared/types/filter.types';

// ---------------------------------------------------------------------------
// AccountReceivableCustomer — mirrors backend customer shape
// ---------------------------------------------------------------------------
export interface AccountReceivableCustomer {
  id: number;
  cliente: string;
  direccion: string;
  nit: string;
}

// ---------------------------------------------------------------------------
// AccountReceivableResponsible — nullable in some records
// ---------------------------------------------------------------------------
export interface AccountReceivableResponsible {
  id: number;
  nombre: string;
  apellido_paterno: string | null;
  apellido_materno: string | null;
}

// ---------------------------------------------------------------------------
// AccountReceivable — list item shape from GET /account-receivable
// ---------------------------------------------------------------------------
export interface AccountReceivable {
  id: number;
  nro_venta: string;
  fecha: string;
  cliente: AccountReceivableCustomer;
  responsable: AccountReceivableResponsible | null;
  total_vendido: number;
  total_pagado: number;
  saldo: number;
  plazo_pago: string;
  comentarios: string;
}

// ---------------------------------------------------------------------------
// AccountReceivableListMeta — pagination meta from backend
// ---------------------------------------------------------------------------
export interface AccountReceivableListMeta {
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

// ---------------------------------------------------------------------------
// AccountReceivableListResponse — paginated API response shape
// ---------------------------------------------------------------------------
export interface AccountReceivableListResponse {
  data: AccountReceivable[];
  meta: AccountReceivableListMeta;
}

// ---------------------------------------------------------------------------
// AccountReceivableFilters — flat map of query params
// cliente is kept as string here — coerced to number in service layer
// ---------------------------------------------------------------------------
export type AccountReceivableFilters = Partial<{
  nro_venta: string;
  cliente: string;       // numeric ID as string — coerced to number in service
  tipo_pago: string;     // EFECTIVO | CHEQUE | TRASNF | QR | QR-EFECTIVO
  estado_pago: string;   // DEUDA | PAGADO
  fecha_inicio: string;
  fecha_fin: string;
}>;

// ---------------------------------------------------------------------------
// ESTADO_PAGO_OPTIONS — select options for estado_pago filter
// ---------------------------------------------------------------------------
export const ESTADO_PAGO_OPTIONS: SelectOption[] = [
  { label: 'Deuda', value: 'DEUDA' },
  { label: 'Pagado', value: 'PAGADO' },
];

// ---------------------------------------------------------------------------
// TIPO_PAGO_OPTIONS — select options for tipo_pago filter
// ---------------------------------------------------------------------------
export const TIPO_PAGO_OPTIONS: SelectOption[] = [
  { label: 'Efectivo', value: 'EFECTIVO' },
  { label: 'Cheque', value: 'CHEQUE' },
  { label: 'Transferencia', value: 'TRASNF' },
  { label: 'QR', value: 'QR' },
  { label: 'QR + Efectivo', value: 'QR-EFECTIVO' },
];

// ---------------------------------------------------------------------------
// DEFAULT_AR_FILTERS — config-driven filter fields for the accounts receivable list.
// 3 always-visible + 3 toggleable fields.
// Same pattern as DEFAULT_PRODUCT_FILTERS in product.types.ts.
// ---------------------------------------------------------------------------
export const DEFAULT_AR_FILTERS: FilterFieldConfig[] = [
  // --- Always-visible fields ---
  { key: 'estado_pago',  label: 'Estado',        type: 'select', enabled: true,  toggleable: false },
  { key: 'nro_venta',    label: 'Nro. Venta',    type: 'text',   enabled: true,  toggleable: false, placeholder: 'Buscar por nro. venta…' },
  { key: 'cliente',      label: 'Cliente (ID)',   type: 'text',   enabled: true,  toggleable: false, placeholder: 'ID de cliente (número)' },

  // --- Optional/toggleable fields ---
  { key: 'tipo_pago',    label: 'Tipo de Pago',  type: 'select', enabled: false, toggleable: true },
  { key: 'fecha_inicio', label: 'Desde',         type: 'text',   enabled: false, toggleable: true, placeholder: 'YYYY-MM-DD' },
  { key: 'fecha_fin',    label: 'Hasta',         type: 'text',   enabled: false, toggleable: true, placeholder: 'YYYY-MM-DD' },
];
