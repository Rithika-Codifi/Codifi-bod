import { STATUS_STYLE } from '@/core/config/status';
import type { Status } from '@/core/domain';
import { cn } from '@/core/utils';

export interface FilterTab<K extends string> {
  key: K;
  label: string;
  count: number;
  /** Status tone for the active fill; omit for the dark "All" tab. */
  status?: Status;
}

export interface FilterTabsProps<K extends string> {
  tabs: FilterTab<K>[];
  value: K;
  onChange: (key: K) => void;
  label: string;
  className?: string;
}

/** Equal bordered cells with a big count + small label. */
export function FilterTabs<K extends string>({
  tabs,
  value,
  onChange,
  label,
  className,
}: FilterTabsProps<K>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('grid gap-px border border-border bg-border', className)}
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map((t) => {
        const active = t.key === value;
        return (
          <button
            key={t.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(t.key)}
            className={cn(
              'flex h-[48px] flex-col items-center justify-center gap-[2px] border-0',
              active
                ? cn(t.status ? STATUS_STYLE[t.status].tab : 'bg-dark', 'text-on-dark')
                : 'bg-surface text-text',
            )}
          >
            <span className="font-mono text-[15px] font-bold">{t.count}</span>
            <span className="font-mono text-[10px] tracking-[0.12em] uppercase">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
