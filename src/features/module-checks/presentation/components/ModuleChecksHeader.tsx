import { BackLink, PageHeader } from '@/shared/layout';
import { Button, DownloadIcon, RefreshIcon, SegmentedBar, StatusBadge } from '@/shared/ui';
// import { LinkButton } from '@/shared/ui'; // used by the disabled "Test report" link

import type { ModuleChecksModel } from '../state/moduleChecksState';

export interface ModuleChecksHeaderProps {
  header: ModuleChecksModel['header'];
  retesting: boolean;
  downloading: boolean;
  onRetestFailed: () => void;
  onDownloadReport: () => void;
}

export function ModuleChecksHeader({
  header,
  retesting,
  downloading,
  onRetestFailed,
  onDownloadReport,
}: ModuleChecksHeaderProps) {
  const { counts } = header;
  return (
    <PageHeader className="flex flex-col gap-[14px] px-[16px] pt-[10px] pb-[18px]">
      <BackLink to={header.backHref} label={header.backLabel} right={header.kindLabel} />
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex flex-col gap-[4px]">
          <h1 className="m-0 font-serif text-[30px] leading-[1.05] font-normal">
            {header.title} <em className="text-[22px] text-subtle italic">checks</em>
          </h1>
          <span className="font-mono text-[11px] text-muted">{header.sub}</span>
        </div>
        <StatusBadge status={header.status} />
      </div>
      <div className="flex flex-col gap-[8px]">
        <SegmentedBar segments={header.bar} />
        <div className="flex gap-[14px] font-mono text-[11px] text-muted">
          <span>
            <b className="text-fail-ink">{counts.fail}</b> failed
          </span>
          <span>
            <b className="text-warn-ink">{counts.warn}</b> warning
          </span>
          <span>
            <b className="text-pass-ink">{counts.pass}</b> passed
          </span>
          <span>of {counts.total}</span>
        </div>
      </div>
      <div className="flex gap-[10px]">
        <Button
          fill
          icon={<RefreshIcon size={16} strokeWidth={2} />}
          loading={retesting}
          disabled={!retesting && header.retestIds.length === 0}
          onClick={onRetestFailed}
        >
          Retest failed
        </Button>
        {/* Navigation to the test report screen is disabled for now; the button downloads a PDF.
        <LinkButton to={header.reportHref} variant="outline" fill>
          Test report
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
