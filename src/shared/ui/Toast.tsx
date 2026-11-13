import { cn } from '@/core/utils';

import { useToastStore, type ToastTone } from './toastStore';

const TONE: Record<ToastTone, string> = {
  default: 'border-l-accent',
  success: 'border-l-pass',
  error: 'border-l-fail',
};

/** Toast viewport: bottom on mobile (above the nav), bottom-right on desktop. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-[16px] bottom-[calc(80px+env(safe-area-inset-bottom))] z-50 flex flex-col gap-[8px] lg:right-[24px] lg:bottom-[24px] lg:left-auto lg:w-[360px]"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto flex items-center justify-between gap-[12px] border-l-[3px] bg-dark py-[12px] pr-[8px] pl-[14px] text-on-dark',
            TONE[t.tone],
          )}
        >
          <span className="font-mono text-[11px] tracking-[0.08em] uppercase">{t.message}</span>
          {t.action ? (
            <button
              type="button"
              onClick={() => {
                t.action?.onClick();
                dismiss(t.id);
              }}
              className="min-h-[44px] border-0 bg-transparent px-[8px] font-mono text-[11px] font-bold tracking-[0.1em] text-on-dark uppercase underline"
            >
              {t.action.label}
            </button>
          ) : (
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismiss(t.id)}
              className="size-[44px] flex-none border-0 bg-transparent font-mono text-[16px] text-on-dark"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
