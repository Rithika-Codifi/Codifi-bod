import type { Status } from '@/core/domain';

/** Status → token classes (static strings so Tailwind can see them). Never use raw colors. */
export interface StatusStyle {
  label: string;
  /** Solid status fill (dots, icons, bars). */
  solid: string;
  /** Solid status color as border (badges, legend rule). */
  border: string;
  /** Status color on the top border only (failure cards). */
  borderTop: string;
  tint: string;
  ink: string;
  /** Soft ring around the large status icon. */
  ring: string;
  /** Active fill of the status filter tab. */
  tab: string;
}

export const STATUS_STYLE: Record<Status, StatusStyle> = {
  pass: {
    label: 'Passed',
    solid: 'bg-pass',
    border: 'border-pass',
    borderTop: 'border-t-pass',
    tint: 'bg-pass-tint',
    ink: 'text-pass-ink',
    ring: 'shadow-[0_0_0_7px_var(--pass-ring)]',
    tab: 'bg-pass',
  },
  warn: {
    label: 'Warning',
    solid: 'bg-warn',
    border: 'border-warn',
    borderTop: 'border-t-warn',
    tint: 'bg-warn-tint',
    ink: 'text-warn-ink',
    ring: 'shadow-[0_0_0_7px_var(--warn-ring)]',
    tab: 'bg-warn-strong',
  },
  fail: {
    label: 'Failed',
    solid: 'bg-fail',
    border: 'border-fail',
    borderTop: 'border-t-fail',
    tint: 'bg-fail-tint',
    ink: 'text-fail-ink',
    ring: 'shadow-[0_0_0_7px_var(--fail-ring)]',
    tab: 'bg-fail',
  },
  running: {
    label: 'Running',
    solid: 'bg-running',
    border: 'border-running',
    borderTop: 'border-t-running',
    tint: 'bg-running-tint',
    ink: 'text-running-ink',
    ring: 'shadow-[0_0_0_7px_var(--running-tint)]',
    tab: 'bg-running',
  },
};
