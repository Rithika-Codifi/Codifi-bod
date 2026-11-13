import { STATUS_STYLE } from '@/core/config/status';
import type { Status } from '@/core/domain';
import { cn } from '@/core/utils';

import { BangGlyph, CheckGlyph, CrossGlyph, RefreshIcon } from './icons';

/** Circle size → glyph size and stroke widths, as in the design sources. */
const SPEC = {
  56: { box: 'size-[56px]', glyph: 26, fail: 2.4, warn: 2.6, pass: 2.4 },
  26: { box: 'size-[26px]', glyph: 13, fail: 3, warn: 3.2, pass: 3 },
  24: { box: 'size-[24px]', glyph: 12, fail: 3.2, warn: 3.4, pass: 3.2 },
} as const;

export interface StatusIconProps {
  status: Status;
  size?: keyof typeof SPEC;
  /** Soft ring around the circle (overview hero). */
  ring?: boolean;
  className?: string;
}

export function StatusIcon({ status, size = 24, ring, className }: StatusIconProps) {
  const spec = SPEC[size];
  const s = STATUS_STYLE[status];
  return (
    <span
      className={cn(
        'flex flex-none items-center justify-center rounded-full text-on-dark',
        spec.box,
        s.solid,
        ring && s.ring,
        className,
      )}
    >
      {status === 'fail' && <CrossGlyph size={spec.glyph} strokeWidth={spec.fail} />}
      {status === 'warn' && <BangGlyph size={spec.glyph} strokeWidth={spec.warn} large={size === 56} />}
      {status === 'pass' && <CheckGlyph size={spec.glyph} strokeWidth={spec.pass} />}
      {status === 'running' && (
        <RefreshIcon size={spec.glyph} strokeWidth={2.4} className="animate-bodspin" />
      )}
    </span>
  );
}

export function StatusDot({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('size-[10px] flex-none rounded-full', STATUS_STYLE[status].solid, className)}
    />
  );
}
