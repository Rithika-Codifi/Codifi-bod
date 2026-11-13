import { istTimeFromIso, statusFromDto } from '@/core/network';

import type { TestRun } from '../../domain';
import type { TestRunDto } from '../dto/TestRunDto';

export const toTestRun = (dto: TestRunDto): TestRun => ({
  id: dto.id,
  customerId: dto.customer_slug,
  customerName: dto.customer_name,
  moduleId: dto.module_key,
  moduleName: dto.module_name,
  suite: dto.suite,
  trigger: dto.trigger === 'SCHEDULED' ? 'scheduled' : 'manual',
  scheduledAt: istTimeFromIso(dto.scheduled_at),
  startedAt: new Date(dto.started_at),
  finishedAt: new Date(dto.finished_at),
  environment: dto.environment,
  status: statusFromDto(dto.status),
  counts: { pass: dto.passed, warn: dto.warnings, fail: dto.failures },
  history: dto.history.map((h) => ({
    runId: h.run_id,
    time: istTimeFromIso(h.started_at),
    status: statusFromDto(h.status),
  })),
  failures: dto.issues.map((i) => ({
    id: i.key,
    status: statusFromDto(i.status),
    name: i.name,
    method: i.method,
    path: i.path,
    at: istTimeFromIso(i.at, true),
    message: i.message,
    log: i.log,
    hint: i.hint,
  })),
  checks: dto.checks.map((c) => ({ name: c.name, latencyMs: c.latency_ms, status: statusFromDto(c.status) })),
});
