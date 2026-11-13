import { bySeverity } from '@/core/domain';

import type { ModuleChecks } from '../entities';
import type { ModuleChecksRepository } from '../repositories/ModuleChecksRepository';

/** Loads the step checks of one ETL job (upload → validate → load), failures first. */
export class GetEtlChecks {
  private readonly repository: ModuleChecksRepository;

  constructor(repository: ModuleChecksRepository) {
    this.repository = repository;
  }

  async execute(customerId: string, etlId: string, opts = { allPassed: false }): Promise<ModuleChecks> {
    const m = await this.repository.getEtlChecks(customerId, etlId, opts);
    return { ...m, checks: [...m.checks].sort(bySeverity) };
  }
}
