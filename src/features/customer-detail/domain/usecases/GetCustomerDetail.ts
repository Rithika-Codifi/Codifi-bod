import type { CustomerDetail } from '../entities';
import type { CustomerDetailRepository } from '../repositories/CustomerDetailRepository';

export class GetCustomerDetail {
  private readonly repository: CustomerDetailRepository;

  constructor(repository: CustomerDetailRepository) {
    this.repository = repository;
  }

  execute(customerId: string): Promise<CustomerDetail> {
    return this.repository.getCustomerDetail(customerId);
  }
}
