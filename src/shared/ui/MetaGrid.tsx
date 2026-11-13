import { cn } from '@/core/utils';

export interface MetaItem {
  label: string;
  value: string;
}

/** 2-column definition grid (report run details). */
export function MetaGrid({
  items,
  label,
  className,
}: {
  items: MetaItem[];
  label: string;
  className?: string;
}) {
  return (
    <section aria-label={label} className={cn('border border-border bg-surface', className)}>
      <dl className="m-0 grid grid-cols-2 gap-px bg-surface-muted">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col gap-[4px] bg-surface px-[14px] py-[12px]">
            <dt className="font-mono text-[10px] tracking-[0.12em] text-muted uppercase">{it.label}</dt>
            <dd className="m-0 font-mono text-[13px] font-semibold">{it.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
