import { timeIST } from '@/core/domain';

import {
  countChecks,
  moduleChecksStatus,
  retestableCheckIds,
  type ApiCheck,
  type ModuleChecks,
} from '../entities';
import type { ModuleChecksRepository } from '../repositories/ModuleChecksRepository';

import { GetEtlChecks } from './GetEtlChecks';
import { GetModuleChecks } from './GetModuleChecks';
import { RetestChecks } from './RetestChecks';

const check = (id: string, status: ApiCheck['status']): ApiCheck => ({
  id,
  name: id,
  method: 'GET',
  path: '/',
  status,
  checkedAt: timeIST('07:38:05'),
  httpCode: 200,
  latencyMs: 100,
  latencyNote: '',
  error: '',
});

const m: ModuleChecks = {
  customerId: 'c',
  customerShortName: 'C',
  source: { kind: 'module', id: 'open-api' },
  name: 'Open API',
  lastCheck: timeIST('07:38:12'),
  avgLatencyMs: 182,
  latestRunId: '4812',
  checks: [check('p1', 'pass'), check('w1', 'warn'), check('f1', 'fail'), check('f2', 'fail')],
  morePassed: 21,
};

describe('module checks', () => {
  it('counts including hidden passed checks', () => {
    const c = countChecks(m);
    expect(c).toEqual({ pass: 22, warn: 1, fail: 2, total: 25 });
    expect(moduleChecksStatus(c)).toBe('fail');
    expect(retestableCheckIds(m)).toEqual(['w1', 'f1', 'f2']);
  });

  it('sorts failures first and retests de-duplicated ids', async () => {
    const retestChecks = vi.fn<ModuleChecksRepository['retestChecks']>().mockResolvedValue();
    const repo: ModuleChecksRepository = {
      getModuleChecks: () => Promise.resolve(m),
      getEtlChecks: () => Promise.resolve({ ...m, source: { kind: 'etl', id: 'cm-fo' } }),
      retestChecks,
    };
    const result = await new GetModuleChecks(repo).execute('c', 'open-api');
    expect(result.checks.map((x) => x.id)).toEqual(['f1', 'f2', 'w1', 'p1']);
    const etl = await new GetEtlChecks(repo).execute('c', 'cm-fo');
    expect(etl.checks.map((x) => x.id)).toEqual(['f1', 'f2', 'w1', 'p1']);
    await new RetestChecks(repo).execute('c', { kind: 'etl', id: 'cm-fo' }, ['f1', 'f1']);
    expect(retestChecks).toHaveBeenCalledWith('c', { kind: 'etl', id: 'cm-fo' }, ['f1']);
  });
});
