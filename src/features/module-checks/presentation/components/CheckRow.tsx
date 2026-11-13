import { Link } from 'react-router-dom';

import { cn } from '@/core/utils';
import { ArrowRightIcon, IconButton, MethodChip, RefreshIcon, StatusBadge, StatusDot } from '@/shared/ui';

import type { CheckRowModel } from '../state/moduleChecksState';

const LATENCY_TONE = { muted: 'text-muted', warn: 'text-warn-ink', fail: 'text-fail-ink' } as const;

export function CheckRow({ row, onRetest }: { row: CheckRowModel; onRetest: (id: string) => void }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-[8px] border-b border-surface-muted py-[12px] pr-[8px] pl-[14px]',
        row.status === 'fail' ? 'bg-fail-row' : 'bg-surface',
      )}
    >
      <div className="flex items-center gap-[10px]">
        <StatusDot status={row.status} />
        <div className="flex min-w-0 flex-auto flex-col gap-[4px]">
          <span className="text-[14px] font-semibold">{row.name}</span>
          <span className="flex items-center gap-[6px] overflow-hidden font-mono text-[11px] whitespace-nowrap text-muted">
            <MethodChip method={row.method} />
            {row.path}
          </span>
        </div>
        <StatusBadge status={row.status} size="sm" />
        <IconButton
          label={`Retest ${row.name}`}
          onClick={() => onRetest(row.id)}
          disabled={row.running}
          aria-busy={row.running || undefined}
        >
          <RefreshIcon size={18} className={row.running ? 'animate-bodspin' : undefined} />
        </IconButton>
      </div>
      <div className="flex gap-[14px] pl-[20px] font-mono text-[11px] text-muted">
        <span>{row.time}</span>
        <span>
          HTTP <b className={row.codeIsError ? 'text-fail-ink' : 'text-text'}>{row.code}</b>
        </span>
        <span className={LATENCY_TONE[row.latencyTone]}>{row.latency}</span>
      </div>
      {row.error && (
        <div className="mr-[8px] ml-[20px] flex flex-col gap-[8px] border border-border-soft bg-surface-sunken px-[12px] py-[10px]">
          <span className="font-mono text-[11px] leading-[1.5] text-text">{row.error}</span>
          <Link
            to={row.reportHref}
            className="flex min-h-[32px] items-center gap-[6px] self-start font-mono text-[11px] font-bold tracking-[0.08em] text-accent-strong uppercase"
          >
            Open result log
            <ArrowRightIcon size={14} strokeWidth={2} />
          </Link>
        </div>
      )}
    </div>
  );
}
