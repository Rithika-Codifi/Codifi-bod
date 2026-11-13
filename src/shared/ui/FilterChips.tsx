import { cn } from '@/core/utils';

export interface FilterChip<K extends string> {
  key: K;
  label: string;
  count: number;
}

export interface FilterChipsProps<K extends string> {
  chips: FilterChip<K>[];
  value: K;
  onChange: (key: K) => void;
  label: string;
  className?: string;
}

/** Wrapping bordered chips like "ALL · 34"; active = solid dark. */
export function FilterChips<K extends string>({
  chips,
  value,
  onChange,
  label,
  className,
}: FilterChipsProps<K>) {
  return (
    <div role="group" aria-label={label} className={cn('flex flex-wrap gap-[8px]', className)}>
      {chips.map((c) => {
        const active = c.key === value;
        return (
          <button
            key={c.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(c.key)}
            className={cn(
              'h-[36px] border px-[12px] font-mono text-[11px] font-semibold tracking-[0.08em] uppercase',
              active ? 'border-dark bg-dark text-on-dark' : 'border-border bg-surface text-text',
            )}
          >
            {c.label} · {c.count}
          </button>
        );
      })}
    </div>
  );
}
