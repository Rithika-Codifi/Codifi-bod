import { bySeverity } from '@/core/domain';

import type { Overview } from '../entities';
import type { OverviewRepository } from '../repositories/OverviewRepository';

/** Loads today's overview; attention items are sorted fail → warn, keeping source order. */
export class GetOverview {
  private readonly repository: OverviewRepository;

  constructor(repository: OverviewRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Overview> {
    const overview = await this.repository.getOverview();
    return { ...overview, attention: [...overview.attention].sort(bySeverity) };
  }
}
