import type { AxiosInstance } from 'axios';

import { mockLatency } from '@/core/utils';
import { customersSeed } from '@/mocks/customers';

import type { CustomerListDto } from '../dto/CustomerDto';

export interface CustomersDataSource {
  fetchCustomers(): Promise<CustomerListDto>;
}

export class CustomersRemoteDataSource implements CustomersDataSource {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async fetchCustomers(): Promise<CustomerListDto> {
    const { data } = await this.http.get<CustomerListDto>('/customers');
    return data;
  }
}

export class CustomersMockDataSource implements CustomersDataSource {
  async fetchCustomers(): Promise<CustomerListDto> {
    await mockLatency();
    return structuredClone(customersSeed);
  }
}
