export type Status = 'pass' | 'warn' | 'fail' | 'running';

/** Order statuses are always displayed in (bars, legends, tabs, chips): failed, warning, passed. */
export const STATUS_DISPLAY_ORDER: readonly Status[] = ['fail', 'warn', 'pass', 'running'];

export const byDisplayOrder = <T extends { status: Status }>(a: T, b: T): number =>
  STATUS_DISPLAY_ORDER.indexOf(a.status) - STATUS_DISPLAY_ORDER.indexOf(b.status);

export const SEVERITY: Record<Status, number> = { fail: 0, warn: 1, running: 2, pass: 3 };

export const bySeverity = <T extends { status: Status }>(a: T, b: T): number =>
  SEVERITY[a.status] - SEVERITY[b.status];
