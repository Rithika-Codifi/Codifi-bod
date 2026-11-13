import { STATUS_STYLE } from '@/core/config/status';
import { cn } from '@/core/utils';
import { CodeBlock, StatusBadge } from '@/shared/ui';

import type { ReportModel } from '../state/reportState';

export function FailureCard({ failure: f }: { failure: ReportModel['failures'][number] }) {
  return (
    <article
      className={cn(
        'flex flex-col gap-[10px] border border-t-[3px] border-border bg-surface px-[16px] pt-[14px] pb-[16px]',
        STATUS_STYLE[f.status].borderTop,
      )}
    >
      <div className="flex items-center justify-between gap-[10px]">
        <span className="text-[15px] font-semibold">{f.name}</span>
        <StatusBadge status={f.status} size="sm" />
      </div>
      <span className="font-mono text-[11px] text-muted">{f.request}</span>
      <p className="m-0 text-[13px] leading-[1.5]">{f.message}</p>
      <CodeBlock>{f.log}</CodeBlock>
      <span className="font-mono text-[11px] text-muted">{f.hint}</span>
    </article>
  );
}
