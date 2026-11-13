import type { CustomerDetail, CustomerDetailRepository } from '../../domain';
import type { CustomerDetailDataSource } from '../datasources/CustomerDetailDataSource';
import { toCustomerDetail } from '../mappers/customerDetailMapper';

export class CustomerDetailRepositoryImpl implements CustomerDetailRepository {
  private readonly source: CustomerDetailDataSource;

  constructor(source: CustomerDetailDataSource) {
    this.source = source;
  }

  async getCustomerDetail(customerId: string): Promise<CustomerDetail> {
    return toCustomerDetail(await this.source.fetchCustomerDetail(customerId));
  }

  retestEtlJobs(customerId: string, jobIds: readonly string[]): Promise<void> {
    return this.source.retestEtlJobs(customerId, jobIds);
  }
}
