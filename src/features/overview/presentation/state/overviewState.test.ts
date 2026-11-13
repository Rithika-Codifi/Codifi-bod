import { toOverview } from '@/features/overview/data';
import { overviewSeed } from '@/mocks/overview';

import { selectOverview } from './overviewState';

describe('selectOverview', () => {
  const m = selectOverview(toOverview(overviewSeed));

  it('builds the hero exactly as the design', () => {
    expect(m.hero).toMatchObject({
      status: 'fail',
      title: 'Action needed',
      sub: '2 customers failed BOD · 3 have warnings',
      total: 17,
    });
    expect(m.hero.legend.map((l) => l.pct)).toEqual(['11.8%', '17.6%', '70.6%']);
    expect(m.hero.bar.map((s) => s.status)).toEqual(['fail', 'warn', 'pass']);
  });

  it('builds header and window copy', () => {
    expect(m.header).toEqual({ date: 'Thu · 12 Nov 2026 · 07:42 IST', alerts: 5 });
    expect(m.window).toMatchObject({
      startLabel: '05:30 start',
      nowLabel: '07:42 now',
      cutoffLabel: '08:30 cutoff',
      runTitle: 'Sanity run 3 of 4 done',
      runMeta: 'Last 07:38 · next auto run 08:00',
      timeLeft: '48m left',
    });
    expect(m.attention[0]?.href).toBe('/customers/cholamandalam');
  });
});
