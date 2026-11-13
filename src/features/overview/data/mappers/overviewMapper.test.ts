import { overviewSeed } from '@/mocks/overview';

import { toOverview } from './overviewMapper';

describe('overviewMapper', () => {
  it('maps the seed to the overview entity', () => {
    const o = toOverview(overviewSeed);
    expect(o.now).toBe('07:42');
    expect(o.customers).toEqual({ pass: 12, warn: 3, fail: 2 });
    expect(o.window).toMatchObject({
      start: '05:30',
      cutoff: '08:30',
      end: '09:00',
      runsDone: 3,
      lastRun: '07:38',
    });
    expect(o.stats).toMatchObject({ failedChecks: 9, etlDone: 130, etlTotal: 136, avgRunSeconds: 228 });
    expect(o.attention[0]).toEqual({
      customerId: 'cholamandalam',
      customerName: 'Cholamandalam Securities',
      status: 'fail',
      text: 'Contract master (NSE F&O) upload failed · +2 more',
      time: '07:31',
    });
    expect(o.unreadAlerts).toBe(5);
  });
});
