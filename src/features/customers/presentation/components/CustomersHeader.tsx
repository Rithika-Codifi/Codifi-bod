import { Link } from 'react-router-dom';

import type { Status } from '@/core/domain';
import { PageHeader } from '@/shared/layout';
import { ChevronLeftIcon, Skeleton, StatusBadge } from '@/shared/ui';

export interface CustomersHeaderProps {
  brokers?: number;
  updatedAt?: string;
  overall?: Status;
}

export function CustomersHeader({ brokers, updatedAt, overall }: CustomersHeaderProps) {
  return (
    <PageHeader className="flex items-center gap-[6px] py-[10px] pr-[16px] pl-[6px]">
      <Link
        to="/"
        aria-label="Back to overview"
        className="flex size-[44px] flex-none items-center justify-center text-text"
      >
        <ChevronLeftIcon size={22} />
      </Link>
      <div className="flex flex-auto flex-col gap-[2px]">
        <h1 className="m-0 font-serif text-[22px] leading-[1.1] font-normal">
          Customers <em className="text-subtle italic">— BOD status</em>
        </h1>
        {brokers != null && updatedAt ? (
          <span className="font-mono text-[11px] tracking-[0.1em] text-subtle uppercase">
            {brokers} brokers · updated {updatedAt}
          </span>
        ) : (
          <Skeleton className="h-[13px] w-[180px]" />
        )}
      </div>
      {overall ? <StatusBadge status={overall} /> : <Skeleton className="h-[26px] w-[67px]" />}
    </PageHeader>
  );
}
