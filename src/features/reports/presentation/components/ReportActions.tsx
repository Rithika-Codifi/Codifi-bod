import { Button, DownloadIcon, ShareIcon } from '@/shared/ui';

export interface ReportActionsProps {
  retesting: boolean;
  onPrint: () => void;
  onShare: () => void;
  onRetest: () => void;
}

/** Sticky bottom action bar (replaces the bottom nav on this screen). */
export function ReportActions({ retesting, onPrint, onShare, onRetest }: ReportActionsProps) {
  return (
    <div className="sticky bottom-0 z-20 mt-auto grid grid-cols-3 gap-[8px] border-t border-border bg-surface-muted px-[16px] pt-[12px] pb-[calc(16px+env(safe-area-inset-bottom))] print:hidden">
      <Button variant="secondary" size="bar" icon={<DownloadIcon size={16} />} onClick={onPrint}>
        PDF
      </Button>
      <Button variant="secondary" size="bar" icon={<ShareIcon size={16} />} onClick={onShare}>
        Share
      </Button>
      <Button variant="primary" size="bar" loading={retesting} onClick={onRetest} className="px-0">
        Retest
      </Button>
    </div>
  );
}
