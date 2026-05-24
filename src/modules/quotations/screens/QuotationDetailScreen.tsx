import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DeclarativeDetail } from '@/shared/components';
import type { QuotationsStackParamList } from '@/navigation/types';

import { useQuotation } from '../hooks/useQuotations';

type Props = NativeStackScreenProps<QuotationsStackParamList, 'QuotationDetail'>;

export function QuotationDetailScreen({ route }: Props): React.JSX.Element {
  const { id } = route.params;
  const { data: quotation, isLoading, isError, error } = useQuotation(id);

  const sections = quotation
    ? [
        {
          title: 'Cotización',
          fields: [
            { label: 'Nro. Cotización', value: quotation.nro_cotizacion },
            { label: 'Fecha', value: quotation.fecha, type: 'date' as const },
            { label: 'Comprobantes', value: quotation.comprobantes },
            { label: 'Contexto', value: quotation.contexto },
            { label: 'Total', value: quotation.total, type: 'currency' as const },
            { label: 'Anticipo', value: quotation.anticipo, type: 'currency' as const },
            {
              label: 'Pedido',
              value: quotation.pedido ? 'Sí' : 'No',
              type: 'badge' as const,
              badgeVariant: quotation.pedido ? ('success' as const) : ('default' as const),
            },
            { label: 'Vehículo', value: quotation.vehiculo },
            { label: 'N° Motor', value: quotation.nmotor },
            { label: 'Comentarios', value: quotation.comentarios },
          ],
        },
        ...(quotation.cliente
          ? [
              {
                title: 'Cliente',
                fields: [
                  { label: 'Cliente', value: quotation.cliente.cliente },
                  { label: 'Nro. Cliente', value: String(quotation.cliente.nro_cliente) },
                  {
                    label: 'NIT',
                    value: quotation.cliente.nit !== null ? String(quotation.cliente.nit) : null,
                  },
                  { label: 'Dirección', value: quotation.cliente.direccion },
                  { label: 'Contacto', value: quotation.cliente.contacto },
                  { label: 'Celular', value: quotation.cliente.celular },
                  { label: 'Teléfono', value: quotation.cliente.telefono },
                ],
              },
            ]
          : []),
        ...(quotation.responsable
          ? [
              {
                title: 'Responsable',
                fields: [{ label: 'Nombre', value: quotation.responsable.nombre }],
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
