import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';

import { Box, Text } from '@/themes';
import type { Theme } from '@/themes';
import { Button } from '@/shared/components/Button';
import { useAppUpdater } from '../hooks/useAppUpdater';

export function UpdateModal() {
  const { colors } = useTheme<Theme>();
  const { status, release, progress, downloadAndInstall, dismiss } = useAppUpdater();

  if (status !== 'available' && status !== 'downloading' && status !== 'ready_to_install') {
    return null;
  }

  const isDownloading = status === 'downloading';
  const progressPercent = Math.round(progress * 100);

  return (
    <Modal transparent animationType="fade" visible statusBarTranslucent>
      <View style={[styles.overlay, { backgroundColor: colors.text + '99' }]}>
        <Box
          backgroundColor="cardBackground"
          borderRadius="l"
          padding="l"
          marginHorizontal="l"
        >
          <Text variant="subheader" marginBottom="s">
            Nueva versión disponible
          </Text>

          <Box
            flexDirection="row"
            alignItems="center"
            backgroundColor="infoBackground"
            borderRadius="m"
            padding="s"
            marginBottom="m"
          >
            <Text color="info" style={styles.versionBadge}>
              v{release?.version}
            </Text>
          </Box>

          {!!release?.releaseNotes && (
            <Text variant="body" color="textSecondary" marginBottom="m">
              {release.releaseNotes}
            </Text>
          )}

          {isDownloading && (
            <Box marginBottom="m">
              <Box
                height={6}
                backgroundColor="border"
                borderRadius="full"
                overflow="hidden"
              >
                <Box
                  height={6}
                  backgroundColor="primary"
                  borderRadius="full"
                  style={{ width: `${progressPercent}%` }}
                />
              </Box>
              <Text variant="caption" textAlign="right" marginTop="xs">
                {progressPercent}%
              </Text>
            </Box>
          )}

          <Box flexDirection="row" justifyContent="flex-end" gap="s">
            {!isDownloading && (
              <Button
                label="Más tarde"
                variant="ghost"
                onPress={dismiss}
              />
            )}
            <Button
              label={isDownloading ? 'Descargando...' : 'Actualizar'}
              variant="primary"
              loading={isDownloading}
              onPress={downloadAndInstall}
            />
          </Box>
        </Box>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
  },
  versionBadge: {
    fontSize: 13,
    fontWeight: '600',
  },
});
