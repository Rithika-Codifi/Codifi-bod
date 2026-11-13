import type { CheckSource, ModuleChecks, ModuleChecksRepository } from '../../domain';
import type { ModuleChecksDataSource } from '../datasources/ModuleChecksDataSource';
import { toModuleChecks } from '../mappers/moduleChecksMapper';

export class ModuleChecksRepositoryImpl implements ModuleChecksRepository {
  private readonly source: ModuleChecksDataSource;

  constructor(source: ModuleChecksDataSource) {
    this.source = source;
  }

  async getModuleChecks(
    customerId: string,
    moduleId: string,
    opts: { allPassed: boolean },
  ): Promise<ModuleChecks> {
    return toModuleChecks(await this.source.fetchModuleChecks(customerId, moduleId, opts.allPassed));
  }

  async getEtlChecks(customerId: string, etlId: string, opts: { allPassed: boolean }): Promise<ModuleChecks> {
    return toModuleChecks(await this.source.fetchEtlChecks(customerId, etlId, opts.allPassed));
  }

  retestChecks(customerId: string, source: CheckSource, checkIds: readonly string[]): Promise<void> {
    return this.source.retestChecks(customerId, source, checkIds);
  }
}
