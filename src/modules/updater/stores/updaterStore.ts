import { create } from 'zustand';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

import { ENV } from '@/config/environment';
import { fetchLatestRelease, isNewerVersion } from '../services/updater.service';
import type { ReleaseInfo, UpdateStatus } from '../types/updater.types';

const APK_DEST = `${RNFS.DownloadDirectoryPath}/intermotors-update.apk`;

interface UpdaterStore {
  status: UpdateStatus;
  release: ReleaseInfo | null;
  progress: number;
  shouldPresent: boolean;
  errorMessage: string | null;

  checkForUpdate: () => Promise<void>;
  downloadAndInstall: () => Promise<void>;
  dismiss: () => void;
  requestPresent: () => void;
  resetToAvailable: () => void;
}

export const useUpdaterStore = create<UpdaterStore>((set, get) => ({
  status: 'idle',
  release: null,
  progress: 0,
  shouldPresent: false,
  errorMessage: null,

  checkForUpdate: async () => {
    if (get().status !== 'idle') return;
    set({ status: 'checking' });
    try {
      const info = await fetchLatestRelease();
      if (isNewerVersion(info.version, ENV.APP_VERSION)) {
        set({ status: 'available', release: info, shouldPresent: true });
      } else {
        set({ status: 'up_to_date' });
      }
    } catch (e) {
      console.warn('[Updater] check failed:', e);
      set({ status: 'error' });
    }
  },

  downloadAndInstall: async () => {
    const { release } = get();
    if (!release) return;

    set({ status: 'downloading', progress: 0, errorMessage: null });
    try {
      const { promise } = RNFS.downloadFile({
        fromUrl: release.apkUrl,
        toFile: APK_DEST,
        progressInterval: 300,
        progress: ({ bytesWritten, contentLength }) => {
          if (contentLength > 0) set({ progress: bytesWritten / contentLength });
        },
      });

      const result = await promise;
      if (result.statusCode !== 200) {
        throw new Error(`Descarga falló (HTTP ${result.statusCode})`);
      }

      set({ status: 'ready_to_install' });
      await FileViewer.open(APK_DEST, { showOpenWithDialog: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Error desconocido';
      console.warn('[Updater] install failed:', msg);
      set({ status: 'error', errorMessage: msg });
    }
  },

  dismiss: () => set({ shouldPresent: false }),

  requestPresent: () => set({ shouldPresent: true }),

  resetToAvailable: () => set({ status: 'available', errorMessage: null, progress: 0 }),
}));
