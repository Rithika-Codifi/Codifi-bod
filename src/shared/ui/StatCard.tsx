import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/core/utils';

const TONE = {
  default: 'text-text',
  fail: 'text-fail-strong',
  warn: 'text-warn-strong',
  pass: 'text-pass-ink',
} as const;

export interface StatCardProps {
  label: string;
  value: ReactNode;
  /** Smaller muted suffix, e.g. "/136". */
  suffix?: string;
  caption?: string;
  tone?: keyof typeof TONE;
  highlight?: boolean;
  to?: string;
}

export function StatCard({ label, value, suffix, caption, tone = 'default', highlight, to }: StatCardProps) {
  const body = (
    <>
      <span className="font-mono text-[10.5px] tracking-[0.14em] text-muted uppercase">{label}</span>
      <span className={cn('font-mono text-[30px] font-bold', TONE[tone])}>
        {value}
        {suffix && <span className="text-[16px] text-subtle">{suffix}</span>}
      </span>
      {caption && <span className="font-mono text-[11px] text-muted">{caption}</span>}
    </>
  );
  const cls = cn('flex flex-col gap-[6px] p-[16px] text-text', highlight ? 'bg-highlight' : 'bg-surface');
  return to ? (
    <Link to={to} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/** 2-column grid with 1px hairlines between cards. */
export function StatCardGrid({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('grid grid-cols-2 gap-px border border-border bg-border', className)}>{children}</div>
  );
}
