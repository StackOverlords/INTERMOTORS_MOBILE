import type { FilterFieldConfig, ProductFilterValues } from '@/shared/types/filter.types';

export type { ProductFilterValues };

// ---------------------------------------------------------------------------
// DEFAULT_PRODUCT_FILTERS — config-driven filter fields for the product list.
// 4 default (always visible) + 4 toggleable (hidden by default).
// ---------------------------------------------------------------------------
export const DEFAULT_PRODUCT_FILTERS: FilterFieldConfig[] = [
  // --- Always-visible fields ---
  { key: 'descripcion', label: 'Descripción', type: 'text',   placeholder: 'Buscar por descripción…', enabled: true, toggleable: false },
  { key: 'categoria',   label: 'División',    type: 'select',                                         enabled: true, toggleable: false },
  { key: 'marca',       label: 'Marca',       type: 'select',                                         enabled: true, toggleable: false },
  { key: 'codigo_oem',  label: 'Código OEM',  type: 'text',   placeholder: 'Buscar por código OEM…',  enabled: true, toggleable: false },

  // --- Optional/toggleable fields ---
  { key: 'codigo_upc', label: 'Código UPC', type: 'text', placeholder: 'Buscar por código UPC…',  enabled: false, toggleable: true },
  { key: 'medida',     label: 'Medida',     type: 'text', placeholder: 'Buscar por medida…',      enabled: false, toggleable: true },
  { key: 'nro_motor',  label: 'Nro. Motor', type: 'text', placeholder: 'Buscar por nro. motor…',  enabled: false, toggleable: true },
];

// ---------------------------------------------------------------------------
// Product — mirrors ProductGetSchema from TPS_INTERMOTORS desktop.
// Only fields used/displayed in mobile are included.
// ---------------------------------------------------------------------------
export interface Product {
  id: number;
  codigo_interno: number;
  descripcion: string;
  categoria: string;
  subcategoria: string | null;
  marca: string;
  procedencia: string;
  unidad_medida: string;
  codigo_oem: string | null;
  codigo_upc: string | null;
  modelo: string | null;
  medida: string | null;
  stock_actual: number;
  stock_resto: number;
  stock_minimo: number | null;
  pedido_transito: number;
  precio_venta: number;
  precio_venta_alt: number;
  sucursal: string;
  imagen: string | null;
}

// ---------------------------------------------------------------------------
// ProductListResponse — matches desktop productResponse.schema { data, meta }
// ---------------------------------------------------------------------------
interface ProductListMeta {
  total: number;
}

export interface ProductListResponse {
  data: Product[];
  meta: ProductListMeta;
}

// ---------------------------------------------------------------------------
// ProductDetail — shape returned by GET /products/:id (objects, string prices)
// ---------------------------------------------------------------------------
interface ProductCategoriaObj  { id: number; categoria: string }
interface ProductSubcategoriaObj { id: number; subcategoria: string }
interface ProductMarcaObj      { id: number; marca: string }
interface ProductProcedenciaObj { id: number; procedencia: string }
interface ProductUnidadMedidaObj { id: number; unidad_medida: string }
interface ProductMarcaVehiculoObj { id: number; marca_vehiculo: string }

export interface ProductDetail {
  id: number;
  codigo_interno: number;
  descripcion: string;
  descripcion_alt: string | null;
  codigo_oem: string | null;
  codigo_upc: string | null;
  modelo: string | null;
  medida: string | null;
  nro_motor: string | null;
  categoria: ProductCategoriaObj | null;
  subcategoria: ProductSubcategoriaObj | null;
  marca: ProductMarcaObj | null;
  procedencia: ProductProcedenciaObj | null;
  unidad_medida: ProductUnidadMedidaObj | null;
  marca_vehiculo: ProductMarcaVehiculoObj | null;
  costo_referencia: string | null;
  stock_minimo: string | null;
  stock_actual: string;
  precio_venta: string;
  precio_venta_alt: string;
  imagen: string | null;
  imagen_name: string | null;
  imagen_ext: string | null;
}
