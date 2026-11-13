import type { AxiosInstance } from 'axios';

import { delay, mockLatency } from '@/core/utils';
import { overviewSeed } from '@/mocks/overview';

import type { OverviewDto, RetestResultDto } from '../dto/OverviewDto';

export interface OverviewDataSource {
  fetchOverview(): Promise<OverviewDto>;
  retestAllFailed(): Promise<RetestResultDto>;
}

export class OverviewRemoteDataSource implements OverviewDataSource {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async fetchOverview(): Promise<OverviewDto> {
    const { data } = await this.http.get<OverviewDto>('/overview');
    return data;
  }

  async retestAllFailed(): Promise<RetestResultDto> {
    const { data } = await this.http.post<RetestResultDto>('/retests', { scope: 'all-failed' });
    return data;
  }
}

export class OverviewMockDataSource implements OverviewDataSource {
  async fetchOverview(): Promise<OverviewDto> {
    await mockLatency();
    return structuredClone(overviewSeed);
  }

  async retestAllFailed(): Promise<RetestResultDto> {
    await delay(1200);
    return { queued: overviewSeed.stats.failed_checks };
  }
}
