import React from 'react';
import { ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Box } from '@/themes';
import { DeclarativeDetail, DetailHeader, ItemsTable } from '@/shared/components';
import type { ItemRow } from '@/shared/components';
import type { OrdersStackParamList } from '@/navigation/types';
import type { OrderDetailItem, OrderEstado } from '../types/order.types';

import { useOrder } from '../hooks/useOrders';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrderDetail'>;

function estadoVariant(estado: OrderEstado): 'warning' | 'info' | 'success' | 'danger' | 'default' {
  if (estado === 'Pendiente') return 'warning';
  if (estado === 'En Tránsito') return 'info';
  if (estado === 'Recibido') return 'success';
  if (estado === 'Cancelado') return 'danger';
  return 'default';
}

function toItemRow(item: OrderDetailItem, index: number): ItemRow {
  const nro = item.orden ?? index + 1;
  const cantidad = Number(item.cantidad) || 0;
  const costo = Number(item.costo) || 0;
  return {
    id: item.id,
    nro,
    descripcion: item.producto.descripcion,
    codigo: item.producto.codigo_oem,
    marca: item.producto.marca?.marca ?? null,
    cantidad,
    precio: costo,
    moneda: item.moneda,
    subtotal: cantidad * costo,
    nroMotor: item.producto.nro_motor,
    medida: item.producto.medida,
    procedencia: item.producto.procedencia?.procedencia ?? null,
    marcaVehiculo: item.producto.marca_vehiculo?.marca_vehiculo ?? null,
  };
}

export function OrderDetailScreen({ route }: Props): React.JSX.Element {
  const { id, nro } = route.params;
  const { data: order, isLoading, isError, error } = useOrder(id);

  const sections = order
    ? [
        {
          title: 'Pedido',
          fields: [
            { label: 'Nro. Pedido', value: order.nro },
            { label: 'Fecha', value: order.fecha, type: 'date' as const },
            { label: 'Comprobante', value: order.comprobante },
            { label: 'Tipo', value: order.tipo_pedido },
            {
              label: 'Estado',
              value: order.situacion_actual,
              type: 'badge' as const,
              badgeVariant: estadoVariant(order.situacion_actual),
            },
            { label: 'Ítems', value: String(order.cantidad_detalles) },
            { label: 'Fecha Llegada', value: order.fecha_llegada, type: 'date' as const },
            { label: 'Fecha Tránsito', value: order.fecha_transito, type: 'date' as const },
            { label: 'Comentarios', value: order.comentarios },
          ],
        },
        ...(order.proveedor
          ? [
              {
                title: 'Proveedor',
                fields: [
                  { label: 'Proveedor', value: order.proveedor.proveedor },
                  { label: 'Dirección', value: order.proveedor.direccion },
                  { label: 'NIT', value: order.proveedor.nit },
                  { label: 'Contacto', value: order.proveedor.contacto },
                ],
              },
            ]
          : []),
        ...(order.responsable
          ? [
              {
                title: 'Responsable',
                fields: [
                  {
                    label: 'Nombre',
                    value: [
                      order.responsable.nombre,
                      order.responsable.apellido_paterno,
                    ]
                      .filter(Boolean)
                      .join(' '),
                  },
                  { label: 'Celular', value: order.responsable.celular },
                  {
                    label: 'DNI',
                    value: order.responsable.dni !== null ? String(order.responsable.dni) : null,
                  },
                ],
              },
            ]
          : []),
      ]
    : [];

  const itemRows = (order?.detalles ?? [])
    .slice()
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    .map(toItemRow);

  return (
    <Box flex={1} backgroundColor="background">
      <DetailHeader title="Pedido" subtitle={nro} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <DeclarativeDetail
          scrollable={false}
          sections={sections}
          isLoading={isLoading}
          error={isError ? (error as Error) : null}
        />
        {!isLoading && !isError && order && (
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
