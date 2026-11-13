import type { OverviewRepository, RetestResult } from '../repositories/OverviewRepository';

export class RetestAllFailed {
  private readonly repository: OverviewRepository;

  constructor(repository: OverviewRepository) {
    this.repository = repository;
  }

  execute(): Promise<RetestResult> {
    return this.repository.retestAllFailed();
  }
}
