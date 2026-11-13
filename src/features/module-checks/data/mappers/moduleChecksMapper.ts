import { istTimeFromIso, statusFromDto } from '@/core/network';

import type { ApiCheck, HttpMethod, ModuleChecks } from '../../domain';
import type { ApiCheckDto, ModuleChecksDto } from '../dto/ModuleChecksDto';

const METHOD: Record<ApiCheckDto['method'], HttpMethod> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DEL',
  WS: 'WS',
};

export const toApiCheck = (dto: ApiCheckDto): ApiCheck => ({
  id: dto.key,
  name: dto.name,
  method: METHOD[dto.method],
  path: dto.path,
  status: statusFromDto(dto.status),
  checkedAt: dto.checked_at ? istTimeFromIso(dto.checked_at, true) : null,
  httpCode: dto.http_code,
  latencyMs: dto.latency_ms,
  latencyNote: dto.latency_note,
  error: dto.error ?? '',
});

export const toModuleChecks = (dto: ModuleChecksDto): ModuleChecks => ({
  customerId: dto.customer_slug,
  customerShortName: dto.customer_short_name,
  source: { kind: dto.subject_kind === 'ETL' ? 'etl' : 'module', id: dto.subject_key },
  name: dto.subject_name,
  lastCheck: istTimeFromIso(dto.last_check_at, true),
  avgLatencyMs: dto.avg_latency_ms,
  latestRunId: dto.latest_run_id,
  checks: dto.checks.map(toApiCheck),
  morePassed: dto.more_passed,
});
