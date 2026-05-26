import React from 'react';
import { ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Box } from '@/themes';
import { DeclarativeDetail, DetailHeader, ItemsTable } from '@/shared/components';
import type { ItemRow } from '@/shared/components';
import type { QuotationsStackParamList } from '@/navigation/types';
import type { QuotationDetailItem } from '../types/quotation.types';

import { useQuotation } from '../hooks/useQuotations';

type Props = NativeStackScreenProps<QuotationsStackParamList, 'QuotationDetail'>;

function toItemRow(item: QuotationDetailItem, index: number): ItemRow {
  const nro = item.orden ?? index + 1;
  const cantidad = Number(item.cantidad) || 0;
  const precio = Number(item.precio) || 0;
  const descuentoPct = item.porcentaje_descuento !== null ? Number(item.porcentaje_descuento) : null;
  const subtotal = precio * cantidad * (1 - (descuentoPct ?? 0) / 100);
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
    nroMotor: item.producto.nro_motor,
    medida: item.producto.medida,
    procedencia: item.producto.procedencia?.procedencia ?? null,
    marcaVehiculo: item.producto.marca_vehiculo?.marca_vehiculo ?? null,
  };
}

export function QuotationDetailScreen({ route }: Props): React.JSX.Element {
  const { id, nro } = route.params;
  const { data: quotation, isLoading, isError, error } = useQuotation(id);

  const sections = quotation
    ? [
        {
          title: 'Cotización',
          fields: [
            { label: 'Nro. Cotización', value: quotation.nro },
            { label: 'Fecha', value: quotation.fecha, type: 'date' as const },
            { label: 'Tipo', value: quotation.tipo_cotizacion },
            { label: 'Comprobante', value: quotation.comprobante },
            { label: 'Anticipo', value: quotation.anticipo, type: 'currency' as const },
            {
              label: 'Pedido',
              value: quotation.es_pedido ? 'Sí' : 'No',
              type: 'badge' as const,
              badgeVariant: quotation.es_pedido ? ('success' as const) : ('default' as const),
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
        ...(quotation.responsable_cotizacion
          ? [
              {
                title: 'Responsable',
                fields: [{ label: 'Nombre', value: quotation.responsable_cotizacion.nombre }],
              },
            ]
          : []),
      ]
    : [];

  const itemRows = (quotation?.detalles ?? [])
    .slice()
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
    .map(toItemRow);

  return (
    <Box flex={1} backgroundColor="background">
      <DetailHeader title="Cotización" subtitle={nro} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <DeclarativeDetail
          scrollable={false}
          sections={sections}
          isLoading={isLoading}
          error={isError ? (error as Error) : null}
        />
        {!isLoading && !isError && quotation && (
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
