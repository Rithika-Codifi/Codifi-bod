import { Skeleton, SkeletonList } from '@/shared/ui';

export function OverviewSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading overview" className="flex flex-col gap-[16px]">
      <Skeleton className="h-[330px] border border-border" />
      <Skeleton className="h-[260px] border border-border" />
      <Skeleton className="h-[228px] border border-border" />
      <SkeletonList rows={5} rowHeight={68} />
    </div>
  );
}
