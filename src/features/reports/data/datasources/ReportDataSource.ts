import type { AxiosInstance } from 'axios';

import type { AppError } from '@/core/domain';
import { delay, mockLatency } from '@/core/utils';
import { testRunSeed } from '@/mocks/testRun';

import type { TestRunDto } from '../dto/TestRunDto';

export interface ReportDataSource {
  fetchRun(runId: string): Promise<TestRunDto>;
  retestRun(runId: string): Promise<{ run_id: string }>;
}

export class ReportRemoteDataSource implements ReportDataSource {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async fetchRun(runId: string): Promise<TestRunDto> {
    const { data } = await this.http.get<TestRunDto>(`/runs/${encodeURIComponent(runId)}`);
    return data;
  }

  async retestRun(runId: string): Promise<{ run_id: string }> {
    const { data } = await this.http.post<{ run_id: string }>(`/runs/${encodeURIComponent(runId)}/retests`);
    return data;
  }
}

export class ReportMockDataSource implements ReportDataSource {
  async fetchRun(runId: string): Promise<TestRunDto> {
    await mockLatency();
    try {
      return testRunSeed(runId);
    } catch {
      throw { kind: 'not-found', status: 404, message: `Run #${runId} not found.` } satisfies AppError;
    }
  }

  async retestRun(runId: string): Promise<{ run_id: string }> {
    await delay(800);
    return { run_id: `${Number(testRunSeed(runId).id) + 1}` };
  }
}
