import type { CustomerDetail } from '../entities';

export interface CustomerDetailRepository {
  getCustomerDetail(customerId: string): Promise<CustomerDetail>;
  /** Reruns the given ETL jobs; resolves when the retest has finished. */
  retestEtlJobs(customerId: string, jobIds: readonly string[]): Promise<void>;
}
