import type { AxiosInstance } from 'axios';

import type { AppError } from '@/core/domain';
import type { StatusDto } from '@/core/network';
import { delay, mockLatency } from '@/core/utils';
import { customerDetailSeed } from '@/mocks/customerDetail';

import type { CustomerDetailDto } from '../dto/CustomerDetailDto';

export interface CustomerDetailDataSource {
  fetchCustomerDetail(customerId: string): Promise<CustomerDetailDto>;
  retestEtlJobs(customerId: string, jobIds: readonly string[]): Promise<void>;
}

export class CustomerDetailRemoteDataSource implements CustomerDetailDataSource {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async fetchCustomerDetail(customerId: string): Promise<CustomerDetailDto> {
    const { data } = await this.http.get<CustomerDetailDto>(`/customers/${encodeURIComponent(customerId)}`);
    return data;
  }

  async retestEtlJobs(customerId: string, jobIds: readonly string[]): Promise<void> {
    await this.http.post(`/customers/${encodeURIComponent(customerId)}/etl/retests`, { jobs: jobIds });
  }
}

const RANK: Record<StatusDto, number> = { FAILED: 0, WARNING: 1, RUNNING: 2, PASSED: 3 };

/** In-memory store seeded from the design data; retests turn jobs green after 2.2 s like the prototype. */
export class CustomerDetailMockDataSource implements CustomerDetailDataSource {
  private readonly store = new Map<string, CustomerDetailDto>();

  private load(customerId: string): CustomerDetailDto {
    let dto = this.store.get(customerId);
    if (!dto) {
      try {
        dto = customerDetailSeed(customerId);
      } catch {
        throw { kind: 'not-found', status: 404, message: 'Customer not found.' } satisfies AppError;
      }
      this.store.set(customerId, dto);
    }
    return dto;
  }

  async fetchCustomerDetail(customerId: string): Promise<CustomerDetailDto> {
    await mockLatency();
    return structuredClone(this.load(customerId));
  }

  async retestEtlJobs(customerId: string, jobIds: readonly string[]): Promise<void> {
    const dto = this.load(customerId);
    await delay(2200);
    for (const j of dto.etl_jobs) {
      if (jobIds.includes(j.key))
        Object.assign(j, { status: 'PASSED', finished_at: null, message: 'Just now · retest passed' });
    }
    const statuses: StatusDto[] = [
      ...dto.etl_jobs.map((j) => j.status),
      ...dto.modules.map((m): StatusDto => (m.failures ? 'FAILED' : m.warnings ? 'WARNING' : 'PASSED')),
    ];
    dto.status = statuses.reduce((w, s) => (RANK[s] < RANK[w] ? s : w), 'PASSED');
  }
}
