import { BackLink, PageHeader } from '@/shared/layout';
import { StatusBadge } from '@/shared/ui';

import type { ReportModel } from '../state/reportState';

export function ReportHeader({ header }: { header: ReportModel['header'] }) {
  return (
    <PageHeader className="flex flex-col gap-[12px] px-[16px] pt-[10px] pb-[18px]">
      <BackLink to={header.backHref} label={header.backLabel} right={header.runLabel} />
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex flex-col gap-[4px]">
          <h1 className="m-0 font-serif text-[30px] leading-[1.05] font-normal">Test report</h1>
          <span className="text-[13px] text-muted">{header.subtitle}</span>
        </div>
        <StatusBadge status={header.status} />
      </div>
    </PageHeader>
  );
}
