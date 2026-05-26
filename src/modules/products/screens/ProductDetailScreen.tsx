import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Box } from '@/themes';
import { DeclarativeDetail, DetailHeader } from '@/shared/components';
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
      product.medida !== null ||
      product.nro_motor !== null);

  const sections = product
    ? [
        {
          title: 'General',
          fields: [
            { label: 'Descripción', value: product.descripcion },
            { label: 'Código Interno', value: String(product.codigo_interno) },
            { label: 'División', value: product.categoria?.categoria ?? null },
            { label: 'Marca', value: product.marca?.marca ?? null },
            { label: 'Procedencia', value: product.procedencia?.procedencia ?? null },
            { label: 'Unidad Medida', value: product.unidad_medida?.unidad_medida ?? null },
            { label: 'Marca Vehículo', value: product.marca_vehiculo?.marca_vehiculo ?? null },
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
                  ...(product.nro_motor !== null
                    ? [{ label: 'Nro. Motor', value: product.nro_motor }]
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
            { label: 'Precio Venta', value: parseFloat(product.precio_venta), type: 'currency' as const },
            { label: 'Precio Alt.', value: parseFloat(product.precio_venta_alt), type: 'currency' as const },
            ...(product.costo_referencia !== null
              ? [{ label: 'Costo Ref.', value: parseFloat(product.costo_referencia), type: 'currency' as const }]
              : []),
          ],
        },
        {
          title: 'Stock',
          fields: [
            { label: 'Stock Actual', value: String(Math.floor(parseFloat(product.stock_actual))) },
            {
              label: 'Stock Mínimo',
              value: product.stock_minimo !== null
                ? String(Math.floor(parseFloat(product.stock_minimo)))
                : null,
            },
          ],
        },
      ]
    : [];

  return (
    <Box flex={1} backgroundColor="background">
      <DetailHeader title="Producto" />
      <DeclarativeDetail
        sections={sections}
        isLoading={isLoading}
        error={isError ? (error as Error) : null}
      />
    </Box>
  );
}
