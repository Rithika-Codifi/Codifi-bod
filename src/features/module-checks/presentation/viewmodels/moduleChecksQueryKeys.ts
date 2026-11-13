import type { CheckSource } from '../../domain';

export const moduleChecksQueryKeys = {
  all: ['module-checks'] as const,
  /** Everything for one customer module or ETL job. */
  subject: (customerId: string, source: CheckSource) =>
    [...moduleChecksQueryKeys.all, customerId, source.kind, source.id] as const,
  list: (customerId: string, source: CheckSource, allPassed: boolean) =>
    [...moduleChecksQueryKeys.subject(customerId, source), { allPassed }] as const,
  retest: (customerId: string, source: CheckSource) =>
    [...moduleChecksQueryKeys.subject(customerId, source), 'retest'] as const,
};
