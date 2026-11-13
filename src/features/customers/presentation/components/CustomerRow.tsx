import { ListRow, ProgressLine, StatusBadge, StatusIcon } from '@/shared/ui';

import type { CustomerRowModel } from '../state/customersState';

export function CustomerRow({ row }: { row: CustomerRowModel }) {
  return (
    <ListRow to={row.href} className="min-h-[66px] gap-[12px] py-[10px] pr-[12px] pl-[14px]">
      <StatusIcon status={row.status} size={24} />
      <div className="flex min-w-0 flex-auto flex-col gap-[5px]">
        <span className="overflow-hidden text-[14px] font-semibold text-ellipsis whitespace-nowrap">
          {row.name}
        </span>
        <span className="-mb-[1px] font-mono text-[11px] leading-[16px] text-muted">{row.meta}</span>
        <ProgressLine status={row.status} ratio={row.ratio} />
      </div>
      <div className="flex flex-none flex-col items-end gap-[6px]">
        <StatusBadge status={row.status} size="sm" />
        <span className="font-mono text-[11px] text-muted">{row.time}</span>
      </div>
    </ListRow>
  );
}
