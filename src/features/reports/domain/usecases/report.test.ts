import { timeIST } from '@/core/domain';

import { durationSeconds, passRate, runTotal, type TestRun } from '../entities';
import type { ReportRepository } from '../repositories/ReportRepository';

import { GetTestRun } from './GetTestRun';

const run = {
  startedAt: new Date('2026-11-12T07:35:31+05:30'),
  finishedAt: new Date('2026-11-12T07:38:12+05:30'),
  counts: { pass: 31, warn: 1, fail: 2 },
  failures: [
    { id: 'w', status: 'warn', at: timeIST('07:38:07') },
    { id: 'f', status: 'fail', at: timeIST('07:38:05') },
  ],
} as unknown as TestRun;

describe('test run rules', () => {
  it('computes totals, pass rate and duration', () => {
    expect(runTotal(run)).toBe(34);
    expect(passRate(run)).toBe(91.2);
    expect(durationSeconds(run)).toBe(161);
  });
  it('orders failures before warnings', async () => {
    const repo: ReportRepository = { getRun: () => Promise.resolve(run), retestRun: vi.fn() };
    expect((await new GetTestRun(repo).execute('4812')).failures.map((f) => f.id)).toEqual(['f', 'w']);
  });
});
