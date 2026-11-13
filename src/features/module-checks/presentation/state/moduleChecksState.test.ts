import { toModuleChecks } from '@/features/module-checks/data';
import { etlChecksSeed } from '@/mocks/etlChecks';
import { moduleChecksSeed } from '@/mocks/moduleChecks';

import {
  initialModuleChecksUiState,
  latencyLabel,
  moduleChecksReducer,
  selectModuleChecks,
} from './moduleChecksState';

const m = toModuleChecks(moduleChecksSeed('cholamandalam', 'open-api', false));

describe('moduleChecksReducer', () => {
  it('sets filter and expands once', () => {
    const s = moduleChecksReducer(initialModuleChecksUiState, { type: 'filter', status: 'fail' });
    expect(s).toEqual({ filter: 'fail', allPassed: false });
    const e = moduleChecksReducer(s, { type: 'showMore' });
    expect(e.allPassed).toBe(true);
    expect(moduleChecksReducer(e, { type: 'showMore' })).toBe(e);
  });
});

describe('selectModuleChecks', () => {
  it('matches the design copy and counts', () => {
    const v = selectModuleChecks(m, initialModuleChecksUiState, new Set());
    expect(v.header).toMatchObject({
      backLabel: 'Cholamandalam Sec.',
      sub: 'Last check 07:38:12 · avg 182 ms',
      status: 'fail',
      counts: { pass: 31, warn: 1, fail: 2, total: 34 },
      retestIds: ['place', 'modify', 'funds'],
    });
    expect(v.chips.map((c) => `${c.label} · ${c.count}`)).toEqual([
      'All · 34',
      'Failed · 2',
      'Warning · 1',
      'Passed · 31',
    ]);
    expect(v.rows[0]).toMatchObject({
      time: '07:38:05',
      code: '502',
      latency: '30,000 ms · timeout',
      latencyTone: 'fail',
    });
    expect(v.rows.find((r) => r.id === 'ws')?.latency).toBe('58 ms first tick');
    expect(v.showMore).toBe('Show 21 more passed checks');
  });

  it('filters and hides "show more" for failures', () => {
    const v = selectModuleChecks(m, { filter: 'fail', allPassed: false }, new Set());
    expect(v.rows.map((r) => r.id)).toEqual(['place', 'modify']);
    expect(v.showMore).toBeNull();
  });

  it('overlays running checks', () => {
    const v = selectModuleChecks(m, initialModuleChecksUiState, new Set(['place']));
    expect(v.rows[0]).toMatchObject({
      status: 'running',
      time: 'Retesting…',
      code: '—',
      latency: '',
      error: '',
    });
    expect(v.header.counts.fail).toBe(1);
  });

  it('formats latency', () => {
    expect(latencyLabel({ latencyMs: 1240, latencyNote: 'SLA 800', status: 'warn' })).toBe(
      '1,240 ms · SLA 800',
    );
    expect(latencyLabel({ latencyMs: 96, latencyNote: '', status: 'pass' })).toBe('96 ms');
  });

  it('shows the design screen for an ETL job', () => {
    const v = selectModuleChecks(
      toModuleChecks(etlChecksSeed('cholamandalam', 'cm-fo')),
      initialModuleChecksUiState,
      new Set(),
    );
    expect(v.header).toMatchObject({
      kindLabel: 'Module',
      title: 'Open API',
      backLabel: 'Cholamandalam Sec.',
    });
    expect(v.header.counts).toEqual({ pass: 31, warn: 1, fail: 2, total: 34 });
  });

  it('marks steps that never ran and grows the bar when nothing passed', () => {
    const notRun = {
      ...m,
      checks: m.checks.map((c) => ({ ...c, status: 'fail' as const, httpCode: 0 })),
      morePassed: 0,
    };
    const v = selectModuleChecks(notRun, initialModuleChecksUiState, new Set());
    expect(v.rows[0]).toMatchObject({ code: '—', latency: 'not run' });
    expect(v.header.bar.find((s) => s.status === 'fail')).not.toHaveProperty('width');
    expect(selectModuleChecks(m, initialModuleChecksUiState, new Set()).header.bar[2]).toMatchObject({
      width: 34,
    });
  });
});
