import React, { useEffect, useRef } from 'react';
import { Linking, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useTheme } from '@shopify/restyle';
import { AlertCircle, Download, RefreshCw } from 'lucide-react-native';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';
import { Button } from '@/shared/components/Button';
import { useAppUpdater } from '../hooks/useAppUpdater';
import { useUpdaterStore } from '../stores/updaterStore';

function Backdrop(props: BottomSheetBackdropProps) {
  return <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />;
}

export function UpdateModal() {
  const { colors } = useTheme<Theme>();
  const ref = useRef<BottomSheetModal>(null);

  useAppUpdater();

  const status = useUpdaterStore((s) => s.status);
  const release = useUpdaterStore((s) => s.release);
  const progress = useUpdaterStore((s) => s.progress);
  const shouldPresent = useUpdaterStore((s) => s.shouldPresent);
  const errorMessage = useUpdaterStore((s) => s.errorMessage);
  const downloadAndInstall = useUpdaterStore((s) => s.downloadAndInstall);
  const dismiss = useUpdaterStore((s) => s.dismiss);
  const resetToAvailable = useUpdaterStore((s) => s.resetToAvailable);

  useEffect(() => {
    if (shouldPresent) {
      ref.current?.present();
    } else {
      ref.current?.dismiss();
    }
  }, [shouldPresent]);

  const isDownloading = status === 'downloading';
  const isError = status === 'error';
  const progressPercent = Math.round(progress * 100);

  return (
    <BottomSheetModal
      ref={ref}
      enablePanDownToClose={!isDownloading}
      onDismiss={dismiss}
      backdropComponent={Backdrop}
      backgroundStyle={{ backgroundColor: colors.cardBackground }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
      statusBarTranslucent={false}
    >
      <BottomSheetView style={styles.container}>
        <Box
          width={48}
          height={48}
          borderRadius="l"
          backgroundColor="infoBackground"
          alignItems="center"
          justifyContent="center"
          marginBottom="m"
        >
          <RefreshCw size={24} color={colors.info} />
        </Box>

        <Text variant="subheader" marginBottom="xs">
          Nueva versión disponible
        </Text>

        <Box flexDirection="row" alignItems="center" gap="s" marginBottom="m">
          <Text variant="caption" color="textSecondary">
            Versión actual
          </Text>
          <Box backgroundColor="border" width={1} height={10} />
          <Text variant="caption" color="info" style={styles.versionText}>
            v{release?.version} disponible
          </Text>
        </Box>

        {!!release?.releaseNotes && (
          <Box
            backgroundColor="surface"
            borderRadius="m"
            padding="m"
            marginBottom="m"
          >
            <Text variant="caption" color="textSecondary">
              {release.releaseNotes}
            </Text>
          </Box>
        )}

        {isDownloading && (
          <Box marginBottom="m">
            <Box
              height={6}
              backgroundColor="border"
              borderRadius="full"
              overflow="hidden"
              marginBottom="xs"
            >
              <Box
                height={6}
                backgroundColor="primary"
                borderRadius="full"
                style={{ width: `${progressPercent}%` }}
              />
            </Box>
            <Text variant="caption" color="textSecondary" textAlign="right">
              Descargando... {progressPercent}%
            </Text>
          </Box>
        )}

        {isError && (
          <Box
            backgroundColor="dangerBackground"
            borderRadius="m"
            padding="m"
            marginBottom="m"
            flexDirection="row"
            alignItems="flex-start"
            gap="s"
          >
            <AlertCircle size={16} color={colors.danger} style={{ marginTop: 1 }} />
            <Box flex={1}>
              <Text variant="caption" color="danger" style={{ fontWeight: '600', marginBottom: 2 }}>
                No se pudo instalar
              </Text>
              <Text variant="caption" color="danger">
                {errorMessage ?? 'Verificá que la app tenga permiso para instalar apps desconocidas en Ajustes del dispositivo.'}
              </Text>
            </Box>
          </Box>
        )}

        <Box flexDirection="row" gap="s" marginBottom="s">
          {!isDownloading && (
            <Box flex={1}>
              <Button
                label="Más tarde"
                variant="secondary"
                fullWidth
                onPress={() => ref.current?.dismiss()}
              />
            </Box>
          )}
          <Box flex={1}>
            <Button
              label={isDownloading ? `${progressPercent}%` : isError ? 'Reintentar' : 'Actualizar'}
              variant="primary"
              fullWidth
              loading={isDownloading}
              leftIcon={!isDownloading ? <Download size={16} color={colors.textInverse} /> : undefined}
              onPress={() => {
                if (isError) resetToAvailable();
                void downloadAndInstall();
              }}
            />
          </Box>
        </Box>

        {isError && release?.apkUrl && (
          <Button
            label="Descargar manualmente"
            variant="secondary"
            fullWidth
            onPress={() => void Linking.openURL(release.apkUrl)}
          />
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 32,
  },
  versionText: {
    fontWeight: '600',
  },
});
