import type { AxiosInstance } from 'axios';

import type { AppError } from '@/core/domain';
import { delay, mockLatency } from '@/core/utils';
import { etlChecksSeed } from '@/mocks/etlChecks';
import { moduleChecksSeed } from '@/mocks/moduleChecks';

import type { CheckSource } from '../../domain';
import type { ModuleChecksDto } from '../dto/ModuleChecksDto';

export interface ModuleChecksDataSource {
  fetchModuleChecks(customerId: string, moduleId: string, allPassed: boolean): Promise<ModuleChecksDto>;
  fetchEtlChecks(customerId: string, etlId: string, allPassed: boolean): Promise<ModuleChecksDto>;
  retestChecks(customerId: string, source: CheckSource, checkIds: readonly string[]): Promise<void>;
}

const path = (customerId: string, source: CheckSource) =>
  `/customers/${encodeURIComponent(customerId)}/${source.kind === 'etl' ? 'etl' : 'modules'}/${encodeURIComponent(source.id)}`;

export class ModuleChecksRemoteDataSource implements ModuleChecksDataSource {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async fetchModuleChecks(
    customerId: string,
    moduleId: string,
    allPassed: boolean,
  ): Promise<ModuleChecksDto> {
    const { data } = await this.http.get<ModuleChecksDto>(
      `${path(customerId, { kind: 'module', id: moduleId })}/checks`,
      {
        params: allPassed ? { passed: 'all' } : undefined,
      },
    );
    return data;
  }

  async fetchEtlChecks(customerId: string, etlId: string, allPassed: boolean): Promise<ModuleChecksDto> {
    const { data } = await this.http.get<ModuleChecksDto>(
      `${path(customerId, { kind: 'etl', id: etlId })}/checks`,
      { params: allPassed ? { passed: 'all' } : undefined },
    );
    return data;
  }

  async retestChecks(customerId: string, source: CheckSource, checkIds: readonly string[]): Promise<void> {
    await this.http.post(`${path(customerId, source)}/retests`, { checks: checkIds });
  }
}

const notFound = (what: string): AppError => ({
  kind: 'not-found',
  status: 404,
  message: `${what} not found.`,
});

/** In-memory store seeded from the design; retested checks pass after 2.4 s like the prototype. */
export class ModuleChecksMockDataSource implements ModuleChecksDataSource {
  /** Retested check keys per customer/source. */
  private readonly retested = new Map<string, Set<string>>();

  private applyRetests(customerId: string, source: CheckSource, dto: ModuleChecksDto): ModuleChecksDto {
    const done = this.retested.get(`${customerId}/${source.kind}/${source.id}`) ?? new Set<string>();
    dto.checks = dto.checks.map((c) =>
      done.has(c.key) && c.status !== 'PASSED'
        ? {
            ...c,
            status: 'PASSED',
            checked_at: null,
            http_code: c.method === 'WS' ? 101 : 200,
            latency_ms: 164,
            latency_note: '',
            error: null,
          }
        : c,
    );
    return dto;
  }

  async fetchModuleChecks(
    customerId: string,
    moduleId: string,
    allPassed: boolean,
  ): Promise<ModuleChecksDto> {
    await mockLatency();
    let dto: ModuleChecksDto;
    try {
      dto = moduleChecksSeed(customerId, moduleId, allPassed);
    } catch {
      throw notFound('Module');
    }
    return this.applyRetests(customerId, { kind: 'module', id: moduleId }, dto);
  }

  async fetchEtlChecks(customerId: string, etlId: string, allPassed: boolean): Promise<ModuleChecksDto> {
    await mockLatency();
    let dto: ModuleChecksDto;
    try {
      dto = etlChecksSeed(customerId, etlId, allPassed);
    } catch {
      throw notFound('ETL job');
    }
    return this.applyRetests(customerId, { kind: 'etl', id: etlId }, dto);
  }

  async retestChecks(customerId: string, source: CheckSource, checkIds: readonly string[]): Promise<void> {
    await delay(2400);
    const key = `${customerId}/${source.kind}/${source.id}`;
    const set = this.retested.get(key) ?? new Set<string>();
    checkIds.forEach((id) => set.add(id));
    this.retested.set(key, set);
  }
}
