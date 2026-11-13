import { Link } from 'react-router-dom';

import { STATUS_STYLE } from '@/core/config/status';
import { cn } from '@/core/utils';
import { Card, SectionHeader, SegmentedBar } from '@/shared/ui';

import type { ReportModel } from '../state/reportState';

export function ResultCard({ result }: { result: ReportModel['result'] }) {
  return (
    <Card aria-label="Result summary" className="flex flex-col gap-[14px] px-[18px] pt-[16px] pb-[18px]">
      <SectionHeader title="Result" right={result.summary} rightClassName="text-muted" />
      <SegmentedBar segments={result.segments} />
      <div className="flex flex-col gap-[8px]">
        <span className="font-mono text-[10.5px] tracking-[0.12em] text-muted uppercase">
          Today&apos;s runs
        </span>
        <div className="grid grid-cols-4 gap-[6px]">
          {result.history.map((h) => {
            const s = STATUS_STYLE[h.status];
            return (
              <Link
                key={h.key}
                to={h.href}
                aria-current={h.current ? 'page' : undefined}
                className={cn('flex flex-col gap-[4px] border p-[8px]', s.border, s.tint, s.ink)}
              >
                <span className="font-mono text-[12px] font-bold">{h.time}</span>
                <span className="font-mono text-[10px] tracking-[0.06em] uppercase">{s.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
