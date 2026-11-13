import { istTimeFromIso, statusFromDto } from '@/core/network';

import type { Overview } from '../../domain';
import type { OverviewDto } from '../dto/OverviewDto';

export const toOverview = (dto: OverviewDto): Overview => ({
  asOf: new Date(dto.as_of),
  now: istTimeFromIso(dto.as_of),
  customers: { pass: dto.customers.passed, warn: dto.customers.warning, fail: dto.customers.failed },
  window: {
    start: istTimeFromIso(dto.window.start),
    cutoff: istTimeFromIso(dto.window.cutoff),
    end: istTimeFromIso(dto.window.scale_end),
    marketNote: dto.window.market_note,
    runsDone: dto.window.runs_done,
    runsTotal: dto.window.runs_total,
    lastRun: istTimeFromIso(dto.window.last_run_at),
    nextRun: istTimeFromIso(dto.window.next_run_at),
  },
  stats: {
    failedChecks: dto.stats.failed_checks,
    failedEtl: dto.stats.failed_etl,
    failedApi: dto.stats.failed_api,
    warnings: dto.stats.warnings,
    warningsNote: dto.stats.warnings_note,
    etlDone: dto.stats.etl_done,
    etlTotal: dto.stats.etl_total,
    avgRunSeconds: dto.stats.avg_run_seconds,
  },
  attention: dto.attention.map((a) => ({
    customerId: a.customer_slug,
    customerName: a.customer_name,
    status: statusFromDto(a.status),
    text: a.text,
    time: istTimeFromIso(a.at),
  })),
  unreadAlerts: dto.unread_alerts,
});
