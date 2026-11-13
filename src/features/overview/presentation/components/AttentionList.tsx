import { Card, ChevronRightIcon, ListRow, SectionHeader, StatusIcon } from '@/shared/ui';

import type { OverviewModel } from '../state/overviewState';

export function AttentionList({ items }: { items: OverviewModel['attention'] }) {
  return (
    <Card aria-label="Needs attention" id="needs-attention" tabIndex={-1} className="flex flex-col">
      <SectionHeader
        title="Needs attention"
        layout="inline"
        className="border-b border-border px-[20px] pt-[16px] pb-[12px]"
        right={
          <>
            <b className="text-text">{items.length}</b> items
          </>
        }
      />
      {items.map((it) => (
        <ListRow key={it.key} to={it.href} className="min-h-[68px] gap-[12px] py-[12px] pr-[16px] pl-[20px]">
          <StatusIcon status={it.status} size={26} />
          <div className="flex min-w-0 flex-auto flex-col gap-[3px]">
            <span className="text-[14px] font-semibold">{it.name}</span>
            <span className="text-[12.5px] leading-[1.35] text-muted">{it.text}</span>
          </div>
          <div className="flex flex-none flex-col items-end gap-[4px]">
            <span className="font-mono text-[11px] text-muted">{it.time}</span>
            <ChevronRightIcon size={16} strokeWidth={2} className="text-subtle" />
          </div>
        </ListRow>
      ))}
    </Card>
  );
}
