import type { CustomerDetailRepository } from '../repositories/CustomerDetailRepository';

export class RetestEtlJobs {
  private readonly repository: CustomerDetailRepository;

  constructor(repository: CustomerDetailRepository) {
    this.repository = repository;
  }

  async execute(customerId: string, jobIds: readonly string[]): Promise<void> {
    if (jobIds.length === 0) return;
    await this.repository.retestEtlJobs(customerId, [...new Set(jobIds)]);
  }
}
