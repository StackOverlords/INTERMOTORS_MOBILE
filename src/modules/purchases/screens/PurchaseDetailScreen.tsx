import React from 'react';
import { ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Box } from '@/themes';
import { DeclarativeDetail, DetailHeader, ItemsTable } from '@/shared/components';
import type { ItemRow } from '@/shared/components';
import type { PurchasesStackParamList } from '@/navigation/types';
import type { PurchaseDetailItem } from '../types/purchase.types';

import { usePurchase } from '../hooks/usePurchases';

type Props = NativeStackScreenProps<PurchasesStackParamList, 'PurchaseDetail'>;

function toItemRow(item: PurchaseDetailItem, index: number): ItemRow {
  const cantidad = parseFloat(item.cantidad) || 0;
  const costo = parseFloat(item.costo) || 0;
  return {
    id: item.id,
    nro: index + 1,
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

export function PurchaseDetailScreen({ route }: Props): React.JSX.Element {
  const { id, nro } = route.params;
  const { data: purchase, isLoading, isError, error } = usePurchase(id);

  const sections = purchase
    ? [
        {
          title: 'Compra',
          fields: [
            { label: 'Nro. Compra', value: purchase.nro },
            { label: 'Fecha', value: purchase.fecha, type: 'date' as const },
            { label: 'Tipo', value: purchase.tipo_compra },
            { label: 'Comprobante', value: purchase.comprobante },
            { label: 'Comentarios', value: purchase.comentarios },
          ],
        },
        {
          title: 'Proveedor',
          fields: [
            { label: 'Proveedor', value: purchase.proveedor.proveedor },
          ],
        },
        ...(purchase.responsable
          ? [
              {
                title: 'Responsable',
                fields: [
                  {
                    label: 'Nombre',
                    value: [
                      purchase.responsable.nombre,
                      purchase.responsable.apellido_paterno,
                      purchase.responsable.apellido_materno,
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

  const itemRows = (purchase?.detalles ?? []).map(toItemRow);

  return (
    <Box flex={1} backgroundColor="background">
      <DetailHeader title="Compra" subtitle={nro} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <DeclarativeDetail
          scrollable={false}
          sections={sections}
          isLoading={isLoading}
          error={isError ? (error as Error) : null}
        />
        {!isLoading && !isError && purchase && (
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
