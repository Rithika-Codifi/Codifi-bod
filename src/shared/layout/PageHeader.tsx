import type { ReactNode } from 'react';

import { cn } from '@/core/utils';

/** Sticky screen header: bg color + bottom border. Padding/layout come from the screen. */
export function PageHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <header className={cn('sticky top-0 z-10 border-b border-border bg-bg', className)}>{children}</header>
  );
}
