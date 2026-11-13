import type { Status, TimeIST } from '@/core/domain';

export interface StatusCounts {
  readonly pass: number;
  readonly warn: number;
  readonly fail: number;
}

export interface BodWindow {
  readonly start: TimeIST;
  readonly cutoff: TimeIST;
  /** End of the timeline scale (first market open). */
  readonly end: TimeIST;
  /** e.g. "MCX opens 09:00 · NSE 09:15" */
  readonly marketNote: string;
  readonly runsDone: number;
  readonly runsTotal: number;
  readonly lastRun: TimeIST;
  readonly nextRun: TimeIST;
}

export interface OverviewStats {
  readonly failedChecks: number;
  readonly failedEtl: number;
  readonly failedApi: number;
  readonly warnings: number;
  readonly warningsNote: string;
  readonly etlDone: number;
  readonly etlTotal: number;
  readonly avgRunSeconds: number;
}

export interface AttentionItem {
  readonly customerId: string;
  readonly customerName: string;
  readonly status: Status;
  readonly text: string;
  readonly time: TimeIST;
}

export interface Overview {
  /** Server time of the snapshot (IST). */
  readonly asOf: Date;
  readonly now: TimeIST;
  readonly customers: StatusCounts;
  readonly window: BodWindow;
  readonly stats: OverviewStats;
  readonly attention: readonly AttentionItem[];
  readonly unreadAlerts: number;
}

export const totalOf = (c: StatusCounts): number => c.pass + c.warn + c.fail;

export const overallStatus = (c: StatusCounts): Status =>
  c.fail > 0 ? 'fail' : c.warn > 0 ? 'warn' : 'pass';
