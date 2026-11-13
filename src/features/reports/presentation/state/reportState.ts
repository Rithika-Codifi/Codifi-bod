import type { Status } from '@/core/domain';
import { formatDuration, formatTimeIST } from '@/core/utils';

import { durationSeconds, passRate, runTotal, type TestRun } from '../../domain';

export type ReportIntent = { type: 'print' } | { type: 'share' } | { type: 'retest' } | { type: 'retry' };

const WORD: Record<Status, string> = { pass: 'PASS', warn: 'WARN', fail: 'FAIL', running: 'RUN' };

/** 140 → "140 ms", 1240 → "1.24 s", 30000 → "30.0 s" */
export function formatLatency(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  const s = ms / 1000;
  return `${s < 10 ? s.toFixed(2) : s.toFixed(1)} s`;
}

/** Pure projection of a test run into what the report view renders. */
export function selectReport(r: TestRun) {
  const total = runTotal(r);
  return {
    header: {
      backHref: `/customers/${r.customerId}/modules/${r.moduleId}`,
      backLabel: r.moduleName,
      runLabel: `Run #${r.id}`,
      status: r.status,
      subtitle: `${r.customerName} · ${r.moduleName} sanity`,
    },
    meta: [
      { label: 'Trigger', value: `${r.trigger === 'scheduled' ? 'Scheduled' : 'Manual'} · ${r.scheduledAt}` },
      { label: 'Duration', value: formatDuration(durationSeconds(r)) },
      { label: 'Started', value: `${formatTimeIST(r.startedAt, true)} IST` },
      { label: 'Finished', value: `${formatTimeIST(r.finishedAt, true)} IST` },
      { label: 'Environment', value: r.environment },
      { label: 'Suite', value: r.suite },
    ],
    result: {
      summary: `${total} checks · ${passRate(r)}% pass`,
      segments: [
        { status: 'fail' as const, n: r.counts.fail, width: 34 },
        { status: 'warn' as const, n: r.counts.warn, width: 30 },
        { status: 'pass' as const, n: r.counts.pass },
      ],
      history: r.history.map((h) => ({
        key: h.runId,
        href: `/reports/${h.runId}`,
        current: h.runId === r.id,
        time: h.time,
        status: h.status,
      })),
    },
    failures: r.failures.map((f) => ({
      id: f.id,
      status: f.status,
      name: f.name,
      request: `${f.method} ${f.path} · ${f.at}`,
      message: f.message,
      log: f.log,
      hint: f.hint,
    })),
    checks: {
      showing: `Showing ${r.checks.length} of ${total}`,
      rows: r.checks.map((c, i) => ({
        key: `${i}-${c.name}`,
        name: c.name,
        time: formatLatency(c.latencyMs),
        word: WORD[c.status],
        status: c.status,
      })),
    },
    share: { title: `Test report · Run #${r.id}`, text: `${r.customerName} · ${r.moduleName} sanity` },
  };
}

export type ReportModel = ReturnType<typeof selectReport>;

export type ReportViewState =
  | { readonly status: 'loading' }
  | {
      readonly status: 'error';
      readonly message: string;
      readonly retrying: boolean;
      readonly notFound: boolean;
    }
  | { readonly status: 'success'; readonly model: ReportModel; readonly retesting: boolean };
