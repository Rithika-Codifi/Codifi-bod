import { cn } from '@/core/utils';
import { Card, IconButton, RefreshIcon, SectionHeader, StatusBadge, StatusDot } from '@/shared/ui';

import type { EtlRowModel } from '../state/customerDetailState';

export interface EtlListProps {
  rows: readonly EtlRowModel[];
  onOpen: (jobId: string) => void;
  onRetest: (jobId: string) => void;
}

/**
 * Tapping a row opens the job's checks: the job name is a button whose ::after covers the whole
 * row, so the row stays one tap target without nesting interactive elements. The retest icon
 * sits above that overlay (z-index) and never navigates.
 */
export function EtlList({ rows, onOpen, onRetest }: EtlListProps) {
  return (
    <Card aria-label="ETL processes" className="flex flex-col">
      <SectionHeader
        title="ETL process"
        right="Upload → validate → load"
        rightClassName="tracking-[0.08em] text-subtle uppercase"
        className="border-b border-border pt-[16px] pr-[16px] pb-[12px] pl-[18px]"
      />
      {rows.map((r) => (
        <div
          key={r.id}
          className="relative flex min-h-[64px] items-center gap-[12px] border-b border-surface-muted py-[10px] pr-[8px] pl-[18px] hover:bg-surface-sunken"
        >
          <StatusDot status={r.status} />
          <div className="flex min-w-0 flex-auto flex-col gap-[3px]">
            <button
              type="button"
              onClick={() => onOpen(r.id)}
              aria-label={`${r.name}, open checks`}
              className="m-0 border-0 bg-transparent p-0 text-left text-[14px] font-semibold text-text after:absolute after:inset-0 after:content-['']"
            >
              {r.name}
            </button>
            <span
              className={cn(
                'font-mono text-[11px] leading-[1.4]',
                r.metaIsError ? 'text-fail-ink' : 'text-muted',
              )}
            >
              {r.meta}
            </span>
          </div>
          <StatusBadge status={r.status} size="sm" />
          <IconButton
            label={`Retest ${r.name}`}
            onClick={() => onRetest(r.id)}
            disabled={r.running}
            aria-busy={r.running || undefined}
            className="z-[1]"
          >
            <RefreshIcon size={18} className={r.running ? 'animate-bodspin' : undefined} />
          </IconButton>
        </div>
      ))}
    </Card>
  );
}
