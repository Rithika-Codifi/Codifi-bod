import { STATUS_STYLE } from '@/core/config/status';
import type { Status } from '@/core/domain';
import { cn } from '@/core/utils';

export interface Segment {
  status: Status;
  n: number;
  /** Fixed width in px (e.g. 34) instead of growing by count. */
  width?: number;
}

export interface SegmentedBarProps {
  segments: Segment[];
  /** 30px on overview, 26px on module/report. */
  height?: 26 | 30;
  /** Minimum width for count-sized segments (overview uses 28px). */
  minSegmentWidth?: number;
  label?: string;
  className?: string;
}

/** Pass/warn/fail split with white mono counts; zero segments are hidden. */
export function SegmentedBar({
  segments,
  height = 26,
  minSegmentWidth,
  label,
  className,
}: SegmentedBarProps) {
  const visible = segments.filter((s) => s.n > 0);
  return (
    <div
      role="img"
      aria-label={
        label ?? visible.map((s) => `${s.n} ${STATUS_STYLE[s.status].label.toLowerCase()}`).join(', ')
      }
      className={cn('flex gap-[2px]', height === 30 ? 'h-[30px]' : 'h-[26px]', className)}
    >
      {visible.map((s) => (
        <div
          key={s.status}
          style={
            s.width != null ? { flex: `0 0 ${s.width}px` } : { flex: `${s.n} 1 0`, minWidth: minSegmentWidth }
          }
          className={cn(
            'flex items-center justify-center font-mono text-[12px] font-bold text-on-dark',
            STATUS_STYLE[s.status].solid,
          )}
        >
          {s.n}
        </div>
      ))}
    </div>
  );
}
