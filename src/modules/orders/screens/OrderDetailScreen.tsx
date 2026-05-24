import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DeclarativeDetail } from '@/shared/components';
import type { OrdersStackParamList } from '@/navigation/types';

import { useOrder } from '../hooks/useOrders';
import type { OrderEstado } from '../types/order.types';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrderDetail'>;

function estadoVariant(estado: OrderEstado): 'warning' | 'info' | 'success' | 'danger' | 'default' {
  if (estado === 'Pendiente') return 'warning';
  if (estado === 'En Tránsito') return 'info';
  if (estado === 'Recibido') return 'success';
  if (estado === 'Cancelado') return 'danger';
  return 'default';
}

export function OrderDetailScreen({ route }: Props): React.JSX.Element {
  const { id } = route.params;
  const { data: order, isLoading, isError, error } = useOrder(id);

  const sections = order
    ? [
        {
          title: 'Pedido',
          fields: [
            { label: 'Nro. Pedido', value: order.nro_pedido },
            { label: 'Fecha', value: order.fecha, type: 'date' as const },
            { label: 'Comprobante', value: order.comprobante },
            { label: 'Contexto', value: order.contexto },
            {
              label: 'Estado',
              value: order.situacion_actual,
              type: 'badge' as const,
              badgeVariant: estadoVariant(order.situacion_actual),
            },
            { label: 'Ítems', value: String(order.numero_items) },
            { label: 'Total', value: order.total, type: 'currency' as const },
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

  return (
    <DeclarativeDetail
      sections={sections}
      isLoading={isLoading}
      error={isError ? (error as Error) : null}
    />
  );
}
