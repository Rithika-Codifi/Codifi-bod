import type { ModuleChecksDto } from '@/features/module-checks/data/dto/ModuleChecksDto';

import { customerDetailSeed } from './customerDetail';
import { moduleChecksSeed } from './moduleChecks';

/**
 * Checks shown when an ETL row is tapped: the customer's Open API checks screen, exactly as
 * docs/design/4-module-checks.png ("Open API checks", "Module", 31 / 1 / 2 of 34).
 * The ETL job key is validated so unknown jobs still 404.
 */
export function etlChecksSeed(slug: string, etlKey: string, allPassed = false): ModuleChecksDto {
  const job = customerDetailSeed(slug).etl_jobs.find((j) => j.key === etlKey);
  if (!job) throw Object.assign(new Error('Not found'), { status: 404 });
  return moduleChecksSeed(slug, 'open-api', allPassed);
}
