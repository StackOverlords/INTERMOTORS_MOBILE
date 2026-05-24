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

  checkForUpdate: () => Promise<void>;
  downloadAndInstall: () => Promise<void>;
  dismiss: () => void;
  requestPresent: () => void;
}

export const useUpdaterStore = create<UpdaterStore>((set, get) => ({
  status: 'idle',
  release: null,
  progress: 0,
  shouldPresent: false,

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

    set({ status: 'downloading', progress: 0 });
    try {
      const { promise } = RNFS.downloadFile({
        fromUrl: release.apkUrl,
        toFile: APK_DEST,
        progressInterval: 300,
        progress: ({ bytesWritten, contentLength }) => {
          set({ progress: bytesWritten / contentLength });
        },
      });

      await promise;
      set({ status: 'ready_to_install' });
      await FileViewer.open(APK_DEST, { showOpenWithDialog: false });
    } catch (e) {
      console.warn('[Updater] download failed:', e);
      set({ status: 'error' });
    }
  },

  dismiss: () => set({ shouldPresent: false }),

  requestPresent: () => set({ shouldPresent: true }),
}));
