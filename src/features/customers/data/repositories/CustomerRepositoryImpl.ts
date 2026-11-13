import type { CustomerList, CustomerRepository } from '../../domain';
import type { CustomersDataSource } from '../datasources/CustomersDataSource';
import { toCustomerList } from '../mappers/customerMapper';

export class CustomerRepositoryImpl implements CustomerRepository {
  private readonly source: CustomersDataSource;

  constructor(source: CustomersDataSource) {
    this.source = source;
  }

  async getCustomers(): Promise<CustomerList> {
    return toCustomerList(await this.source.fetchCustomers());
  }
}
