import { Link } from 'react-router-dom';

import { ArrowRightIcon, SegmentedBar, StatusBadge, StatusIcon, StatusLegend } from '@/shared/ui';

import type { OverviewModel } from '../state/overviewState';

export function HeroCard({ hero }: { hero: OverviewModel['hero'] }) {
  return (
    <Link
      to="/customers"
      className="flex flex-col gap-[18px] border border-border bg-surface p-[20px] text-text"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-subtle uppercase">
          Overall BOD status
        </span>
        <StatusBadge status={hero.status} />
      </div>
      <div className="flex items-center gap-[16px]">
        <StatusIcon status={hero.status} size={56} ring />
        <div className="flex flex-col gap-[4px]">
          <span className="font-serif text-[30px] leading-[1.05]">{hero.title}</span>
          <span className="text-[13px] leading-[1.4] text-muted">{hero.sub}</span>
        </div>
      </div>
      <SegmentedBar height={30} minSegmentWidth={28} segments={hero.bar} />
      <StatusLegend items={hero.legend} />
      <div className="flex items-center justify-between border-t border-dashed border-border pt-[14px]">
        <span className="font-mono text-[11px] font-semibold tracking-[0.12em] uppercase">
          View all {hero.total} customers
        </span>
        <ArrowRightIcon size={18} />
      </div>
    </Link>
  );
}
