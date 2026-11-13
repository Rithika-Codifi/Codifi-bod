import { useOnlineStatus } from '@/shared/hooks';

/** Shown above the screen while the device is offline; data comes from the last cached responses. */
export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div
      role="status"
      className="sticky top-0 z-30 border-b border-warn bg-warn-tint px-[16px] py-[8px] font-mono text-[11px] tracking-[0.08em] text-warn-ink uppercase"
    >
      Offline · showing last synced data
    </div>
  );
}
