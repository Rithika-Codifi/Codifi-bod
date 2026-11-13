import { BackLink, PageHeader } from '@/shared/layout';
import { Button, DownloadIcon, RefreshIcon, StatStrip, StatusBadge } from '@/shared/ui';

import type { CustomerDetailModel } from '../state/customerDetailState';

export interface CustomerDetailHeaderProps {
  header: CustomerDetailModel['header'];
  retesting: boolean;
  downloading: boolean;
  onRetestFailed: () => void;
  onDownloadReport: () => void;
}

export function CustomerDetailHeader({
  header,
  retesting,
  downloading,
  onRetestFailed,
  onDownloadReport,
}: CustomerDetailHeaderProps) {
  return (
    <PageHeader className="flex flex-col gap-[14px] px-[16px] pt-[10px] pb-[18px]">
      <BackLink to="/customers" label="Customers" />
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex flex-col gap-[4px]">
          <h1 className="m-0 font-serif text-[28px] leading-[1.1] font-normal">{header.name}</h1>
          <span className="font-mono text-[11px] tracking-[0.1em] text-subtle uppercase">
            {header.segments}
          </span>
        </div>
        <StatusBadge status={header.status} />
      </div>
      <StatStrip items={header.strip} />
      <div className="flex gap-[10px]">
        <Button
          fill
          icon={<RefreshIcon size={16} strokeWidth={2} />}
          loading={retesting}
          disabled={!retesting && header.retestJobIds.length === 0}
          onClick={onRetestFailed}
        >
          Retest failed
        </Button>
        {/* Navigation to the test report screen is disabled for now.
        <LinkButton to={header.reportHref} variant="outline" fill>
          View report
        </LinkButton>
        */}
        <Button
          variant="outline"
          fill
          icon={<DownloadIcon size={16} />}
          loading={downloading}
          onClick={onDownloadReport}
        >
          Download report
        </Button>
      </div>
    </PageHeader>
  );
}
