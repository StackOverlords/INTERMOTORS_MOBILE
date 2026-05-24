import { useCallback, useEffect, useState } from 'react';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

import { fetchLatestRelease, isNewerVersion } from '../services/updater.service';
import type { ReleaseInfo, UpdateStatus } from '../types/updater.types';

const APK_DEST = `${RNFS.DownloadDirectoryPath}/intermotors-update.apk`;

export function useAppUpdater() {
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [progress, setProgress] = useState(0);

  const checkForUpdate = useCallback(async () => {
    setStatus('checking');
    try {
      const info = await fetchLatestRelease();
      if (isNewerVersion(info.version, ENV.APP_VERSION)) {
        setRelease(info);
        setStatus('available');
      } else {
        setStatus('up_to_date');
      }
    } catch {
      setStatus('error');
    }
  }, []);

  const downloadAndInstall = useCallback(async () => {
    if (!release) return;

    setStatus('downloading');
    setProgress(0);

    try {
      const { promise } = RNFS.downloadFile({
        fromUrl: release.apkUrl,
        toFile: APK_DEST,
        progressInterval: 300,
        progress: ({ bytesWritten, contentLength }) => {
          setProgress(bytesWritten / contentLength);
        },
      });

      await promise;
      setStatus('ready_to_install');
      await FileViewer.open(APK_DEST, { showOpenWithDialog: false });
    } catch {
      setStatus('error');
    }
  }, [release]);

  const dismiss = useCallback(() => setStatus('up_to_date'), []);

  useEffect(() => {
    void checkForUpdate();
  }, [checkForUpdate]);

  return { status, release, progress, downloadAndInstall, dismiss };
}
