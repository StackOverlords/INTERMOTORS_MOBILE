import React from 'react';
import { ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Box } from '@/themes';
import { DeclarativeDetail, DetailHeader, ItemsTable } from '@/shared/components';
import type { ItemRow } from '@/shared/components';
import type { SalesStackParamList } from '@/navigation/types';
import type { SaleDetailItem } from '../types/sale.types';

import { useSale } from '../hooks/useSales';

type Props = NativeStackScreenProps<SalesStackParamList, 'SaleDetail'>;

function toItemRow(item: SaleDetailItem, index: number): ItemRow {
  const nro = item.orden ?? index + 1;
  const cantidad = Number(item.cantidad) || 0;
  const precio = Number(item.precio) || 0;
  const descuentoPct = item.porcentaje_descuento !== null ? Number(item.porcentaje_descuento) : null;
  const cantidadReal = cantidad - item.cantidad_dev;
  const subtotal = precio * cantidadReal * (1 - (descuentoPct ?? 0) / 100);
  return {
    id: item.id,
    nro,
    descripcion: item.producto.descripcion,
    codigo: item.producto.codigo_oem,
    marca: item.producto.marca?.marca ?? null,
    cantidad,
    precio,
    moneda: item.monenda,
    subtotal,
    descuentoPct: descuentoPct || null,
    cantidadDev: item.cantidad_dev || undefined,
    nroMotor: item.producto.nro_motor,
    medida: item.producto.medida,
    procedencia: item.producto.procedencia?.procedencia ?? null,
    marcaVehiculo: item.producto.marca_vehiculo?.marca_vehiculo ?? null,
  };
}

export function SaleDetailScreen({ route }: Props): React.JSX.Element {
  const { id, nro } = route.params;
  const { data: sale, isLoading, isError, error } = useSale(id);

  const sections = sale
    ? [
        {
          title: 'Venta',
          fields: [
            { label: 'Nro. Venta', value: sale.nro },
            { label: 'Fecha', value: sale.fecha, type: 'date' as const },
            { label: 'Tipo', value: sale.tipo_venta },
            { label: 'Comprobante', value: sale.comprobante },
            { label: 'Comentarios', value: sale.comentarios },
          ],
        },
        ...(sale.cliente
          ? [
              {
                title: 'Cliente',
                fields: [
                  { label: 'Cliente', value: sale.cliente.cliente },
                  { label: 'Nro. Cliente', value: String(sale.cliente.nro_cliente) },
                  { label: 'Dirección', value: sale.cliente.direccion },
                  { label: 'Contacto', value: sale.cliente.contacto },
                  { label: 'Celular', value: sale.cliente.celular },
                ],
              },
            ]
          : []),
        ...(sale.responsable_venta
          ? [
              {
                title: 'Responsable',
                fields: [
                  {
                    label: 'Nombre',
                    value: [
                      sale.responsable_venta.nombre,
                      sale.responsable_venta.apellido_paterno,
                      sale.responsable_venta.apellido_materno,
                    ]
                      .filter(Boolean)
                      .join(' '),
                  },
                ],
              },
            ]
          : []),
      ]
    : [];

  const itemRows = (sale?.detalles ?? [])
    .slice()
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    .map(toItemRow);

  return (
    <Box flex={1} backgroundColor="background">
      <DetailHeader title="Venta" subtitle={nro} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <DeclarativeDetail
          scrollable={false}
          sections={sections}
          isLoading={isLoading}
          error={isError ? (error as Error) : null}
        />
        {!isLoading && !isError && sale && (
          <ItemsTable
            items={itemRows}
            title="Productos"
            totalAmount={itemRows.reduce((sum, r) => sum + r.subtotal, 0)}
          />
        )}
      </ScrollView>
    </Box>
  );
}
