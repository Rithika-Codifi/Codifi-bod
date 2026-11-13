import { cn } from '@/core/utils';

import { RefreshIcon } from './icons';

export function Spinner({
  size = 16,
  label,
  className,
}: {
  size?: number;
  label?: string;
  className?: string;
}) {
  return (
    <span role={label ? 'status' : undefined} className={cn('inline-flex', className)}>
      <RefreshIcon size={size} strokeWidth={2} className="animate-bodspin" />
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}
