import type { StatusDto } from '@/core/network';

export interface OverviewDto {
  as_of: string;
  customers: { passed: number; warning: number; failed: number };
  window: {
    start: string;
    cutoff: string;
    scale_end: string;
    market_note: string;
    runs_done: number;
    runs_total: number;
    last_run_at: string;
    next_run_at: string;
  };
  stats: {
    failed_checks: number;
    failed_etl: number;
    failed_api: number;
    warnings: number;
    warnings_note: string;
    etl_done: number;
    etl_total: number;
    avg_run_seconds: number;
  };
  attention: {
    customer_slug: string;
    customer_name: string;
    status: StatusDto;
    text: string;
    at: string;
  }[];
  unread_alerts: number;
}

export interface RetestResultDto {
  queued: number;
}
