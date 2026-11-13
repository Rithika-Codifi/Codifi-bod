import { STATUS_STYLE } from '@/core/config/status';
import type { Status } from '@/core/domain';
import { cn } from '@/core/utils';

const SIZE = {
  /** Page headers / overview card: 11px. */
  md: 'px-[9px] py-[5px] text-[11px] tracking-[0.1em]',
  /** List rows: 10px. */
  sm: 'px-[6px] py-[3px] text-[10px] tracking-[0.08em]',
} as const;

export interface StatusBadgeProps {
  status: Status;
  size?: keyof typeof SIZE;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, size = 'md', label, className }: StatusBadgeProps) {
  const s = STATUS_STYLE[status];
  return (
    <span
      className={cn(
        'inline-flex flex-none items-center border font-mono font-bold uppercase',
        SIZE[size],
        s.border,
        s.tint,
        s.ink,
        className,
      )}
    >
      {label ?? s.label}
    </span>
  );
}
