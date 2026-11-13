import { PageHeader } from '@/shared/layout';
import { BellIcon, IconButton, Logo, RefreshIcon, Skeleton } from '@/shared/ui';

export interface OverviewHeaderProps {
  date?: string;
  alerts?: number;
  refreshing?: boolean;
  onRefresh: () => void;
}

export function OverviewHeader({ date, alerts = 0, refreshing, onRefresh }: OverviewHeaderProps) {
  return (
    <PageHeader className="flex items-center justify-between gap-[12px] pt-[14px] pr-[16px] pb-[12px] pl-[20px]">
      <div className="flex items-center gap-[10px]">
        <Logo />
        <div className="flex flex-col gap-[3px]">
          <h1 className="m-0 font-serif text-[22px] leading-[1.1] font-normal">
            BOD Monitor <em className="text-subtle italic">— today</em>
          </h1>
          {date ? (
            <span className="font-mono text-[11px] tracking-[0.1em] text-subtle uppercase">{date}</span>
          ) : (
            <Skeleton className="h-[13px] w-[200px]" />
          )}
        </div>
      </div>
      <div className="flex gap-[4px]">
        <IconButton label="Refresh status" onClick={onRefresh} aria-busy={refreshing || undefined}>
          <RefreshIcon size={20} className={refreshing ? 'animate-bodspin' : undefined} />
        </IconButton>
        <IconButton
          label={`Alerts, ${alerts} new`}
          onClick={() => document.getElementById('needs-attention')?.focus()}
        >
          <BellIcon size={20} />
          {alerts > 0 && (
            <span className="absolute top-[7px] right-[6px] box-border h-[16px] min-w-[16px] bg-fail px-[4px] text-center font-mono text-[10px] leading-[16px] font-bold text-on-dark">
              {alerts}
            </span>
          )}
        </IconButton>
      </div>
    </PageHeader>
  );
}
