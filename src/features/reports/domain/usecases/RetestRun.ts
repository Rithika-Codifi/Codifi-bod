import type { ReportRepository } from '../repositories/ReportRepository';

export class RetestRun {
  private readonly repository: ReportRepository;

  constructor(repository: ReportRepository) {
    this.repository = repository;
  }

  execute(runId: string): Promise<{ runId: string }> {
    return this.repository.retestRun(runId);
  }
}
