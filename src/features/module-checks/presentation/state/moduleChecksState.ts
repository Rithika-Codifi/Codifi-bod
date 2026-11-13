import type { Status } from '@/core/domain';
import { formatIndianNumber } from '@/core/utils';

import { moduleChecksStatus, type ApiCheck, type HttpMethod, type ModuleChecks } from '../../domain';

export type CheckFilter = 'all' | 'fail' | 'warn' | 'pass';

export type ModuleChecksIntent =
  | { type: 'filter'; status: CheckFilter }
  | { type: 'showMore' }
  | { type: 'retestFailed' }
  | { type: 'retestCheck'; checkId: string }
  | { type: 'retry' };

export interface ModuleChecksUiState {
  readonly filter: CheckFilter;
  readonly allPassed: boolean;
}

export const initialModuleChecksUiState: ModuleChecksUiState = { filter: 'all', allPassed: false };

export function moduleChecksReducer(
  state: ModuleChecksUiState,
  intent: ModuleChecksIntent,
): ModuleChecksUiState {
  switch (intent.type) {
    case 'filter':
      return state.filter === intent.status ? state : { ...state, filter: intent.status };
    case 'showMore':
      return state.allPassed ? state : { ...state, allPassed: true };
    default:
      return state;
  }
}

export interface CheckRowModel {
  readonly id: string;
  readonly name: string;
  readonly method: HttpMethod;
  readonly path: string;
  readonly status: Status;
  readonly running: boolean;
  readonly time: string;
  readonly code: string;
  readonly codeIsError: boolean;
  readonly latency: string;
  readonly latencyTone: 'muted' | 'warn' | 'fail';
  readonly error: string;
  readonly reportHref: string;
}

export function latencyLabel(c: Pick<ApiCheck, 'latencyMs' | 'latencyNote' | 'status'>): string {
  const base = `${formatIndianNumber(c.latencyMs)} ms`;
  if (!c.latencyNote) return base;
  return c.status === 'pass' ? `${base} ${c.latencyNote}` : `${base} · ${c.latencyNote}`;
}

/** Pure projection of server data + UI state + running retests into the view model. */
export function selectModuleChecks(m: ModuleChecks, ui: ModuleChecksUiState, running: ReadonlySet<string>) {
  const reportHref = `/reports/${m.latestRunId}`;
  const rows: CheckRowModel[] = m.checks.map((c) => {
    const isRunning = running.has(c.id);
    /** HTTP 0 = the step never ran (e.g. an ETL step after a failed one). */
    const notRun = c.httpCode === 0;
    const status: Status = isRunning ? 'running' : c.status;
    return {
      id: c.id,
      name: c.name,
      method: c.method,
      path: c.path,
      status,
      running: isRunning,
      time: isRunning ? 'Retesting…' : (c.checkedAt ?? 'Just now'),
      code: isRunning || notRun ? '—' : String(c.httpCode),
      codeIsError: status === 'fail',
      latency: isRunning ? '' : notRun ? 'not run' : latencyLabel(c),
      latencyTone: status === 'fail' ? 'fail' : status === 'warn' ? 'warn' : 'muted',
      error: status === 'fail' ? c.error : '',
      reportHref,
    };
  });
  const n = (s: Status) => rows.filter((r) => r.status === s).length;
  const counts = {
    pass: n('pass') + m.morePassed,
    warn: n('warn'),
    fail: n('fail'),
    total: m.checks.length + m.morePassed,
  };
  const visible = rows.filter((r) => ui.filter === 'all' || r.status === ui.filter);
  return {
    header: {
      backHref: `/customers/${m.customerId}`,
      backLabel: m.customerShortName,
      kindLabel: m.source.kind === 'etl' ? 'ETL job' : 'Module',
      title: m.name,
      sub: `Last check ${m.lastCheck} · avg ${m.avgLatencyMs} ms`,
      status: moduleChecksStatus(counts),
      counts,
      /** Fixed 34px warn/fail segments as in the design, unless nothing passed (then all grow). */
      bar: [
        { status: 'pass' as const, n: counts.pass },
        { status: 'warn' as const, n: counts.warn, ...(counts.pass > 0 ? { width: 34 } : {}) },
        { status: 'fail' as const, n: counts.fail, ...(counts.pass > 0 ? { width: 34 } : {}) },
      ],
      reportHref,
      retestIds: m.checks
        .filter((c) => (c.status === 'fail' || c.status === 'warn') && !running.has(c.id))
        .map((c) => c.id),
    },
    chips: [
      { key: 'all' as const, label: 'All', count: counts.total },
      { key: 'fail' as const, label: 'Failed', count: counts.fail },
      { key: 'warn' as const, label: 'Warning', count: counts.warn },
      { key: 'pass' as const, label: 'Passed', count: counts.pass },
    ],
    rows: visible,
    showMore:
      m.morePassed > 0 && (ui.filter === 'all' || ui.filter === 'pass')
        ? `Show ${m.morePassed} more passed checks`
        : null,
  };
}

export type ModuleChecksModel = ReturnType<typeof selectModuleChecks>;

export type ModuleChecksViewState =
  | { readonly status: 'loading'; readonly filter: CheckFilter }
  | {
      readonly status: 'error';
      readonly filter: CheckFilter;
      readonly message: string;
      readonly retrying: boolean;
      readonly notFound: boolean;
    }
  | {
      readonly status: 'success';
      readonly filter: CheckFilter;
      readonly model: ModuleChecksModel;
      readonly retestingFailed: boolean;
      readonly loadingMore: boolean;
    };
