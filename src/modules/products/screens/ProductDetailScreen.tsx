import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DeclarativeDetail } from '@/shared/components';
import type { ProductsStackParamList } from '@/navigation/types';

import { useProduct } from '../hooks/useProducts';

type Props = NativeStackScreenProps<ProductsStackParamList, 'ProductDetail'>;

export function ProductDetailScreen({ route }: Props): React.JSX.Element {
  const { id } = route.params;
  const { data: product, isLoading, isError, error } = useProduct(id);

  const hasCodigosSection =
    product !== undefined &&
    (product.codigo_oem !== null ||
      product.codigo_upc !== null ||
      product.modelo !== null ||
      product.medida !== null);

  const sections = product
    ? [
        {
          title: 'General',
          fields: [
            { label: 'Descripción', value: product.descripcion },
            { label: 'Código Interno', value: String(product.codigo_interno) },
            { label: 'Categoría', value: product.categoria },
            { label: 'Subcategoría', value: product.subcategoria },
            { label: 'Marca', value: product.marca },
            { label: 'Procedencia', value: product.procedencia },
            { label: 'Unidad Medida', value: product.unidad_medida },
            { label: 'Sucursal', value: product.sucursal },
          ],
        },
        ...(hasCodigosSection
          ? [
              {
                title: 'Códigos',
                fields: [
                  ...(product.codigo_oem !== null
                    ? [{ label: 'OEM', value: product.codigo_oem }]
                    : []),
                  ...(product.codigo_upc !== null
                    ? [{ label: 'UPC', value: product.codigo_upc }]
                    : []),
                  ...(product.modelo !== null
                    ? [{ label: 'Modelo', value: product.modelo }]
                    : []),
                  ...(product.medida !== null
                    ? [{ label: 'Medida', value: product.medida }]
                    : []),
                ],
              },
            ]
          : []),
        {
          title: 'Precios',
          fields: [
            { label: 'Precio Venta', value: product.precio_venta, type: 'currency' as const },
            { label: 'Precio Alt.', value: product.precio_venta_alt, type: 'currency' as const },
          ],
        },
        {
          title: 'Stock',
          fields: [
            { label: 'Stock Actual', value: String(Math.floor(product.stock_actual)) },
            { label: 'Stock Resto', value: String(Math.floor(product.stock_resto)) },
            {
              label: 'Stock Mínimo',
              value:
                product.stock_minimo !== null ? String(Math.floor(product.stock_minimo)) : '—',
            },
            { label: 'Pedido Tránsito', value: String(product.pedido_transito) },
          ],
        },
      ]
    : [];

  return (
    <DeclarativeDetail
      sections={sections}
      isLoading={isLoading}
      error={isError ? (error as Error) : null}
    />
  );
}
