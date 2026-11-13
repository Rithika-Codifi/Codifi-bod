import { toTestRun } from '@/features/reports/data';
import { testRunSeed } from '@/mocks/testRun';

import { formatLatency, selectReport } from './reportState';

describe('selectReport', () => {
  const m = selectReport(toTestRun(testRunSeed('4812')));

  it('builds header and meta exactly as the design', () => {
    expect(m.header).toMatchObject({
      backLabel: 'Open API',
      runLabel: 'Run #4812',
      subtitle: 'Cholamandalam Securities · Open API sanity',
      backHref: '/customers/cholamandalam/modules/open-api',
    });
    expect(m.meta.map((x) => x.value)).toEqual([
      'Scheduled · 07:35',
      '2m 41s',
      '07:35:31 IST',
      '07:38:12 IST',
      'Production',
      'open-api-sanity',
    ]);
    expect(m.result.summary).toBe('34 checks · 91.2% pass');
    expect(m.failures[0]?.request).toBe('POST /orders/regular · 07:38:05');
    expect(m.checks.showing).toBe('Showing 10 of 34');
    expect(m.checks.rows.map((r) => `${r.time} ${r.word}`).slice(0, 3)).toEqual([
      '140 ms PASS',
      '96 ms PASS',
      '30.0 s FAIL',
    ]);
  });

  it('formats latency', () => {
    expect(formatLatency(58)).toBe('58 ms');
    expect(formatLatency(1240)).toBe('1.24 s');
    expect(formatLatency(30000)).toBe('30.0 s');
  });
});
