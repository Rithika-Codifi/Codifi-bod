import { bySeverity } from '@/core/domain';

import type { CheckSource } from '../entities';
import type { ModuleChecksRepository } from '../repositories/ModuleChecksRepository';
import type { ChecksReportExporter } from '../services/ChecksReportExporter';

/** Downloads the full checks report (every check, failures first) for a module or ETL job. */
export class DownloadChecksReport {
  private readonly repository: ModuleChecksRepository;
  private readonly exporter: ChecksReportExporter;

  constructor(repository: ModuleChecksRepository, exporter: ChecksReportExporter) {
    this.repository = repository;
    this.exporter = exporter;
  }

  async execute(customerId: string, source: CheckSource, now: Date = new Date()): Promise<string> {
    const opts = { allPassed: true };
    const report =
      source.kind === 'etl'
        ? await this.repository.getEtlChecks(customerId, source.id, opts)
        : await this.repository.getModuleChecks(customerId, source.id, opts);
    return this.exporter.download({ ...report, checks: [...report.checks].sort(bySeverity) }, now);
  }
}
