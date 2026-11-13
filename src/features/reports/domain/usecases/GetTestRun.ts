import { bySeverity } from '@/core/domain';

import type { TestRun } from '../entities';
import type { ReportRepository } from '../repositories/ReportRepository';

/** Loads a test run; failures are ordered fail → warn. */
export class GetTestRun {
  private readonly repository: ReportRepository;

  constructor(repository: ReportRepository) {
    this.repository = repository;
  }

  async execute(runId: string): Promise<TestRun> {
    const run = await this.repository.getRun(runId);
    return { ...run, failures: [...run.failures].sort(bySeverity) };
  }
}
