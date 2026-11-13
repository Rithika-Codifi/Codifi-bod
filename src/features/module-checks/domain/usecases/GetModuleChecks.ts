import { bySeverity } from '@/core/domain';

import type { ModuleChecks } from '../entities';
import type { ModuleChecksRepository } from '../repositories/ModuleChecksRepository';

/** Loads a module's API checks, failures first (stable within a status). */
export class GetModuleChecks {
  private readonly repository: ModuleChecksRepository;

  constructor(repository: ModuleChecksRepository) {
    this.repository = repository;
  }

  async execute(customerId: string, moduleId: string, opts = { allPassed: false }): Promise<ModuleChecks> {
    const m = await this.repository.getModuleChecks(customerId, moduleId, opts);
    return { ...m, checks: [...m.checks].sort(bySeverity) };
  }
}
