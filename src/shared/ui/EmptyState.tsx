import type { ReactNode } from 'react';

import { cn } from '@/core/utils';

export function EmptyState({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="status" className={cn('px-[20px] py-[32px] text-center text-[13px] text-muted', className)}>
      {children}
    </div>
  );
}
