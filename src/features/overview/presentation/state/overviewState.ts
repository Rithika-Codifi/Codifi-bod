import type { Status } from '@/core/domain';
import { formatHeaderDateIST } from '@/core/utils';

import { minutesToCutoff, overallStatus, totalOf, windowRatio, type Overview } from '../../domain';

export type OverviewIntent = { type: 'refresh' } | { type: 'retestAllFailed' } | { type: 'retry' };

const HERO: Record<Exclude<Status, 'running'>, { title: string; sub: (o: Overview) => string }> = {
  fail: {
    title: 'Action needed',
    sub: (o) => `${o.customers.fail} customers failed BOD · ${o.customers.warn} have warnings`,
  },
  warn: { title: 'Mostly ready', sub: (o) => `No failures · ${o.customers.warn} customers have warnings` },
  pass: {
    title: 'All systems go',
    sub: (o) => `${totalOf(o.customers)} of ${totalOf(o.customers)} customers passed BOD`,
  },
};

const pct = (n: number, total: number) => `${total === 0 ? '0.0' : ((n / total) * 100).toFixed(1)}%`;

/** Pure projection of the overview entity into what the view renders. */
export function selectOverview(o: Overview) {
  const total = totalOf(o.customers);
  const overall = overallStatus(o.customers);
  const hero = HERO[overall === 'running' ? 'pass' : overall];
  const w = o.window;
  return {
    header: { date: formatHeaderDateIST(o.asOf), alerts: o.unreadAlerts },
    hero: {
      status: overall,
      title: hero.title,
      sub: hero.sub(o),
      total,
      bar: [
        { status: 'fail' as const, n: o.customers.fail },
        { status: 'warn' as const, n: o.customers.warn },
        { status: 'pass' as const, n: o.customers.pass },
      ],
      legend: [
        { status: 'fail' as const, label: 'Failed', n: o.customers.fail, pct: pct(o.customers.fail, total) },
        { status: 'warn' as const, label: 'Warning', n: o.customers.warn, pct: pct(o.customers.warn, total) },
        { status: 'pass' as const, label: 'Passed', n: o.customers.pass, pct: pct(o.customers.pass, total) },
      ],
    },
    window: {
      marketNote: w.marketNote,
      startLabel: `${w.start} start`,
      nowLabel: `${o.now} now`,
      cutoffLabel: `${w.cutoff} cutoff`,
      nowRatio: windowRatio(w, o.now),
      cutoffRatio: windowRatio(w, w.cutoff),
      runTitle: `Sanity run ${w.runsDone} of ${w.runsTotal} done`,
      runMeta: `Last ${w.lastRun} · next auto run ${w.nextRun}`,
      timeLeft: `${minutesToCutoff(w, o.now)}m left`,
    },
    attention: o.attention.map((a) => ({
      key: `${a.customerId}-${a.time}`,
      href: `/customers/${a.customerId}`,
      name: a.customerName,
      status: a.status,
      text: a.text,
      time: a.time,
    })),
    canRetest: o.stats.failedChecks > 0,
  };
}

export type OverviewModel = ReturnType<typeof selectOverview>;

export type OverviewViewState =
  | { readonly status: 'loading' }
  | { readonly status: 'error'; readonly message: string; readonly retrying: boolean }
  | {
      readonly status: 'success';
      readonly model: OverviewModel;
      readonly refreshing: boolean;
      readonly retesting: boolean;
    };
