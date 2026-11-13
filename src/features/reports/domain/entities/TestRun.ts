import type { Status, TimeIST } from '@/core/domain';

export interface RunFailure {
  readonly id: string;
  readonly status: Status;
  readonly name: string;
  readonly method: string;
  readonly path: string;
  readonly at: TimeIST;
  readonly message: string;
  readonly log: string;
  readonly hint: string;
}

export interface RunCheck {
  readonly name: string;
  readonly latencyMs: number;
  readonly status: Status;
}

export interface RunHistoryItem {
  readonly runId: string;
  readonly time: TimeIST;
  readonly status: Status;
}

export interface TestRun {
  readonly id: string;
  readonly customerId: string;
  readonly customerName: string;
  readonly moduleId: string;
  readonly moduleName: string;
  readonly suite: string;
  readonly trigger: 'scheduled' | 'manual';
  readonly scheduledAt: TimeIST;
  readonly startedAt: Date;
  readonly finishedAt: Date;
  readonly environment: string;
  readonly status: Status;
  readonly counts: { readonly pass: number; readonly warn: number; readonly fail: number };
  readonly history: readonly RunHistoryItem[];
  readonly failures: readonly RunFailure[];
  /** First page of checks. */
  readonly checks: readonly RunCheck[];
}

export const runTotal = (r: TestRun): number => r.counts.pass + r.counts.warn + r.counts.fail;

/** Pass rate in percent with one decimal, e.g. 91.2. */
export const passRate = (r: TestRun): number => {
  const total = runTotal(r);
  return total === 0 ? 0 : Math.round((r.counts.pass / total) * 1000) / 10;
};

export const durationSeconds = (r: TestRun): number =>
  Math.max(0, Math.round((r.finishedAt.getTime() - r.startedAt.getTime()) / 1000));
