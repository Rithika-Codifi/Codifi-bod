import { cn } from '@/core/utils';
import { Card, ChevronRightIcon, ListRow, SectionHeader, SegmentedLine } from '@/shared/ui';

import type { ModuleRowModel } from '../state/customerDetailState';

const COUNT_TONE = {
  fail: 'text-fail-ink',
  warn: 'text-warn-ink',
  pass: 'text-pass-ink',
  running: 'text-running-ink',
};

export function ModuleList({ rows }: { rows: readonly ModuleRowModel[] }) {
  return (
    <Card aria-label="Modules" className="flex flex-col">
      <SectionHeader
        title="Modules"
        right="Checks passed"
        rightClassName="tracking-[0.08em] text-subtle uppercase"
        className="border-b border-border pt-[16px] pr-[16px] pb-[12px] pl-[18px]"
      />
      {rows.map((m) => (
        <ListRow key={m.id} to={m.href} className="min-h-[66px] gap-[12px] py-[10px] pr-[12px] pl-[18px]">
          <div className="flex min-w-0 flex-auto flex-col gap-[6px]">
            <div className="flex items-center justify-between gap-[8px]">
              <span className="text-[14px] font-semibold">{m.name}</span>
              <span className={cn('font-mono text-[12px] font-bold', COUNT_TONE[m.status])}>{m.count}</span>
            </div>
            <SegmentedLine pass={m.passed} warn={m.warnings} fail={m.failures} />
            <span className="font-mono text-[11px] text-muted">{m.note}</span>
          </div>
          <ChevronRightIcon size={16} strokeWidth={2} className="text-subtle" />
        </ListRow>
      ))}
    </Card>
  );
}
