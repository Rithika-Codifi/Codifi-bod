import type { Status, TimeIST } from '@/core/domain';

export interface EtlJob {
  readonly id: string;
  readonly name: string;
  readonly status: Status;
  /** e.g. "07:31 · File not found on exchange SFTP" */
  readonly meta: string;
}

export interface ModuleSummary {
  readonly id: string;
  readonly name: string;
  readonly passed: number;
  readonly warnings: number;
  readonly failures: number;
  readonly note: string;
}

export interface CustomerDetail {
  readonly id: string;
  readonly name: string;
  readonly status: Status;
  /** e.g. ["NSE", "BSE", "MCX", "Web", "Mobile", "API"] */
  readonly segments: readonly string[];
  readonly lastRun: TimeIST;
  readonly latestRunId: string;
  readonly etl: readonly EtlJob[];
  readonly modules: readonly ModuleSummary[];
}

export const moduleTotal = (m: ModuleSummary): number => m.passed + m.warnings + m.failures;

export const moduleStatus = (m: ModuleSummary): Status =>
  m.failures > 0 ? 'fail' : m.warnings > 0 ? 'warn' : 'pass';

export const etlPassed = (d: CustomerDetail): number => d.etl.filter((j) => j.status === 'pass').length;

export const modulesHealthy = (d: CustomerDetail): number =>
  d.modules.filter((m) => moduleStatus(m) === 'pass').length;

/** Jobs a "Retest failed" action should rerun (failed or warning). */
export const retestableJobIds = (d: CustomerDetail): string[] =>
  d.etl.filter((j) => j.status === 'fail' || j.status === 'warn').map((j) => j.id);
