import type { StatusDto } from '@/core/network';

export interface EtlJobDto {
  key: string;
  name: string;
  status: StatusDto;
  /** null while running */
  finished_at: string | null;
  message: string;
}

export interface ModuleSummaryDto {
  key: string;
  name: string;
  passed: number;
  warnings: number;
  failures: number;
  note: string;
}

export interface CustomerDetailDto {
  slug: string;
  name: string;
  status: StatusDto;
  segments: string[];
  last_run_at: string;
  latest_run_id: string;
  etl_jobs: EtlJobDto[];
  modules: ModuleSummaryDto[];
}
