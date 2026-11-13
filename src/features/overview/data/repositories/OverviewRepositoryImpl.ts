import type { Overview, OverviewRepository, RetestResult } from '../../domain';
import type { OverviewDataSource } from '../datasources/OverviewDataSource';
import { toOverview } from '../mappers/overviewMapper';

export class OverviewRepositoryImpl implements OverviewRepository {
  private readonly source: OverviewDataSource;

  constructor(source: OverviewDataSource) {
    this.source = source;
  }

  async getOverview(): Promise<Overview> {
    return toOverview(await this.source.fetchOverview());
  }

  retestAllFailed(): Promise<RetestResult> {
    return this.source.retestAllFailed();
  }
}
