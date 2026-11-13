import { Button, Card, LinkButton, SectionHeader, Timeline } from '@/shared/ui';

import type { OverviewModel } from '../state/overviewState';

export interface WindowCardProps {
  window: OverviewModel['window'];
  canRetest: boolean;
  retesting: boolean;
  onRetest: () => void;
}

export function WindowCard({ window: w, canRetest, retesting, onRetest }: WindowCardProps) {
  return (
    <Card aria-label="BOD window" className="flex flex-col gap-[14px] px-[20px] pt-[18px] pb-[20px]">
      <SectionHeader
        title="BOD window"
        right={w.marketNote}
        rightClassName="tracking-[0.1em] text-subtle uppercase"
      />
      <Timeline
        startLabel={w.startLabel}
        nowLabel={w.nowLabel}
        cutoffLabel={w.cutoffLabel}
        nowRatio={w.nowRatio}
        cutoffRatio={w.cutoffRatio}
      />
      <div className="flex items-center justify-between gap-[12px] bg-surface-sunken px-[14px] py-[12px]">
        <div className="flex flex-col gap-[3px]">
          <span className="text-[13px] font-semibold">{w.runTitle}</span>
          <span className="font-mono text-[11px] text-muted">{w.runMeta}</span>
        </div>
        <span className="font-mono text-[13px] font-bold text-fail-ink">{w.timeLeft}</span>
      </div>
      <div className="flex gap-[10px]">
        <Button fill loading={retesting} disabled={!canRetest} onClick={onRetest}>
          {retesting ? 'Retesting…' : 'Retest all failed'}
        </Button>
        <LinkButton to="/reports/latest" variant="outline" fill>
          Latest report
        </LinkButton>
      </div>
    </Card>
  );
}
