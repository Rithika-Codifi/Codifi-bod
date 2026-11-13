import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { ChevronLeftIcon } from '@/shared/ui/icons';

/** "‹ CUSTOMERS" row with an optional mono label on the right. */
export function BackLink({ to, label, right }: { to: string; label: string; right?: ReactNode }) {
  return (
    <div className="ml-[-10px] flex items-center justify-between">
      <Link
        to={to}
        className="flex h-[44px] items-center gap-[2px] pr-[8px] font-mono text-[11px] tracking-[0.1em] text-muted uppercase"
      >
        <ChevronLeftIcon size={22} />
        {label}
      </Link>
      {right != null && <span className="font-mono text-[11px] text-subtle">{right}</span>}
    </div>
  );
}
