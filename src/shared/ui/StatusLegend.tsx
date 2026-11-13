import { STATUS_STYLE } from '@/core/config/status';
import type { Status } from '@/core/domain';
import { cn } from '@/core/utils';

export interface LegendItem {
  status: Status;
  label: string;
  n: number;
  pct: string;
}

/** 3-column legend with a left color rule, label, count and percentage. */
export function StatusLegend({ items, className }: { items: LegendItem[]; className?: string }) {
  return (
    <div className={cn('grid grid-cols-3 gap-[10px]', className)}>
      {items.map((l) => (
        <div
          key={l.status}
          className={cn('flex flex-col gap-[3px] border-l-[3px] pl-[9px]', STATUS_STYLE[l.status].border)}
        >
          <span className="font-mono text-[10.5px] tracking-[0.12em] text-muted uppercase">{l.label}</span>
          <span className="font-mono text-[18px] font-bold">{l.n}</span>
          <span className="font-mono text-[11px] text-subtle">{l.pct}</span>
        </div>
      ))}
    </div>
  );
}
