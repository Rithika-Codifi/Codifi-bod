import type { StatusDto } from '@/core/network';

export interface ApiCheckDto {
  key: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WS';
  path: string;
  status: StatusDto;
  checked_at: string | null;
  http_code: number;
  latency_ms: number;
  latency_note: string;
  error: string | null;
}

export interface ModuleChecksDto {
  customer_slug: string;
  customer_short_name: string;
  /** What the checks belong to. */
  subject_kind: 'MODULE' | 'ETL';
  subject_key: string;
  subject_name: string;
  last_check_at: string;
  avg_latency_ms: number;
  latest_run_id: string;
  checks: ApiCheckDto[];
  more_passed: number;
}
