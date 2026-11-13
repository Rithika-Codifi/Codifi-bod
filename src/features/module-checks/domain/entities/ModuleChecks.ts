import type { Status, TimeIST } from '@/core/domain';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DEL' | 'WS';

/** What the checks belong to: a customer module (e.g. Open API) or an ETL job. */
export interface CheckSource {
  readonly kind: 'module' | 'etl';
  readonly id: string;
}

export interface ApiCheck {
  readonly id: string;
  readonly name: string;
  readonly method: HttpMethod;
  readonly path: string;
  readonly status: Status;
  /** null right after a retest ("Just now"). */
  readonly checkedAt: TimeIST | null;
  readonly httpCode: number;
  readonly latencyMs: number;
  /** e.g. "timeout", "SLA 800", "first tick" */
  readonly latencyNote: string;
  /** Failure explanation, empty when none. */
  readonly error: string;
}

export interface ModuleChecks {
  readonly customerId: string;
  readonly customerShortName: string;
  readonly source: CheckSource;
  /** Module or ETL job name, e.g. "Open API", "Contract master · NSE F&O". */
  readonly name: string;
  readonly lastCheck: TimeIST;
  readonly avgLatencyMs: number;
  readonly latestRunId: string;
  /** Checks returned in this page (all non-passing + some passing). */
  readonly checks: readonly ApiCheck[];
  /** Passed checks not included in `checks`. */
  readonly morePassed: number;
}

export interface CheckCounts {
  readonly pass: number;
  readonly warn: number;
  readonly fail: number;
  readonly total: number;
}

export function countChecks(m: ModuleChecks): CheckCounts {
  const n = (s: Status) => m.checks.filter((c) => c.status === s).length;
  const pass = n('pass') + m.morePassed;
  const warn = n('warn');
  const fail = n('fail');
  return { pass, warn, fail, total: m.checks.length + m.morePassed };
}

export const moduleChecksStatus = (c: CheckCounts): Status => (c.fail ? 'fail' : c.warn ? 'warn' : 'pass');

export const retestableCheckIds = (m: ModuleChecks): string[] =>
  m.checks.filter((c) => c.status === 'fail' || c.status === 'warn').map((c) => c.id);
