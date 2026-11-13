import type { StatusDto } from '@/core/network';

export interface CustomerDto {
  slug: string;
  code: string;
  name: string;
  status: StatusDto;
  etl_passed: number;
  etl_total: number;
  api_passed: number;
  api_total: number;
  /** ISO 8601 with offset, e.g. "2026-11-12T07:38:00+05:30". */
  last_check_at: string;
}

export interface CustomerListDto {
  updated_at: string;
  customers: CustomerDto[];
}
