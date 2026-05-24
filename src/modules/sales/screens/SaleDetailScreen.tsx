import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DeclarativeDetail } from '@/shared/components';
import type { SalesStackParamList } from '@/navigation/types';

import { useSale } from '../hooks/useSales';

type Props = NativeStackScreenProps<SalesStackParamList, 'SaleDetail'>;

export function SaleDetailScreen({ route }: Props): React.JSX.Element {
  const { id } = route.params;
  const { data: sale, isLoading, isError, error } = useSale(id);

  const sections = sale
    ? [
        {
          title: 'Venta',
          fields: [
            { label: 'Nro. Venta', value: sale.nro_venta },
            { label: 'Fecha', value: sale.fecha, type: 'date' as const },
            { label: 'Comprobantes', value: sale.comprobantes },
            { label: 'Contexto', value: sale.contexto },
            { label: 'Total', value: sale.total, type: 'currency' as const },
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
        ...(sale.responsable
          ? [
              {
                title: 'Responsable',
                fields: [
                  {
                    label: 'Nombre',
                    value: [
                      sale.responsable.nombre,
                      sale.responsable.apellido_paterno,
                      sale.responsable.apellido_materno,
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

  return (
    <DeclarativeDetail
      sections={sections}
      isLoading={isLoading}
      error={isError ? (error as Error) : null}
    />
  );
}
