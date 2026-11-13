import { cn } from '@/core/utils';

export interface StatStripItem {
  label: string;
  value: string | number;
  suffix?: string;
}

/** Three equal cells: small mono label + 20px value (customer header). */
export function StatStrip({ items, className }: { items: StatStripItem[]; className?: string }) {
  return (
    <div
      className={cn('grid gap-px border border-border bg-border', className)}
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((it) => (
        <div key={it.label} className="flex flex-col gap-[4px] bg-surface p-[12px]">
          <span className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">{it.label}</span>
          <span className="font-mono text-[20px] font-bold">
            {it.value}
            {it.suffix && <span className="text-[13px] text-subtle">{it.suffix}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}
