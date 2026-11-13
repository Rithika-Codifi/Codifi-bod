import type { StatusDto } from '@/core/network';

export interface TestRunDto {
  id: string;
  customer_slug: string;
  customer_name: string;
  module_key: string;
  module_name: string;
  suite: string;
  trigger: 'SCHEDULED' | 'MANUAL';
  scheduled_at: string;
  started_at: string;
  finished_at: string;
  environment: string;
  status: StatusDto;
  passed: number;
  warnings: number;
  failures: number;
  history: { run_id: string; started_at: string; status: StatusDto }[];
  issues: {
    key: string;
    status: StatusDto;
    name: string;
    method: string;
    path: string;
    at: string;
    message: string;
    log: string;
    hint: string;
  }[];
  checks: { name: string; latency_ms: number; status: StatusDto }[];
}
