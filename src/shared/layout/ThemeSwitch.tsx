import { cn } from '@/core/utils';

export type ThemeChoice = 'light' | 'dark' | 'system';

const OPTIONS: { key: ThemeChoice; label: string }[] = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
  { key: 'system', label: 'Auto' },
];

/** Segmented light / dark / auto switch (desktop side nav). */
export function ThemeSwitch({ value, onChange }: { value: ThemeChoice; onChange: (v: ThemeChoice) => void }) {
  return (
    <div role="group" aria-label="Theme" className="grid grid-cols-3 gap-px border border-border bg-border">
      {OPTIONS.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={value === o.key}
          onClick={() => onChange(o.key)}
          className={cn(
            'h-[36px] border-0 font-mono text-[10px] tracking-[0.12em] uppercase',
            value === o.key ? 'bg-dark text-on-dark' : 'bg-surface text-text',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
