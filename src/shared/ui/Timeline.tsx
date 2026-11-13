import { cn } from '@/core/utils';

export interface TimelineProps {
  startLabel: string;
  nowLabel: string;
  cutoffLabel: string;
  /** 0–1 positions along the bar. */
  nowRatio: number;
  cutoffRatio: number;
  className?: string;
}

const pct = (r: number) => `${Math.round(Math.min(1, Math.max(0, r)) * 100)}%`;

/** BOD window bar: accent fill to now, dark marker at now, red tick at cutoff, labels below. */
export function Timeline({
  startLabel,
  nowLabel,
  cutoffLabel,
  nowRatio,
  cutoffRatio,
  className,
}: TimelineProps) {
  return (
    <div className={cn('flex flex-col gap-[14px]', className)}>
      <div
        role="img"
        aria-label={`BOD window: ${startLabel}, ${nowLabel}, ${cutoffLabel}`}
        className="relative h-[10px] bg-track"
      >
        <div className="absolute top-0 bottom-0 left-0 bg-accent" style={{ width: pct(nowRatio) }} />
        <div className="absolute top-[-5px] h-[20px] w-[2px] bg-dark" style={{ left: pct(nowRatio) }} />
        <div className="absolute top-[-3px] h-[16px] w-[2px] bg-fail" style={{ left: pct(cutoffRatio) }} />
      </div>
      <div className="flex justify-between font-mono text-[11px] text-muted">
        <span>{startLabel}</span>
        <span className="font-bold text-text">{nowLabel}</span>
        <span className="text-fail-ink">{cutoffLabel}</span>
      </div>
    </div>
  );
}
