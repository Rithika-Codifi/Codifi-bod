import type { CheckSource } from '../entities';
import type { ModuleChecksRepository } from '../repositories/ModuleChecksRepository';

export class RetestChecks {
  private readonly repository: ModuleChecksRepository;

  constructor(repository: ModuleChecksRepository) {
    this.repository = repository;
  }

  async execute(customerId: string, source: CheckSource, checkIds: readonly string[]): Promise<void> {
    if (checkIds.length === 0) return;
    await this.repository.retestChecks(customerId, source, [...new Set(checkIds)]);
  }
}
