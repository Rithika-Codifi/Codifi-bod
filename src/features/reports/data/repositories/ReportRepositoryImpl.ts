import type { ReportRepository, TestRun } from '../../domain';
import type { ReportDataSource } from '../datasources/ReportDataSource';
import { toTestRun } from '../mappers/testRunMapper';

export class ReportRepositoryImpl implements ReportRepository {
  private readonly source: ReportDataSource;

  constructor(source: ReportDataSource) {
    this.source = source;
  }

  async getRun(runId: string): Promise<TestRun> {
    return toTestRun(await this.source.fetchRun(runId));
  }

  async retestRun(runId: string): Promise<{ runId: string }> {
    const { run_id } = await this.source.retestRun(runId);
    return { runId: run_id };
  }
}
