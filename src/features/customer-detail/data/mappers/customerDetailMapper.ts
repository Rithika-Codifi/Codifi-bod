import { istTimeFromIso, statusFromDto } from '@/core/network';

import type { CustomerDetail, EtlJob } from '../../domain';
import type { CustomerDetailDto, EtlJobDto } from '../dto/CustomerDetailDto';

export const toEtlJob = (dto: EtlJobDto): EtlJob => ({
  id: dto.key,
  name: dto.name,
  status: statusFromDto(dto.status),
  meta: dto.finished_at ? `${istTimeFromIso(dto.finished_at)} · ${dto.message}` : dto.message,
});

export const toCustomerDetail = (dto: CustomerDetailDto): CustomerDetail => ({
  id: dto.slug,
  name: dto.name,
  status: statusFromDto(dto.status),
  segments: dto.segments,
  lastRun: istTimeFromIso(dto.last_run_at),
  latestRunId: dto.latest_run_id,
  etl: dto.etl_jobs.map(toEtlJob),
  modules: dto.modules.map((m) => ({
    id: m.key,
    name: m.name,
    passed: m.passed,
    warnings: m.warnings,
    failures: m.failures,
    note: m.note,
  })),
});
