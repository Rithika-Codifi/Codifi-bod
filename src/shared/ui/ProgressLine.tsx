import { STATUS_STYLE } from '@/core/config/status';
import type { Status } from '@/core/domain';
import { cn } from '@/core/utils';

/** Thin 3px bar filled by ratio (customer rows). */
export function ProgressLine({
  status,
  ratio,
  className,
}: {
  status: Status;
  ratio: number;
  className?: string;
}) {
  const pct = `${Math.round(Math.min(1, Math.max(0, ratio)) * 100)}%`;
  return (
    <div className={cn('h-[3px] bg-surface-muted', className)} aria-hidden="true">
      <div className={cn('h-[3px]', STATUS_STYLE[status].solid)} style={{ width: pct }} />
    </div>
  );
}

/** 6px segmented line (module rows). Zero segments keep their 2px gap, as in the design. */
export function SegmentedLine({
  pass,
  warn,
  fail,
  className,
}: {
  pass: number;
  warn: number;
  fail: number;
  className?: string;
}) {
  return (
    <div className={cn('flex h-[6px] gap-[2px]', className)} aria-hidden="true">
      <div className="bg-pass" style={{ flex: `${pass} 1 0` }} />
      <div className="bg-warn" style={{ flex: `${warn} 1 0` }} />
      <div className="bg-fail" style={{ flex: `${fail} 1 0` }} />
    </div>
  );
}
