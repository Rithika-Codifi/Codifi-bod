import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { toast } from '@/shared/ui';

const UPDATE_CHECK_MS = 60 * 60 * 1000;

/** Registers the service worker and shows "new version" / "offline ready" toasts. */
export function PwaUpdater() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (registration) setInterval(() => void registration.update(), UPDATE_CHECK_MS);
    },
  });

  useEffect(() => {
    if (!needRefresh) return;
    toast.show('New version available', {
      durationMs: 0,
      action: { label: 'Reload', onClick: () => void updateServiceWorker(true) },
    });
    setNeedRefresh(false);
  }, [needRefresh, setNeedRefresh, updateServiceWorker]);

  useEffect(() => {
    if (!offlineReady) return;
    toast.show('Ready to work offline', { tone: 'success' });
    setOfflineReady(false);
  }, [offlineReady, setOfflineReady]);

  return null;
}
