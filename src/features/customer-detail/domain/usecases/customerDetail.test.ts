import { timeIST } from '@/core/domain';

import { etlPassed, modulesHealthy, moduleStatus, retestableJobIds, type CustomerDetail } from '../entities';
import type { CustomerDetailRepository } from '../repositories/CustomerDetailRepository';

import { RetestEtlJobs } from './RetestEtlJobs';

const detail: CustomerDetail = {
  id: 'c',
  name: 'C',
  status: 'fail',
  segments: [],
  lastRun: timeIST('07:38'),
  latestRunId: '4812',
  etl: [
    { id: 'a', name: 'A', status: 'pass', meta: '' },
    { id: 'b', name: 'B', status: 'fail', meta: '' },
    { id: 'c', name: 'C', status: 'warn', meta: '' },
  ],
  modules: [
    { id: 'm1', name: 'M1', passed: 31, warnings: 1, failures: 2, note: '' },
    { id: 'm2', name: 'M2', passed: 9, warnings: 1, failures: 0, note: '' },
    { id: 'm3', name: 'M3', passed: 24, warnings: 0, failures: 0, note: '' },
  ],
};

describe('customer detail rules', () => {
  it('counts passed ETL jobs and healthy modules', () => {
    expect(etlPassed(detail)).toBe(1);
    expect(modulesHealthy(detail)).toBe(1);
    expect(detail.modules.map(moduleStatus)).toEqual(['fail', 'warn', 'pass']);
  });
  it('retests failed and warning jobs, de-duplicated, and skips empty sets', async () => {
    expect(retestableJobIds(detail)).toEqual(['b', 'c']);
    const retestEtlJobs = vi.fn<CustomerDetailRepository['retestEtlJobs']>().mockResolvedValue();
    const repo = { getCustomerDetail: vi.fn(), retestEtlJobs };
    await new RetestEtlJobs(repo).execute('c', ['b', 'b', 'c']);
    expect(retestEtlJobs).toHaveBeenCalledWith('c', ['b', 'c']);
    await new RetestEtlJobs(repo).execute('c', []);
    expect(retestEtlJobs).toHaveBeenCalledTimes(1);
  });
});
