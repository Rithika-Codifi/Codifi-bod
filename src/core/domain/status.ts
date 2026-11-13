export type Status = 'pass' | 'warn' | 'fail' | 'running';

export const SEVERITY: Record<Status, number> = { fail: 0, warn: 1, running: 2, pass: 3 };

export const bySeverity = <T extends { status: Status }>(a: T, b: T): number =>
  SEVERITY[a.status] - SEVERITY[b.status];
