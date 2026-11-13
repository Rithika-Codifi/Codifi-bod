import { bySeverity, SEVERITY, type Status } from '@/core/domain';

import type { Customer, CustomerList } from '../entities';
import type { CustomerRepository } from '../repositories/CustomerRepository';

export interface CustomersOverview extends CustomerList {
  /** Worst status across all customers. */
  readonly overall: Status;
}

/** Loads all customers, sorted by severity (fail → warn → pass), keeping source order within a group. */
export class GetCustomers {
  private readonly repository: CustomerRepository;

  constructor(repository: CustomerRepository) {
    this.repository = repository;
  }

  async execute(): Promise<CustomersOverview> {
    const list = await this.repository.getCustomers();
    const customers = [...list.customers].sort(bySeverity);
    return { ...list, customers, overall: worstStatus(customers) };
  }
}

export function worstStatus(customers: readonly Customer[]): Status {
  return customers.reduce<Status>(
    (worst, c) => (SEVERITY[c.status] < SEVERITY[worst] ? c.status : worst),
    'pass',
  );
}
