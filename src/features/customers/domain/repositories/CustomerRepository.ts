import type { CustomerList } from '../entities';

export interface CustomerRepository {
  getCustomers(): Promise<CustomerList>;
}
