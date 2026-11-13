import type { CSSProperties } from 'react';

import { cn } from '@/core/utils';

/** Placeholder block. `data-skeleton` lets the visual harness wait for real content. */
export function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div
      data-skeleton=""
      aria-hidden="true"
      className={cn('animate-pulse-soft bg-surface-muted', className)}
      style={style}
    />
  );
}

/** A card of N skeleton rows, for list screens. */
export function SkeletonList({
  rows = 6,
  rowHeight = 66,
  className,
}: {
  rows?: number;
  rowHeight?: number;
  className?: string;
}) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className={cn('flex flex-col border border-border bg-surface', className)}
    >
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-[12px] border-b border-surface-muted px-[14px]"
          style={{ minHeight: rowHeight }}
        >
          <Skeleton className="size-[24px] rounded-full" />
          <div className="flex flex-auto flex-col gap-[6px]">
            <Skeleton className="h-[14px] w-[55%]" />
            <Skeleton className="h-[10px] w-[35%]" />
          </div>
        </div>
      ))}
    </div>
  );
}
