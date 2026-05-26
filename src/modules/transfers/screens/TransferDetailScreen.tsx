import React from 'react';
import { ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Box } from '@/themes';
import { DeclarativeDetail, DetailHeader, ItemsTable } from '@/shared/components';
import type { ItemRow } from '@/shared/components';
import type { TransfersStackParamList } from '@/navigation/types';
import type { TransferDetailItem } from '../types/transfer.types';

import { useTransfer } from '../hooks/useTransfers';

type Props = NativeStackScreenProps<TransfersStackParamList, 'TransferDetail'>;

function toItemRow(item: TransferDetailItem, index: number): ItemRow {
  const cantidad = parseFloat(item.cantidad) || 0;
  const costo = item.costo_entrada ?? 0;
  return {
    id: item.id,
    nro: index + 1,
    descripcion: item.producto.descripcion,
    codigo: item.producto.codigo_oem,
    marca: item.producto.marca?.marca ?? null,
    cantidad,
    precio: costo,
    moneda: item.monenda ?? null,
    subtotal: cantidad * costo,
    nroMotor: item.producto.nro_motor,
    medida: item.producto.medida,
    procedencia: item.producto.procedencia?.procedencia ?? null,
    marcaVehiculo: item.producto.marca_vehiculo?.marca_vehiculo ?? null,
  };
}

export function TransferDetailScreen({ route }: Props): React.JSX.Element {
  const { id, nro } = route.params;
  const { data: transfer, isLoading, isError, error } = useTransfer(id);

  const sections = transfer
    ? [
        {
          title: 'Transferencia',
          fields: [
            { label: 'Nro. Transferencia', value: transfer.nro_completo },
            { label: 'Fecha', value: transfer.fecha, type: 'date' as const },
            { label: 'Comprobante', value: transfer.nro_comprobante },
            {
              label: 'Estado',
              value: transfer.estado,
              type: 'badge' as const,
              badgeVariant: 'info' as const,
            },
            { label: 'Fecha Recepción', value: transfer.fecha_recepcion, type: 'date' as const },
            { label: 'Comentarios', value: transfer.comentarios },
          ],
        },
        {
          title: 'Origen → Destino',
          fields: [
            { label: 'Origen', value: transfer.sucursal_origen_nombre },
            { label: 'Destino', value: transfer.sucursal_destino_nombre },
          ],
        },
        ...(transfer.responsable
          ? [
              {
                title: 'Responsable',
                fields: [
                  {
                    label: 'Nombre',
                    value: [
                      transfer.responsable.nombre,
                      transfer.responsable.apellido_paterno,
                      transfer.responsable.apellido_materno,
                    ]
                      .filter(Boolean)
                      .join(' '),
                  },
                  { label: 'Celular', value: transfer.responsable.celular },
                ],
              },
            ]
          : []),
      ]
    : [];

  const itemRows = (transfer?.detalles ?? []).map(toItemRow);

  return (
    <Box flex={1} backgroundColor="background">
      <DetailHeader title="Transferencia" subtitle={nro} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <DeclarativeDetail
          scrollable={false}
          sections={sections}
          isLoading={isLoading}
          error={isError ? (error as Error) : null}
        />
        {!isLoading && !isError && transfer && (
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
