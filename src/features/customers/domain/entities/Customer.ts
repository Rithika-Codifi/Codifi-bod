import type { Status, TimeIST } from '@/core/domain';

export interface Ratio {
  readonly ok: number;
  readonly total: number;
}

export interface Customer {
  /** URL slug, e.g. "cholamandalam". */
  readonly id: string;
  /** Broker code, e.g. "CUST-004". */
  readonly code: string;
  readonly name: string;
  readonly status: Status;
  readonly etl: Ratio;
  readonly api: Ratio;
  readonly lastCheck: TimeIST;
}

export interface CustomerList {
  readonly customers: readonly Customer[];
  readonly updatedAt: TimeIST;
}

/** Share of ETL jobs + API checks that passed (0–1). */
export const healthRatio = (c: Customer): number => {
  const total = c.etl.total + c.api.total;
  return total === 0 ? 0 : (c.etl.ok + c.api.ok) / total;
};
