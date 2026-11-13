import type { Overview } from '../entities';

export interface RetestResult {
  readonly queued: number;
}

export interface OverviewRepository {
  getOverview(): Promise<Overview>;
  retestAllFailed(): Promise<RetestResult>;
}
