import type { CheckSource, ModuleChecks } from '../entities';

export interface ModuleChecksRepository {
  getModuleChecks(customerId: string, moduleId: string, opts: { allPassed: boolean }): Promise<ModuleChecks>;
  getEtlChecks(customerId: string, etlId: string, opts: { allPassed: boolean }): Promise<ModuleChecks>;
  retestChecks(customerId: string, source: CheckSource, checkIds: readonly string[]): Promise<void>;
}
