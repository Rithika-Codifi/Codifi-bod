import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/core/utils';

/** Row inside a card list: flex, 1px soft divider. Spacing comes from the screen. */
export function ListRow({
  to,
  className,
  children,
  ariaLabel,
}: {
  to?: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const cls = cn('flex items-center border-b border-surface-muted text-text', className);
  return to ? (
    <Link to={to} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  ) : (
    <div className={cls}>{children}</div>
  );
}
