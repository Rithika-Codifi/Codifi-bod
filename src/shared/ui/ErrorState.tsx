import { cn } from '@/core/utils';

import { Button } from './Button';
import { RefreshIcon } from './icons';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retrying?: boolean;
  className?: string;
}

export function ErrorState({
  title = 'Could not load',
  message,
  onRetry,
  retrying,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-start gap-[12px] border border-border bg-surface p-[20px]',
        className,
      )}
    >
      <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-fail-ink uppercase">
        {title}
      </span>
      <p className="m-0 text-[13px] leading-[1.4] text-muted">{message}</p>
      {onRetry && (
        <Button
          variant="primary"
          icon={<RefreshIcon size={16} strokeWidth={2} />}
          loading={retrying}
          onClick={onRetry}
          className="px-[18px]"
        >
          Retry
        </Button>
      )}
    </div>
  );
}
