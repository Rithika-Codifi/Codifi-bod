import type { TestRun } from '../entities';

export interface ReportRepository {
  /** `runId` may be "latest". */
  getRun(runId: string): Promise<TestRun>;
  /** Starts a retest of the run's failed and warning checks; resolves with the new run id. */
  retestRun(runId: string): Promise<{ runId: string }>;
}
