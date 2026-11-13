import { timeIST } from '@/core/domain';

import type { BodWindow, Overview } from '../entities';
import { overallStatus } from '../entities';
import type { OverviewRepository } from '../repositories/OverviewRepository';

import { minutesToCutoff, windowRatio } from './bodWindow';
import { GetOverview } from './GetOverview';
import { RetestAllFailed } from './RetestAllFailed';

const w: BodWindow = {
  start: timeIST('05:30'),
  cutoff: timeIST('08:30'),
  end: timeIST('09:00'),
  marketNote: '',
  runsDone: 3,
  runsTotal: 4,
  lastRun: timeIST('07:38'),
  nextRun: timeIST('08:00'),
};

describe('bod window', () => {
  it('places now and cutoff on the 05:30 → 09:00 scale', () => {
    expect(Math.round(windowRatio(w, timeIST('07:42')) * 100)).toBe(63);
    expect(Math.round(windowRatio(w, w.cutoff) * 100)).toBe(86);
    expect(windowRatio(w, timeIST('04:00'))).toBe(0);
  });
  it('computes minutes left', () => {
    expect(minutesToCutoff(w, timeIST('07:42'))).toBe(48);
    expect(minutesToCutoff(w, timeIST('09:10'))).toBe(0);
  });
});

describe('overview use cases', () => {
  const overview = {
    attention: [
      { customerId: 'a', customerName: 'A', status: 'warn', text: '', time: timeIST('07:20') },
      { customerId: 'b', customerName: 'B', status: 'fail', text: '', time: timeIST('07:31') },
    ],
  } as unknown as Overview;
  const repo: OverviewRepository = {
    getOverview: () => Promise.resolve(overview),
    retestAllFailed: () => Promise.resolve({ queued: 9 }),
  };

  it('sorts attention items by severity', async () => {
    const result = await new GetOverview(repo).execute();
    expect(result.attention.map((a) => a.customerId)).toEqual(['b', 'a']);
  });
  it('retests all failed', async () => {
    expect(await new RetestAllFailed(repo).execute()).toEqual({ queued: 9 });
  });
  it('derives the overall status', () => {
    expect(overallStatus({ pass: 12, warn: 3, fail: 2 })).toBe('fail');
    expect(overallStatus({ pass: 14, warn: 3, fail: 0 })).toBe('warn');
    expect(overallStatus({ pass: 17, warn: 0, fail: 0 })).toBe('pass');
  });
});
