import { useEffect } from 'react';

import { useUpdaterStore } from '../stores/updaterStore';

export function useAppUpdater() {
  const checkForUpdate = useUpdaterStore((s) => s.checkForUpdate);

  useEffect(() => {
    void checkForUpdate();
  }, [checkForUpdate]);
}
