import { cn } from '@/core/utils';
import { Card, SectionHeader } from '@/shared/ui';

import type { ReportModel } from '../state/reportState';

const INK = {
  pass: 'text-pass-ink',
  warn: 'text-warn-ink',
  fail: 'text-fail-ink',
  running: 'text-running-ink',
};
const GRID = 'grid grid-cols-[minmax(0,1fr)_64px_58px] gap-[8px] px-[16px]';

export function ChecksTable({ checks }: { checks: ReportModel['checks'] }) {
  return (
    <Card aria-label="All checks" className="flex flex-col">
      <SectionHeader
        title="All checks"
        right={checks.showing}
        rightClassName="text-muted"
        className="border-b border-border px-[16px] pt-[14px] pb-[10px]"
      />
      <div role="table" aria-label="Checks in this run">
        <div
          role="row"
          className={cn(
            GRID,
            'bg-surface-sunken py-[8px] font-mono text-[10px] tracking-[0.12em] text-muted uppercase',
          )}
        >
          <span role="columnheader">Check</span>
          <span role="columnheader" className="text-right">
            Time
          </span>
          <span role="columnheader" className="text-right">
            Result
          </span>
        </div>
        {checks.rows.map((c) => (
          <div
            key={c.key}
            role="row"
            className={cn(
              GRID,
              'min-h-[38px] items-center border-b border-surface-muted py-[4px] font-mono text-[11.5px]',
            )}
          >
            <span role="cell" className="overflow-hidden text-ellipsis whitespace-nowrap">
              {c.name}
            </span>
            <span role="cell" className="text-right text-muted">
              {c.time}
            </span>
            <span role="cell" className={cn('text-right font-bold', INK[c.status])}>
              {c.word}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
