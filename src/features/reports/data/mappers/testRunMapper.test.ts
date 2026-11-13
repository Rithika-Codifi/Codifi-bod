import { testRunSeed } from '@/mocks/testRun';

import { toTestRun } from './testRunMapper';

describe('testRunMapper', () => {
  it('maps run #4812', () => {
    const r = toTestRun(testRunSeed('4812'));
    expect(r).toMatchObject({
      id: '4812',
      customerName: 'Cholamandalam Securities',
      moduleName: 'Open API',
      trigger: 'scheduled',
      scheduledAt: '07:35',
      status: 'fail',
      counts: { pass: 31, warn: 1, fail: 2 },
    });
    expect(r.history.map((h) => `${h.time} ${h.status}`)).toEqual([
      '05:45 pass',
      '06:30 pass',
      '07:00 warn',
      '07:35 fail',
    ]);
    expect(r.failures[0]).toMatchObject({ method: 'POST', path: '/orders/regular', at: '07:38:05' });
    expect(r.checks).toHaveLength(10);
  });

  it('resolves "latest"', () => {
    expect(testRunSeed('latest').id).toBe('4812');
  });
});
